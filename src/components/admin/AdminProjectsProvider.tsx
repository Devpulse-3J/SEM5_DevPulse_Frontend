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
import {
  cloneSeedMembers,
  cloneSeedProjects,
  cloneSeedRepos,
} from "@/lib/mock/projects";
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
 * A full page reload still resets to the seed data, by design.
 *
 * Every mutator here is a placeholder: it logs under `[TODO API]` and updates
 * local state. The TODO comment above each names the endpoint that replaces it.
 */

/** How long the mocked sync sits in SYNCING before settling. */
const MOCK_SYNC_MS = 1800;

interface AdminProjectsContextValue {
  projects: Project[];
  reposByProject: Record<string, LinkedRepo | undefined>;
  membersByProject: Record<string, ProjectMember[]>;

  getProject: (projectId: string) => Project | undefined;
  getRepo: (projectId: string) => LinkedRepo | undefined;
  getMembers: (projectId: string) => ProjectMember[];

  createProject: (data: CreateProjectRequest) => Project;
  updateProject: (projectId: string, data: UpdateProjectRequest) => void;
  deleteProject: (projectId: string) => void;

  reconnectGithub: (projectId: string) => void;
  syncRepo: (projectId: string) => void;
  cycleGithubStatus: (projectId: string) => void;

  inviteMember: (projectId: string, data: InviteMemberRequest) => void;
  changeMemberRole: (
    projectId: string,
    memberId: string,
    role: ProjectRoleLabel
  ) => void;
  removeMember: (projectId: string, memberId: string) => void;

  resetDemoData: () => void;
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
  const [projects, setProjects] = useState<Project[]>(cloneSeedProjects);
  const [reposByProject, setReposByProject] = useState<
    Record<string, LinkedRepo | undefined>
  >(cloneSeedRepos);
  const [membersByProject, setMembersByProject] = useState<
    Record<string, ProjectMember[]>
  >(cloneSeedMembers);
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

  // TODO: Replace with `projectService.create(data)` then
  //       `projectService.linkGithub(id, { url, secret })`
  //       Endpoints: POST /api/projects
  //                  POST /api/projects/{id}/github/link
  const createProject = useCallback(
    (data: CreateProjectRequest): Project => {
      console.log("[TODO API] Create project + link GitHub:", data);

      const id = `local-${Date.now()}`;
      const url = normaliseGithubRepoUrl(data.githubRepoUrl);
      const parsed = parseGithubRepoUrl(url);

      const project: Project = {
        id,
        name: data.name,
        description: data.description,
        jiraProjectKey: data.jiraProjectKey,
        githubRepoUrl: url,
        memberCount: 0,
        createdAt: new Date().toISOString(),
      };

      const repo: LinkedRepo = {
        id: `local-repo-${Date.now()}`,
        projectId: id,
        url,
        // The form will not submit an unparseable URL, so this fallback is
        // defensive only.
        owner: parsed?.owner ?? "unknown",
        name: parsed?.name ?? "unknown",
        webhookSecret: data.webhookSecret,
        status: "CONNECTED",
        lastSyncedAt: undefined,
      };

      setProjects((prev) => [...prev, project]);
      setReposByProject((prev) => ({ ...prev, [id]: repo }));
      setMembersByProject((prev) => ({ ...prev, [id]: [] }));

      showToast(
        "success",
        "Project created",
        `“${project.name}” added locally and linked to ${repo.owner}/${repo.name}.`
      );
      return project;
    },
    [showToast]
  );

  // TODO: Replace with `projectService.update(projectId, data)`
  //       Endpoint: PUT /api/projects/{id}
  const updateProject = useCallback(
    (projectId: string, data: UpdateProjectRequest) => {
      console.log("[TODO API] Update project:", { projectId, ...data });

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

      showToast("success", "Project updated", `“${data.name}” saved locally.`);
    },
    [showToast]
  );

  // TODO: Replace with `projectService.remove(projectId)`
  //       Endpoint: DELETE /api/projects/{id}
  const deleteProject = useCallback(
    (projectId: string) => {
      const name = projects.find((p) => p.id === projectId)?.name ?? projectId;
      console.log("[TODO API] Delete project:", { projectId, name });

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

      showToast("success", "Project deleted", `“${name}” removed locally.`);
    },
    [projects, showToast]
  );

  // TODO: Replace with `projectService.linkGithub(projectId, { url, secret })`
  //       Endpoint: POST /api/projects/{id}/github/link
  const reconnectGithub = useCallback(
    (projectId: string) => {
      const repo = reposByProject[projectId];
      console.log("[TODO API] Reconnect GitHub:", {
        projectId,
        url: repo?.url,
      });

      setReposByProject((prev) => {
        const current = prev[projectId];
        if (!current) return prev;
        return { ...prev, [projectId]: { ...current, status: "CONNECTED" } };
      });

      showToast(
        "success",
        "GitHub reconnected",
        repo ? `${repo.owner}/${repo.name} marked connected.` : "Marked connected."
      );
    },
    [reposByProject, showToast]
  );

