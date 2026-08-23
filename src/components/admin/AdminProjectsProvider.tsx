"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { Toast } from "@/components/notifications/Toast";
import type { ToastMessage } from "@/store/notificationSlice";
import { projectService } from "@/services/project.service";
import type {
  ProjectApiResponse,
  ProjectMemberApiResponse,
} from "@/services/project.service";
import {
  normaliseGithubRepoUrl,
  parseGithubRepoUrl,
} from "@/lib/projectValidation";
import type {
  CreateProjectRequest,
  InviteMemberRequest,
  LinkedRepo,
  Project,
  ProjectMember,
  ProjectRoleLabel,
  UpdateProjectRequest,
} from "@/types/adminProject";

/**
 * In-memory store for the admin Projects screens.
 *
 * Why a context rather than `useState` inside each page: the list and the
 * detail route are two separate components, and a plain `useState` in either
 * one is discarded the moment Next swaps the route. Every invite, role change
 * and rename would vanish on "← Back to projects", which makes the flow
 * impossible to demo. The state still IS `useState` — this only lifts it above
 * the route boundary. No store library is involved.
 *
 * Mutators without a backend endpoint still update local state. Project
 * creation and GitHub linking are persisted through `projectService`.
 */

/** How often to poll GET .../github/status while a sync is in flight. */
const SYNC_POLL_MS = 1800;
/** Give up polling after this many attempts (~1 min at SYNC_POLL_MS). */
const MAX_SYNC_POLLS = 40;

const LINKED_REPOS_KEY = "devpulse_linked_repos";

function loadCachedRepos(): Record<string, LinkedRepo> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LINKED_REPOS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCachedRepo(projectId: string, repo: LinkedRepo | undefined) {
  if (typeof window === "undefined") return;
  try {
    const cached = loadCachedRepos();
    if (repo) {
      cached[projectId] = repo;
    } else {
      delete cached[projectId];
    }
    localStorage.setItem(LINKED_REPOS_KEY, JSON.stringify(cached));
  } catch {
    // ignore storage quota errors
  }
}

function mapApiProject(project: ProjectApiResponse): Project {
  return {
    id: String(project.projectId),
    name: project.projectName,
    description: project.description,
    jiraProjectKey: project.jiraProjectKey,
    githubRepoUrl: project.githubRepoUrl,
    memberCount: project.memberCount ?? 0,
    createdAt: project.createdAt ?? new Date().toISOString(),
  };
}

function mapApiProjectRepo(project: ProjectApiResponse): LinkedRepo | undefined {
  if (!project.githubRepoUrl) return undefined;
  const url = normaliseGithubRepoUrl(project.githubRepoUrl);
  const parsed = parseGithubRepoUrl(url);
  return {
    id: `repo-${project.projectId}`,
    projectId: String(project.projectId),
    url,
    owner: parsed?.owner ?? "unknown",
    name: parsed?.name ?? "unknown",
    status: "CONNECTED",
  };
}

function mapApiMember(
  member: ProjectMemberApiResponse,
  index: number
): ProjectMember {
  const id = String(
    member.memberId ?? member.id ?? member.userId ?? `member-${index}`
  );
  const email = member.email ?? "";
  const role: ProjectRoleLabel =
    String(member.role ?? "").toUpperCase() === "MANAGER"
      ? "MANAGER"
      : "DEVELOPER";
  return {
    id,
    userId: String(member.userId ?? id),
    email,
    // No real name until the invite is accepted — the email is all we know.
    fullName: member.fullName ?? member.name ?? email.split("@")[0] ?? "Unknown",
    role,
    joinedAt: member.joinedAt ?? member.createdAt ?? new Date().toISOString(),
    status: String(member.status ?? "").toUpperCase() === "PENDING"
      ? "PENDING"
      : "ACTIVE",
  };
}

interface AdminProjectsContextValue {
  projects: Project[];
  isLoadingProjects: boolean;
  reposByProject: Record<string, LinkedRepo | undefined>;
  membersByProject: Record<string, ProjectMember[]>;

  getProject: (projectId: string) => Project | undefined;
  getRepo: (projectId: string) => LinkedRepo | undefined;
  getMembers: (projectId: string) => ProjectMember[];

  createProject: (data: CreateProjectRequest) => Promise<Project>;
  updateProject: (projectId: string, data: UpdateProjectRequest) => void;
  deleteProject: (projectId: string) => void;

