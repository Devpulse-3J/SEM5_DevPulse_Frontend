"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/notifications/Toast";
import type { ToastMessage } from "@/store/notificationSlice";
import { CreateProjectModal } from "@/components/admin/CreateProjectModal";
import { InviteMemberModal } from "@/components/admin/InviteMemberModal";
import { MembersList } from "@/components/admin/MembersList";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import type {
  Project,
  ProjectMember,
  ProjectRoleLabel,
  CreateProjectRequest,
  InviteMemberRequest,
} from "@/types/adminProject";

/**
 * Admin → Projects.
 *
 * UI is complete; the backend is not. Every handler below updates local state
 * only and logs under `[TODO API]` so the wiring points are greppable.
 *
 * The list starts EMPTY on purpose — no seeded rows. Anything you see here is
 * something you created this session, and it is gone on refresh.
 *
 * Detail is an in-page view rather than a `/admin/projects/[id]` route: state
 * lives in this component's `useState`, so a route change would discard every
 * project and member you just added. Swap to a real route once a service backs
 * it.
 */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

type PendingConfirm =
  | { kind: "deleteProject"; project: Project }
  | { kind: "removeMember"; member: ProjectMember };

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [membersByProject, setMembersByProject] = useState<Record<string, ProjectMember[]>>({});

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [pendingConfirm, setPendingConfirm] = useState<PendingConfirm | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const selectedProject = projects.find((p) => p.id === selectedProjectId) ?? null;
  const selectedMembers = selectedProjectId
    ? (membersByProject[selectedProjectId] ?? [])
    : [];

  const pushToast = (type: ToastMessage["type"], title: string, message: string) => {
    setToasts((prev) => [
      ...prev,
      { id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, type, title, message },
    ]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // TODO: replace with `projectService.create(data)` when API is ready
  const handleCreateProject = (data: CreateProjectRequest) => {
    console.log("[TODO API] Create project:", data);
    const project: Project = {
      id: `local-${Date.now()}`,
      name: data.name,
      description: data.description,
      jiraProjectKey: data.jiraProjectKey,
      memberCount: 0,
      createdAt: new Date().toISOString(),
    };
    setProjects((prev) => [...prev, project]);
    setMembersByProject((prev) => ({ ...prev, [project.id]: [] }));
    setIsCreateOpen(false);
    pushToast("success", "Project created", `“${project.name}” added locally (not saved).`);
  };

  // TODO: replace with `projectService.delete(projectId)` when API is ready
  const handleDeleteProject = (project: Project) => {
    console.log("[TODO API] Delete project:", project);
    setProjects((prev) => prev.filter((p) => p.id !== project.id));
    setMembersByProject((prev) => {
      const next = { ...prev };
      delete next[project.id];
      return next;
    });
    if (selectedProjectId === project.id) setSelectedProjectId(null);
    pushToast("success", "Project deleted", `“${project.name}” removed locally.`);
  };

  // TODO: replace with `projectService.inviteMember(projectId, data)` when API is ready
  const handleInviteMember = (data: InviteMemberRequest) => {
    if (!selectedProjectId) return;
    console.log("[TODO API] Invite member:", { projectId: selectedProjectId, ...data });

    const member: ProjectMember = {
      id: `local-m-${Date.now()}`,
      userId: `local-u-${Date.now()}`,
      email: data.email,
      // No name until the invite is accepted — the email is all we know.
      fullName: data.email.split("@")[0],
      role: data.role,
      joinedAt: new Date().toISOString(),
      pending: true,
    };

    setMembersByProject((prev) => ({
      ...prev,
      [selectedProjectId]: [...(prev[selectedProjectId] ?? []), member],
    }));
    setProjects((prev) =>
      prev.map((p) =>
        p.id === selectedProjectId ? { ...p, memberCount: p.memberCount + 1 } : p
      )
    );
    setIsInviteOpen(false);
    pushToast("success", "Invite queued", `${data.email} added locally as ${data.role}.`);
  };

  // TODO: replace with `projectService.updateMemberRole(projectId, memberId, role)` when API is ready
  const handleChangeRole = (memberId: string, role: ProjectRoleLabel) => {
    if (!selectedProjectId) return;
    console.log("[TODO API] Change member role:", { projectId: selectedProjectId, memberId, role });

    setMembersByProject((prev) => ({
      ...prev,
      [selectedProjectId]: (prev[selectedProjectId] ?? []).map((m) =>
        m.id === memberId ? { ...m, role } : m
      ),
    }));
    pushToast("success", "Role updated", `Member is now ${role}.`);
  };

  // TODO: replace with `projectService.removeMember(projectId, memberId)` when API is ready
  const handleRemoveMember = (member: ProjectMember) => {
    if (!selectedProjectId) return;
    console.log("[TODO API] Remove member:", { projectId: selectedProjectId, member });

    setMembersByProject((prev) => ({
      ...prev,
      [selectedProjectId]: (prev[selectedProjectId] ?? []).filter((m) => m.id !== member.id),
    }));
    setProjects((prev) =>
      prev.map((p) =>
        p.id === selectedProjectId
          ? { ...p, memberCount: Math.max(0, p.memberCount - 1) }
          : p
      )
    );
    pushToast("success", "Member removed", `${member.email} removed from the project.`);
  };

  const confirmPending = () => {
    if (!pendingConfirm) return;
    if (pendingConfirm.kind === "deleteProject") {
      handleDeleteProject(pendingConfirm.project);
    } else {
      handleRemoveMember(pendingConfirm.member);
    }
    setPendingConfirm(null);
  };

  return (
    <div className="flex max-w-5xl flex-col gap-6">
      {/* Toasts */}
      {toasts.length > 0 && (
        <div className="fixed right-6 top-20 z-50 flex w-80 flex-col gap-2">
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
          ))}
        </div>
      )}

      {selectedProject ? (
        /* ── Detail view ── */
        <>
          <div>
            <button
              type="button"
              onClick={() => setSelectedProjectId(null)}
              className="mb-3 cursor-pointer border-none bg-transparent text-xs font-medium text-accent hover:underline"
            >
              ← Back to projects
            </button>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="mb-0.5 text-xl font-bold">{selectedProject.name}</h1>
                <p className="text-xs text-subtle">
                  {selectedProject.description || "No description"}
                </p>
                {selectedProject.jiraProjectKey && (
                  <p className="mt-1 font-mono text-[11px] text-subtle">
                    Jira key · {selectedProject.jiraProjectKey}
                  </p>
                )}
              </div>
              <Button
                variant="danger"
                size="md"
                onClick={() =>
                  setPendingConfirm({ kind: "deleteProject", project: selectedProject })
                }
              >
                Delete Project
              </Button>
            </div>
          </div>

          <MembersList
            members={selectedMembers}
            onInviteClick={() => setIsInviteOpen(true)}
            onChangeRole={handleChangeRole}
            onRemoveClick={(member) => setPendingConfirm({ kind: "removeMember", member })}
          />
        </>
      ) : (
        /* ── List view ── */
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="mb-0.5 text-xl font-bold">Projects</h1>
              <p className="text-xs text-subtle">
                Organisation projects and their members
              </p>
            </div>
            <Button variant="primary" size="md" onClick={() => setIsCreateOpen(true)}>
              + Create Project
            </Button>
          </div>

          {projects.length === 0 ? (
            <div className="rounded-panel border border-dashed border-border p-8 text-center">
              <h2 className="text-sm font-semibold text-ink">No projects yet</h2>
              <p className="mx-auto mt-1.5 max-w-md text-xs text-muted">
                There is no project endpoint on the backend yet, so nothing is loaded.
                Anything you create here lives in this page only and is lost on refresh.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-panel border border-border bg-surface">
              <table className="w-full border-collapse text-left text-xs text-ink">
                <thead className="border-b border-border bg-surface-raised/60 font-semibold tracking-widest text-subtle">
                  <tr>
                    <th className="px-5 py-2.5 text-[11px]">PROJECT</th>
                    <th className="px-5 py-2.5 text-[11px]">MEMBERS</th>
                    <th className="px-5 py-2.5 text-[11px]">CREATED</th>
                    <th className="px-5 py-2.5 text-right text-[11px]">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {projects.map((project) => (
                    <tr
                      key={project.id}
                      className="transition-colors hover:bg-surface-raised/30"
                    >
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-ink">{project.name}</div>
                        {project.description && (
                          <div className="mt-0.5 max-w-sm truncate text-[11px] text-muted">
                            {project.description}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-muted">{project.memberCount}</td>
                      <td className="px-5 py-3.5 font-mono text-[11px] text-muted">
                        {formatDate(project.createdAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => setSelectedProjectId(project.id)}
                            className="cursor-pointer border-none bg-transparent text-xs font-medium text-accent hover:underline"
                          >
                            View / Manage
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setPendingConfirm({ kind: "deleteProject", project })
                            }
                            className="cursor-pointer border-none bg-transparent text-xs font-medium text-danger hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <CreateProjectModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateProject}
      />

      <InviteMemberModal
        open={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onInvite={handleInviteMember}
      />

      <ConfirmDialog
        open={pendingConfirm !== null}
        title={
          pendingConfirm?.kind === "deleteProject" ? "Delete project" : "Remove member"
        }
        message={
          pendingConfirm?.kind === "deleteProject"
            ? `Are you sure you want to delete “${pendingConfirm.project.name}”? This cannot be undone.`
            : pendingConfirm?.kind === "removeMember"
              ? `Are you sure you want to remove ${pendingConfirm.member.email} from this project?`
              : ""
        }
        confirmLabel={pendingConfirm?.kind === "deleteProject" ? "Delete" : "Remove"}
        onConfirm={confirmPending}
        onCancel={() => setPendingConfirm(null)}
      />
    </div>
  );
}