  // TODO: Replace with `projectService.syncGithub(projectId)`
  //       Endpoint: POST /api/projects/{id}/github/sync
  const syncRepo = useCallback(
    (projectId: string) => {
      const repo = reposByProject[projectId];
      console.log("[TODO API] Sync repo:", { projectId, url: repo?.url });

      setReposByProject((prev) => {
        const current = prev[projectId];
        if (!current) return prev;
        return { ...prev, [projectId]: { ...current, status: "SYNCING" } };
      });

      const existing = syncTimers.current.get(projectId);
      if (existing) clearTimeout(existing);

      const timer = setTimeout(() => {
        syncTimers.current.delete(projectId);
        setReposByProject((prev) => {
          const current = prev[projectId];
          if (!current) return prev;
          return {
            ...prev,
            [projectId]: {
              ...current,
              status: "CONNECTED",
              lastSyncedAt: new Date().toISOString(),
            },
          };
        });
        showToast(
          "success",
          "Sync finished",
          "Mock sync completed — no data was fetched."
        );
      }, MOCK_SYNC_MS);

      syncTimers.current.set(projectId, timer);
      showToast("info", "Sync started", "Mock sync running…");
    },
    [reposByProject, showToast]
  );

  // TODO: Replace with `projectService.githubStatus(projectId)`
  //       Endpoint: GET /api/projects/{id}/github/status
  //       Until that exists this button just rotates the badge so all three
  //       states are reachable in a demo.
  const cycleGithubStatus = useCallback(
    (projectId: string) => {
      setReposByProject((prev) => {
        const current = prev[projectId];
        if (!current) return prev;
        const order = ["CONNECTED", "SYNCING", "DISCONNECTED"] as const;
        const next = order[(order.indexOf(current.status) + 1) % order.length];
        console.log("[TODO API] Check GitHub status:", {
          projectId,
          from: current.status,
          to: next,
        });
        return { ...prev, [projectId]: { ...current, status: next } };
      });
    },
    []
  );

  // TODO: Replace with `projectService.inviteMember(projectId, data)`
  //       Endpoint: POST /api/projects/{id}/invite
  const inviteMember = useCallback(
    (projectId: string, data: InviteMemberRequest) => {
      console.log("[TODO API] Invite member:", { projectId, ...data });

      const member: ProjectMember = {
        id: `local-m-${Date.now()}`,
        userId: `local-u-${Date.now()}`,
        email: data.email,
        // No real name until the invite is accepted — the email is all we know.
        fullName: data.email.split("@")[0],
        role: data.role,
        joinedAt: new Date().toISOString(),
        status: "PENDING",
      };

      setMembersByProject((prev) => ({
        ...prev,
        [projectId]: [...(prev[projectId] ?? []), member],
      }));
      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId
            ? { ...project, memberCount: project.memberCount + 1 }
            : project
        )
      );

      showToast(
        "success",
        "Invite queued",
        `${data.email} added locally as ${data.role} (pending).`
      );
    },
    [showToast]
  );

  // TODO: Replace with `projectService.updateMemberRole(projectId, userId, role)`
  //       Endpoint: PUT /api/projects/{id}/members/{userId}
  const changeMemberRole = useCallback(
    (projectId: string, memberId: string, role: ProjectRoleLabel) => {
      console.log("[TODO API] Change role:", { projectId, memberId, role });

      setMembersByProject((prev) => ({
        ...prev,
        [projectId]: (prev[projectId] ?? []).map((member) =>
          member.id === memberId ? { ...member, role } : member
        ),
      }));

      showToast("success", "Role updated", `Member is now ${role}.`);
    },
    [showToast]
  );

  // TODO: Replace with `projectService.removeMember(projectId, userId)`
  //       Endpoint: DELETE /api/projects/{id}/members/{userId}
  const removeMember = useCallback(
    (projectId: string, memberId: string) => {
      const member = (membersByProject[projectId] ?? []).find(
        (m) => m.id === memberId
      );
      console.log("[TODO API] Remove member:", {
        projectId,
        memberId,
        email: member?.email,
      });

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
    },
    [membersByProject, showToast]
  );

  /** Restores the seed data so the same demo can be run again. */
  const resetDemoData = useCallback(() => {
    console.log("[TODO API] Reset demo data (no endpoint — local only)");
    syncTimers.current.forEach((timer) => clearTimeout(timer));
    syncTimers.current.clear();

    setProjects(cloneSeedProjects());
    setReposByProject(cloneSeedRepos());
    setMembersByProject(cloneSeedMembers());
    showToast("info", "Demo data reset", "All local changes discarded.");
  }, [showToast]);

  const value = useMemo<AdminProjectsContextValue>(
    () => ({
      projects,
      reposByProject,
      membersByProject,
      getProject,
      getRepo,
      getMembers,
      createProject,
      updateProject,
      deleteProject,
      reconnectGithub,
      syncRepo,
      cycleGithubStatus,
      inviteMember,
      changeMemberRole,
      removeMember,
      resetDemoData,
      showToast,
    }),
    [
      projects,
      reposByProject,
      membersByProject,
      getProject,
      getRepo,
      getMembers,
      createProject,
      updateProject,
      deleteProject,
      reconnectGithub,
      syncRepo,
      cycleGithubStatus,
      inviteMember,
      changeMemberRole,
      removeMember,
      resetDemoData,
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
