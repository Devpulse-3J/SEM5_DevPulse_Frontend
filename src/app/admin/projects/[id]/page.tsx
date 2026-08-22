"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EditProjectModal } from "@/components/admin/EditProjectModal";
import { GithubConnectionSection } from "@/components/admin/GithubConnectionSection";
import { InviteMemberModal } from "@/components/admin/InviteMemberModal";
import { MembersList } from "@/components/admin/MembersList";
import { useAdminProjects } from "@/components/admin/AdminProjectsProvider";
import type {
  InviteMemberRequest,
  ProjectMember,
  ProjectRoleLabel,
  UpdateProjectRequest,
} from "@/types/adminProject";

/**
 * Admin → Projects → detail.
 *
 * Three sections: project info, GitHub connection, members. State comes from
 * `AdminProjectsProvider` (mounted in the parent layout) so edits made here are
 * still there after "← Back to projects". A full reload resets to seed data.
 */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const projectId = params.id;

  const {
    getProject,
    getRepo,
    getMembers,
    updateProject,
    deleteProject,
    reconnectGithub,
    syncRepo,
    cycleGithubStatus,
    inviteMember,
    changeMemberRole,
    removeMember,
  } = useAdminProjects();

  const project = getProject(projectId);
  const repo = getRepo(projectId);
  const members = getMembers(projectId);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [confirmDeleteProject, setConfirmDeleteProject] = useState(false);
  const [pendingRemoval, setPendingRemoval] = useState<ProjectMember | null>(
    null
  );

  // A project created in a previous session, or a hand-typed id: the provider
  // reseeds on reload, so locally created ids do not survive one.
  if (!project) {
    return (
      <div className="flex max-w-3xl flex-col gap-4">
        <Link
          href="/admin/projects"
          className="text-xs font-medium text-accent no-underline hover:underline"
        >
          ← Back to projects
        </Link>
        <div className="rounded-panel border border-dashed border-border p-8 text-center">
          <h1 className="text-sm font-semibold text-ink">Project not found</h1>
          <p className="mx-auto mt-1.5 max-w-md text-xs text-muted">
            No project with id <code>{projectId}</code> is in local state.
            Projects created in the browser are lost on reload — only the three
            seeded ones survive.
          </p>
        </div>
      </div>
    );
  }

  const handleSaveEdit = (data: UpdateProjectRequest) => {
    updateProject(projectId, data);
    setIsEditOpen(false);
  };

  const handleDeleteProject = () => {
    deleteProject(projectId);
    setConfirmDeleteProject(false);
    router.push("/admin/projects");
  };

  const handleInvite = (data: InviteMemberRequest) => {
    inviteMember(projectId, data);
    setIsInviteOpen(false);
  };

  const handleChangeRole = (memberId: string, role: ProjectRoleLabel) => {
    changeMemberRole(projectId, memberId, role);
  };

  const handleConfirmRemoval = () => {
    if (!pendingRemoval) return;
    removeMember(projectId, pendingRemoval.id);
    setPendingRemoval(null);
  };

  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <Link
        href="/admin/projects"
        className="text-xs font-medium text-accent no-underline hover:underline"
      >
        ← Back to projects
      </Link>

      {/* ── A. Project info ── */}
      <section className="flex flex-col gap-4 rounded-panel border border-border bg-surface p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="mb-0.5 text-xl font-bold">{project.name}</h1>
            <p className="text-xs text-muted">
              {project.description || "No description"}
            </p>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2.5">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsEditOpen(true)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={() => setConfirmDeleteProject(true)}
            >
              Delete Project
            </Button>
          </div>
        </div>

        <dl className="flex flex-col gap-2.5 border-t border-border/60 pt-3.5 text-xs">
          <div className="flex items-baseline gap-3">
            <dt className="w-32 flex-shrink-0 text-subtle">Jira project key</dt>
            <dd className="font-mono text-[11px] text-muted">
              {project.jiraProjectKey || "Not set"}
            </dd>
          </div>
          <div className="flex items-baseline gap-3">
            <dt className="w-32 flex-shrink-0 text-subtle">Created</dt>
            <dd className="font-mono text-[11px] text-muted">
              {formatDate(project.createdAt)}
            </dd>
          </div>
          <div className="flex items-baseline gap-3">
            <dt className="w-32 flex-shrink-0 text-subtle">Project id</dt>
            <dd className="font-mono text-[11px] text-muted">{project.id}</dd>
          </div>
        </dl>
      </section>

      {/* ── B. GitHub connection ── */}
      <GithubConnectionSection
        repo={repo}
        onReconnect={() => reconnectGithub(projectId)}
        onSync={() => syncRepo(projectId)}
        onCycleStatus={() => cycleGithubStatus(projectId)}
      />

      {/* ── C. Members ── */}
      <div className="rounded-panel border border-border bg-surface p-5">
        <MembersList
          members={members}
          onInviteClick={() => setIsInviteOpen(true)}
          onChangeRole={handleChangeRole}
          onRemoveClick={(member) => setPendingRemoval(member)}
        />
      </div>

      <EditProjectModal
        open={isEditOpen}
        project={project}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSaveEdit}
      />

      <InviteMemberModal
        open={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onInvite={handleInvite}
      />

      <ConfirmDialog
        open={confirmDeleteProject}
        title="Delete project"
        message={`Are you sure you want to delete “${project.name}”? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteProject}
        onCancel={() => setConfirmDeleteProject(false)}
      />

      <ConfirmDialog
        open={pendingRemoval !== null}
        title="Remove member"
        message={
          pendingRemoval
            ? `Remove ${pendingRemoval.fullName} from project?`
            : ""
        }
        confirmLabel="Remove"
        onConfirm={handleConfirmRemoval}
        onCancel={() => setPendingRemoval(null)}
      />
    </div>
  );
}
