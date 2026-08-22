"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CreateProjectModal } from "@/components/admin/CreateProjectModal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useAdminProjects } from "@/components/admin/AdminProjectsProvider";
import type { CreateProjectRequest, Project } from "@/types/adminProject";

/**
 * Admin → Projects (list).
 *
 * UI is complete; the backend is not. Every handler goes through
 * `AdminProjectsProvider`, whose mutators log under `[TODO API]` and update
 * local state — grep that file for the endpoints they will become.
 *
 * Rows are seeded from `lib/mock/projects.ts`. A full page reload restores the
 * seed; "Reset demo data" does the same without reloading.
 */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ProjectsPage() {
  const {
    projects,
    reposByProject,
    createProject,
    deleteProject,
    resetDemoData,
  } = useAdminProjects();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null);

  const handleCreate = (data: CreateProjectRequest) => {
    createProject(data);
    setIsCreateOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;
    deleteProject(pendingDelete.id);
    setPendingDelete(null);
  };

  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-0.5 text-xl font-bold">Projects</h1>
          <p className="text-xs text-subtle">
            Organisation projects, their GitHub links, and their members
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="secondary" size="md" onClick={resetDemoData}>
            Reset demo data
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsCreateOpen(true)}
          >
            + Create Project
          </Button>
        </div>
      </div>

      <div className="rounded-panel border border-dashed border-border px-4 py-2.5">
        <p className="text-[11px] text-subtle">
          Mock data. There is no <code>/api/projects</code> endpoint yet — every
          change here lives in memory and is lost on reload.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-panel border border-dashed border-border p-8 text-center">
          <h2 className="text-sm font-semibold text-ink">No projects</h2>
          <p className="mx-auto mt-1.5 max-w-md text-xs text-muted">
            You deleted every seeded project. Use “Reset demo data” to bring
            them back.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-panel border border-border bg-surface">
          <table className="w-full border-collapse text-left text-xs text-ink">
            <thead className="border-b border-border bg-surface-raised/60 font-semibold tracking-widest text-subtle">
              <tr>
                <th className="px-5 py-2.5 text-[11px]">PROJECT</th>
                <th className="px-5 py-2.5 text-[11px]">GITHUB</th>
                <th className="px-5 py-2.5 text-[11px]">MEMBERS</th>
                <th className="px-5 py-2.5 text-[11px]">CREATED</th>
                <th className="px-5 py-2.5 text-right text-[11px]">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {projects.map((project) => {
                const repo = reposByProject[project.id];
                return (
                  <tr
                    key={project.id}
                    className="transition-colors hover:bg-surface-raised/30"
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-ink">
                        {project.name}
                      </div>
                      {project.description && (
                        <div className="mt-0.5 max-w-sm truncate text-[11px] text-muted">
                          {project.description}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {repo ? (
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-[11px] text-muted">
                            {repo.owner}/{repo.name}
                          </span>
                          <Badge
                            variant={
                              repo.status === "CONNECTED"
                                ? "success"
                                : repo.status === "SYNCING"
                                  ? "warning"
                                  : "danger"
                            }
                          >
                            {repo.status === "CONNECTED"
                              ? "Connected"
                              : repo.status === "SYNCING"
                                ? "Syncing"
                                : "Disconnected"}
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-[11px] text-subtle">
                          Not linked
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-muted">
                      {project.memberCount}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[11px] text-muted">
                      {formatDate(project.createdAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="text-xs font-medium text-accent no-underline hover:underline"
                        >
                          View / Manage
                        </Link>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(project)}
                          className="cursor-pointer border-none bg-transparent text-xs font-medium text-danger hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <CreateProjectModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreate}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete project"
        message={
          pendingDelete
            ? `Are you sure you want to delete “${pendingDelete.name}”? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
