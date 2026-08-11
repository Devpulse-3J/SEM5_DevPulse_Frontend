"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { setActiveProject, type WorkspaceRole } from "@/store/dashboardSlice";
import { useAuth } from "@/hooks/useAuth";

interface Membership {
  id: string;
  name: string;
  org: string;
  repos: number;
  role: WorkspaceRole;
}

const memberships: Membership[] = [
  { id: "platform-core", name: "platform-core", org: "Nimbus Labs", repos: 34, role: "MANAGER" },
  { id: "payments-svc", name: "payments-svc", org: "Nimbus Labs", repos: 8, role: "DEVELOPER" },
  { id: "mobile-ios", name: "mobile-ios", org: "Nimbus Labs", repos: 6, role: "DEVELOPER" },
];

const roleBadge: Record<WorkspaceRole, string> = {
  MANAGER: "bg-accent/15 text-accent",
  DEVELOPER: "bg-success/15 text-success",
};

export default function SelectProjectPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, logout } = useAuth();

  function choose(m: Membership) {
    dispatch(setActiveProject({ id: m.id, name: m.name, role: m.role }));
    router.push("/dashboard");
  }

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  const userEmail = user?.email || "user@devpulse.io";

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-6">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="font-mono text-lg font-bold text-ink">◆ DEVPULSE</div>
          <h1 className="mt-3 text-xl font-bold text-ink">Choose a project</h1>
          <p className="mt-1 text-sm text-muted">
            Select a project to open. Your active dashboard view depends on your role in each project.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          {memberships.map((m) => (
            <button
              key={m.id}
              onClick={() => choose(m)}
              className="flex items-center justify-between rounded-card border border-border bg-surface px-4 py-3.5 text-left transition-colors hover:border-accent hover:bg-surface-raised cursor-pointer"
            >
              <div>
                <div className="text-sm font-semibold text-ink">{m.name}</div>
                <div className="mt-0.5 font-mono text-[11px] text-subtle">
                  {m.org} · {m.repos} repos
                </div>
              </div>
              <span
                className={`rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase ${roleBadge[m.role]}`}
              >
                {m.role}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 text-center text-xs text-subtle flex items-center justify-center gap-1.5">
          <span>Signed in as <strong className="text-ink font-medium">{userEmail}</strong> ·</span>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-accent font-medium hover:underline cursor-pointer border-none bg-transparent"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
