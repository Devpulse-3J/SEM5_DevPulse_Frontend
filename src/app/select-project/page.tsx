"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { setActiveProject, type WorkspaceRole } from "@/store/dashboardSlice";
import { useAuth } from "@/hooks/useAuth";
import { useMyMemberships } from "@/hooks/useProjects";
import { projectLabel } from "@/types/project";
import type { ProjectMembership } from "@/types/project";
import { FeatureUnavailable } from "@/components/ui/FeatureUnavailable";

/**
 * Post-login project picker — the page that establishes the user's role.
 *
 * Memberships come from `projectRoles` on GET /api/auth/me, the only source of
 * per-project roles in the API. There is no project directory endpoint, so a
 * project's name is genuinely unknown here: we render "Project #<id>" rather
 * than inventing one.
 */

/** API roles are lowercase; the workspace UI uses uppercase. Map once, here. */
function toWorkspaceRole(role: ProjectMembership["role"]): WorkspaceRole {
  return role === "manager" ? "MANAGER" : "DEVELOPER";
}

const roleBadge: Record<WorkspaceRole, string> = {
  MANAGER: "bg-accent/15 text-accent",
  DEVELOPER: "bg-success/15 text-success",
};

export default function SelectProjectPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { data: memberships, isLoading, isError, error } = useMyMemberships();

  function choose(m: ProjectMembership) {
    const role = toWorkspaceRole(m.role);
    dispatch(
      setActiveProject({
        id: String(m.projectId),
        name: projectLabel(m.projectId),
        role,
      })
    );
    router.push("/dashboard");
  }

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-6">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="font-mono text-lg font-bold text-ink">◆ Odin Eye</div>
          <h1 className="mt-3 text-xl font-bold text-ink">Choose a project</h1>
          <p className="mt-1 text-sm text-muted">
            Your dashboard depends on your role in the project you pick.
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        )}

        {isError && (
          <div
            role="alert"
            className="rounded-panel border border-danger/30 bg-danger/10 p-4 text-xs text-danger"
          >
            <p className="font-semibold">Could not load your projects</p>
            <p className="mt-1 text-danger/80">
              {error instanceof Error ? error.message : "Please try again."}
            </p>
          </div>
        )}

        {!isLoading && !isError && memberships?.length === 0 && (
          <FeatureUnavailable
            title="You are not a member of any project"
            message="Ask a company admin to add you to a project. Project membership is assigned in the backend; there is no self-service project creation yet."
          />
        )}

        {!isLoading && !isError && memberships && memberships.length > 0 && (
          <div className="flex flex-col gap-2.5">
            {memberships.map((m) => {
              const role = toWorkspaceRole(m.role);
              return (
                <button
                  key={m.projectId}
                  onClick={() => choose(m)}
                  className="flex items-center justify-between rounded-card border border-border bg-surface px-4 py-3.5 text-left transition-colors hover:border-accent hover:bg-surface-raised cursor-pointer"
                >
                  <div>
                    <div className="text-sm font-semibold text-ink">
                      {projectLabel(m.projectId)}
                    </div>
                    <div className="mt-0.5 font-mono text-[11px] text-subtle">
                      Project id {m.projectId}
                    </div>
                  </div>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase ${roleBadge[role]}`}
                  >
                    {m.role}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-subtle">
          {user?.email && (
            <span>
              Signed in as <strong className="font-medium text-ink">{user.email}</strong> ·
            </span>
          )}
          <button
            type="button"
            onClick={handleSignOut}
            className="cursor-pointer border-none bg-transparent font-medium text-accent hover:underline"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
