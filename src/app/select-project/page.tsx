"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { setActiveProject, type WorkspaceRole } from "@/store/dashboardSlice";

// PROTOTYPE — Person A owns this once auth is real. Replace `memberships` with
// the logged-in user's memberships from the session (/api/users/me), which carry
// a per-project role. A user can be MANAGER on one project and DEVELOPER on another.
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

  function choose(m: Membership) {
    dispatch(setActiveProject({ id: m.id, name: m.name, role: m.role }));
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-6">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="font-mono text-lg font-bold text-ink">◆ DEVPULSE</div>
          <h1 className="mt-3 text-xl font-bold text-ink">Choose a project</h1>
          <p className="mt-1 text-sm text-muted">
            Your role depends on the project you open.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          {memberships.map((m) => (
            <button
              key={m.id}
              onClick={() => choose(m)}
              className="flex items-center justify-between rounded-card border border-border bg-surface px-4 py-3.5 text-left transition-colors hover:border-accent hover:bg-surface-raised"
            >
              <div>
                <div className="text-sm font-semibold text-ink">{m.name}</div>
                <div className="mt-0.5 font-mono text-[11px] text-subtle">
                  {m.org} · {m.repos} repos
                </div>
              </div>
              <span
                className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${roleBadge[m.role]}`}
              >
                {m.role}
              </span>
            </button>
          ))}
        </div>

        <p className="mt-5 text-center text-[11px] text-subtle">
          Signed in as sarah.chen@nimbuslabs.io ·{" "}
          <span className="text-accent">Sign out</span>
        </p>
      </div>
    </div>
  );
}