  getConnectUrl: (projectId: string) => Promise<string>;
  linkRepoUrl: (projectId: string, repoUrl: string) => Promise<void>;
  reconnectGithub: (projectId: string) => void;
  syncRepo: (projectId: string) => void;
  cycleGithubStatus: (projectId: string) => void;

  inviteMember: (projectId: string, data: InviteMemberRequest) => Promise<void>;
  refreshMembers: (projectId: string) => Promise<void>;
  refreshRepoStatus: (projectId: string) => Promise<void>;
  changeMemberRole: (
    projectId: string,
    memberId: string,
    role: ProjectRoleLabel
  ) => void;
  removeMember: (projectId: string, memberId: string) => void;

  refreshProjects: () => Promise<void>;
  showToast: (
    type: ToastMessage["type"],
    title: string,
    message: string
  ) => void;
}

const AdminProjectsContext = createContext<AdminProjectsContextValue | null>(
  null
);

export function useAdminProjects(): AdminProjectsContextValue {
  const context = useContext(AdminProjectsContext);
  if (!context) {
    throw new Error(
      "useAdminProjects must be used inside <AdminProjectsProvider>"
    );
  }
  return context;
}

export function AdminProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [reposByProject, setReposByProject] = useState<
    Record<string, LinkedRepo | undefined>
  >(() => loadCachedRepos());
  const [membersByProject, setMembersByProject] = useState<
    Record<string, ProjectMember[]>
  >({});
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Pending mock-sync timers, so unmounting mid-sync does not fire setState on
  // a dead component.
  const syncTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );
  useEffect(() => {
    const timers = syncTimers.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const showToast = useCallback(
    (type: ToastMessage["type"], title: string, message: string) => {
      setToasts((prev) => [
        ...prev,
        {
          id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          type,
          title,
          message,
        },
      ]);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const refreshProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    try {
      const response = await projectService.getAll();
      const loadedProjects = response.map(mapApiProject);
      setProjects(loadedProjects);
      const cached = loadCachedRepos();
      const serverRepos = Object.fromEntries(
        response.map((project) => [
          String(project.projectId),
          mapApiProjectRepo(project) ?? cached[String(project.projectId)],
        ])
      );
      setReposByProject((prev) => ({ ...cached, ...serverRepos, ...prev }));
      setMembersByProject((previous) =>
        Object.fromEntries(
          loadedProjects.map((project) => [project.id, previous[project.id] ?? []])
        )
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Could not load projects.";
      showToast("error", "Projects could not be loaded", message);
    } finally {
      setIsLoadingProjects(false);
    }
  }, [showToast]);

  useEffect(() => {
    const timer = setTimeout(() => void refreshProjects(), 0);
    return () => clearTimeout(timer);
  }, [refreshProjects]);

  /**
   * Members are NOT loaded by `refreshProjects` — the list endpoint carries a
   * count, not the people. The detail page calls this on mount, and every
   * member mutation re-runs it so the list reflects the server, not a guess.
   */
  const refreshMembers = useCallback(
    async (projectId: string) => {
      try {
        const response = await projectService.getMembers(projectId);
        setMembersByProject((prev) => ({
          ...prev,
          [projectId]: response.map(mapApiMember),
        }));
        setProjects((prev) =>
          prev.map((project) =>
            project.id === projectId
              ? { ...project, memberCount: response.length }
              : project
          )
        );
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Could not load members.";
        showToast("error", "Members could not be loaded", message);
      }
    },
    [showToast]
  );

  const getProject = useCallback(
    (projectId: string) => projects.find((p) => p.id === projectId),
    [projects]
  );

  const getRepo = useCallback(
    (projectId: string) => reposByProject[projectId],
    [reposByProject]
  );

  const getMembers = useCallback(
    (projectId: string) => membersByProject[projectId] ?? [],
    [membersByProject]
  );

  const createProject = useCallback(
    async (data: CreateProjectRequest): Promise<Project> => {
      const url = data.githubRepoUrl ? normaliseGithubRepoUrl(data.githubRepoUrl) : undefined;
      const parsed = url ? parseGithubRepoUrl(url) : undefined;
      try {
        const created = await projectService.create({
          projectName: data.name,
          description: data.description,
          githubRepoUrl: url,
          jiraProjectKey: data.jiraProjectKey,
        });
        const id = String(created.projectId);
        
        let repo: LinkedRepo | undefined;
        if (url) {
          const linked = await projectService.linkGithub(id, { repoUrl: url });
          repo = {
            id: String(linked.repositoryId ?? linked.id ?? `repo-${id}`),
            projectId: id,
            url: linked.repoUrl ?? linked.url ?? url,
            owner: linked.owner ?? parsed?.owner ?? "unknown",
            name: linked.repositoryName ?? linked.name ?? parsed?.name ?? "unknown",
            status: linked.status ?? "CONNECTED",
            lastSyncedAt: linked.lastSyncedAt,
          };
          saveCachedRepo(id, repo);
        }

        const project: Project = {
          id,
          name: created.projectName,
          description: created.description ?? data.description,
          jiraProjectKey: created.jiraProjectKey ?? data.jiraProjectKey,
          githubRepoUrl: created.githubRepoUrl ?? url,
          memberCount: created.memberCount ?? 0,
          createdAt: created.createdAt ?? new Date().toISOString(),
        };

        setProjects((prev) => [...prev, project]);
        setReposByProject((prev) => ({ ...prev, [id]: repo }));
        setMembersByProject((prev) => ({ ...prev, [id]: [] }));
        showToast(
          "success",
          "Project created",
          repo
            ? `“${project.name}” created and linked to ${repo.owner}/${repo.name}.`
            : `“${project.name}” created.`
        );
        return project;
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Could not create the project.";
        showToast("error", "Project creation failed", message);
        throw error;
      }
    },
    [showToast]
  );

  /** GET /api/integrations/projects/{id}/github/status */
  const refreshRepoStatus = useCallback(
    async (projectId: string) => {
      try {
        const status = await projectService.githubStatus(projectId);
        const urlRaw = status.url ?? status.repoUrl;
        if (urlRaw || status.owner) {
          const url = urlRaw ? normaliseGithubRepoUrl(urlRaw) : (reposByProject[projectId]?.url ?? "");
          const parsed = parseGithubRepoUrl(url);
          const repo: LinkedRepo = {
            id: String(status.repositoryId ?? status.id ?? `repo-${projectId}`),
            projectId,
            url,
            owner: status.owner ?? parsed?.owner ?? reposByProject[projectId]?.owner ?? "unknown",
            name: status.repositoryName ?? status.name ?? parsed?.name ?? reposByProject[projectId]?.name ?? "unknown",
            status: status.status ?? "CONNECTED",
            lastSyncedAt: status.lastSyncedAt ?? reposByProject[projectId]?.lastSyncedAt,
          };
          saveCachedRepo(projectId, repo);
          setReposByProject((prev) => ({ ...prev, [projectId]: repo }));
          setProjects((prev) =>
            prev.map((project) =>
              project.id === projectId
                ? { ...project, githubRepoUrl: url || project.githubRepoUrl }
                : project
            )
          );
        }
      } catch {
        // status endpoint might return error/404 if project has no repo linked yet
      }
    },
    [reposByProject]
  );

  /** PUT /api/projects/{id} */
  const updateProject = useCallback(
    async (projectId: string, data: UpdateProjectRequest) => {
      try {
        await projectService.update(projectId, {
          projectName: data.name,
          description: data.description,
          jiraProjectKey: data.jiraProjectKey,
        });

        setProjects((prev) =>
          prev.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  name: data.name,
                  description: data.description,
                  jiraProjectKey: data.jiraProjectKey,
                }
              : project
          )
        );

        showToast("success", "Project updated", `“${data.name}” saved.`);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Could not update the project.";
        showToast("error", "Project update failed", message);
      }
    },
    [showToast]
  );

  /** DELETE /api/projects/{id} */
  const deleteProject = useCallback(
    async (projectId: string) => {
      const name = projects.find((p) => p.id === projectId)?.name ?? projectId;
      try {
        await projectService.remove(projectId);

        saveCachedRepo(projectId, undefined);
        setProjects((prev) => prev.filter((project) => project.id !== projectId));
        setReposByProject((prev) => {
          const next = { ...prev };
          delete next[projectId];
          return next;
        });
        setMembersByProject((prev) => {
          const next = { ...prev };
          delete next[projectId];
          return next;
        });

        showToast("success", "Project deleted", `“${name}” removed.`);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Could not delete the project.";
        showToast("error", "Project deletion failed", message);
      }
    },
    [projects, showToast]
  );

  /** GET /api/integrations/projects/{id}/github/connect-url */
  const getConnectUrl = useCallback(async (projectId: string): Promise<string> => {
    const res = await projectService.getConnectUrl(projectId);
    return res.connectUrl;
  }, []);

  /** POST /api/integrations/projects/{id}/github/link */
  const linkRepoUrl = useCallback(
    async (projectId: string, repoUrl: string): Promise<void> => {
      const url = normaliseGithubRepoUrl(repoUrl);
      const parsed = parseGithubRepoUrl(url);
      try {
        const linked = await projectService.linkGithub(projectId, { repoUrl: url });
        const repo: LinkedRepo = {
          id: String(linked.repositoryId ?? linked.id ?? `repo-${projectId}`),
          projectId,
          url: linked.repoUrl ?? linked.url ?? url,
          owner: linked.owner ?? parsed?.owner ?? "unknown",
          name: linked.repositoryName ?? linked.name ?? parsed?.name ?? "unknown",
          status: linked.status ?? "CONNECTED",
          lastSyncedAt: linked.lastSyncedAt,
        };
        saveCachedRepo(projectId, repo);
        setReposByProject((prev) => ({ ...prev, [projectId]: repo }));
        setProjects((prev) =>
          prev.map((project) =>
            project.id === projectId
              ? { ...project, githubRepoUrl: url }
              : project
          )
        );
        showToast(
          "success",
          "GitHub connected",
          `${repo.owner}/${repo.name} linked successfully.`
        );
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to link repository.";
        showToast("error", "Link failed", message);
        throw error;
      }
    },
    [showToast]
  );

  /** POST /api/integrations/projects/{id}/github/link */
  const reconnectGithub = useCallback(
    async (projectId: string) => {
      const repo = reposByProject[projectId];
      if (!repo?.url) {
        showToast("error", "Reconnect failed", "No repository URL found for project.");
        return;
      }
      try {
        await projectService.linkGithub(projectId, { repoUrl: repo.url });

        setReposByProject((prev) => {
          const current = prev[projectId];
          if (!current) return prev;
          return { ...prev, [projectId]: { ...current, status: "CONNECTED" } };
        });

        showToast(
          "success",
          "GitHub reconnected",
          `${repo.owner}/${repo.name} connected.`
        );
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Could not reconnect GitHub.";
        showToast("error", "Reconnect failed", message);
      }
    },
    [reposByProject, showToast]
  );

  // POST /api/integrations/projects/{id}/github/sync, then poll
  // GET .../github/status until the sync settles (CONNECTED) or fails (ERROR).
  const syncRepo = useCallback(
    async (projectId: string) => {
      const repo = reposByProject[projectId];

      setReposByProject((prev) => {
        const current = prev[projectId];
        if (!current) return prev;
        return { ...prev, [projectId]: { ...current, status: "SYNCING" } };
      });

      const existing = syncTimers.current.get(projectId);
      if (existing) clearTimeout(existing);

      const markError = (message: string) => {
        syncTimers.current.delete(projectId);
        setReposByProject((prev) => {
          const current = prev[projectId];
          if (!current) return prev;
          return { ...prev, [projectId]: { ...current, status: "ERROR" } };
        });
        showToast("error", "Sync failed", message);
      };

      const poll = async (attempt: number) => {
        try {
          const status = await projectService.githubStatus(projectId);
          const nextStatus = status.status ?? "CONNECTED";

          setReposByProject((prev) => {
            const current = prev[projectId];
            if (!current) return prev;
            return {
              ...prev,
              [projectId]: {
                ...current,
                status: nextStatus,
                lastSyncedAt: status.lastSyncedAt ?? current.lastSyncedAt,
              },
            };
          });

          if (nextStatus === "CONNECTED" || nextStatus === "ERROR") {
            syncTimers.current.delete(projectId);
            showToast(
              nextStatus === "CONNECTED" ? "success" : "error",
              nextStatus === "CONNECTED" ? "Sync finished" : "Sync failed",
              nextStatus === "CONNECTED"
                ? "GitHub data synced."
                : "The sync did not complete. Check the integration service logs."
            );
            return;
          }

          if (attempt >= MAX_SYNC_POLLS) {
            markError("Status polling timed out. Try triggering the sync again.");
            return;
          }

          const timer = setTimeout(() => void poll(attempt + 1), SYNC_POLL_MS);
          syncTimers.current.set(projectId, timer);
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : "Could not read sync status.";
          markError(message);
        }
      };

      try {
        await projectService.syncGithub(projectId);
        showToast("info", "Sync started", "Fetching GitHub data…");
        const timer = setTimeout(() => void poll(0), SYNC_POLL_MS);
        syncTimers.current.set(projectId, timer);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Could not start the sync.";
        markError(message);
      }
    },
    [reposByProject, showToast]
  );

  /** GET /api/integrations/projects/{id}/github/status */
  const cycleGithubStatus = useCallback(
    async (projectId: string) => {
      try {
        const status = await projectService.githubStatus(projectId);
        const nextStatus = status.status ?? "CONNECTED";
        setReposByProject((prev) => {
          const current = prev[projectId];
          if (!current) return prev;
          return {
            ...prev,
            [projectId]: {
              ...current,
              status: nextStatus,
              lastSyncedAt: status.lastSyncedAt ?? current.lastSyncedAt,
            },
          };
        });
        showToast(
          "info",
          "GitHub Status",
          `Current GitHub status: ${nextStatus}`
        );
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Could not fetch GitHub status.";
        showToast("error", "Status check failed", message);
      }
    },
    [showToast]
  );

  /**
   * POST /api/projects/{id}/invite.
   *
   * Rethrows so the modal can stay open on failure — the two rejections that
   * actually happen (403 non-admin, 409 email owned by another company) are
   * both worth re-reading with the form still on screen.
   */
  const inviteMember = useCallback(
    async (projectId: string, data: InviteMemberRequest): Promise<void> => {
      try {
        await projectService.inviteMember(projectId, {
          email: data.email,
          role: data.role,
        });
        await refreshMembers(projectId);
        showToast(
          "success",
          "Invite sent",
          `${data.email} invited as ${data.role}.`
        );
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Could not send the invite.";
        showToast("error", "Invite failed", message);
        throw error;
      }
    },
    [refreshMembers, showToast]
  );

  /** PUT /api/projects/{id}/members/{memberId} */
  const changeMemberRole = useCallback(
    async (projectId: string, memberId: string, role: ProjectRoleLabel) => {
      try {
        await projectService.updateMemberRole(projectId, memberId, role);

        setMembersByProject((prev) => ({
          ...prev,
          [projectId]: (prev[projectId] ?? []).map((member) =>
            member.id === memberId ? { ...member, role } : member
          ),
        }));

        showToast("success", "Role updated", `Member is now ${role}.`);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Could not update member role.";
        showToast("error", "Role update failed", message);
      }
    },
    [showToast]
  );

  /** DELETE /api/projects/{id}/members/{memberId} */
  const removeMember = useCallback(
    async (projectId: string, memberId: string) => {
      const member = (membersByProject[projectId] ?? []).find(
        (m) => m.id === memberId
      );
      try {
        await projectService.removeMember(projectId, memberId);

        setMembersByProject((prev) => ({
          ...prev,
          [projectId]: (prev[projectId] ?? []).filter((m) => m.id !== memberId),
        }));
        setProjects((prev) =>
          prev.map((project) =>
            project.id === projectId
              ? { ...project, memberCount: Math.max(0, project.memberCount - 1) }
              : project
          )
        );

        showToast(
          "success",
          "Member removed",
          `${member?.email ?? "Member"} removed from the project.`
        );
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Could not remove member.";
        showToast("error", "Member removal failed", message);
      }
    },
    [membersByProject, showToast]
  );

  const value = useMemo<AdminProjectsContextValue>(
    () => ({
      projects,
      isLoadingProjects,
      reposByProject,
      membersByProject,
      getProject,
      getRepo,
      getMembers,
      createProject,
      updateProject,
      deleteProject,
      getConnectUrl,
      linkRepoUrl,
      reconnectGithub,
      syncRepo,
      cycleGithubStatus,
      inviteMember,
      changeMemberRole,
      removeMember,
      refreshProjects,
      refreshMembers,
      refreshRepoStatus,
      showToast,
    }),
    [
      projects,
      isLoadingProjects,
      reposByProject,
      membersByProject,
      getProject,
      getRepo,
      getMembers,
      createProject,
      updateProject,
      deleteProject,
      getConnectUrl,
      linkRepoUrl,
      reconnectGithub,
      syncRepo,
      cycleGithubStatus,
      inviteMember,
      changeMemberRole,
      removeMember,
      refreshProjects,
      refreshMembers,
      refreshRepoStatus,
      showToast,
    ]
  );

  return (
    <AdminProjectsContext.Provider value={value}>
      {toasts.length > 0 && (
        <div className="fixed right-6 top-20 z-50 flex w-80 flex-col gap-2">
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
          ))}
        </div>
      )}
      {children}
    </AdminProjectsContext.Provider>
  );
}

export default AdminProjectsProvider;
