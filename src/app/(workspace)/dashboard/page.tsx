"use client";

import { SharedDashboard } from "./SharedDashboard";
import { ManagerDashboard } from "./ManagerDashboard";

// TODO: replace with real role from useSession() once auth is wired
const ROLE = "MANAGER" as const;

function FilterBar() {
  return (
    <>
      <span className="rounded-[7px] border border-border bg-surface px-3 py-[7px] text-xs">
        All Teams ⌄
      </span>
      <span className="rounded-[7px] border border-border bg-surface px-3 py-[7px] text-xs">
        Last 30 days ⌄
      </span>
    </>
  );
}

export default function DashboardPage() {
  if (ROLE === "MANAGER") {
    return (
      <SharedDashboard
        title="Overview"
        subtitle="platform-core · 34 repos · updated 2 min ago"
        filters={<FilterBar />}
      >
        <ManagerDashboard />
      </SharedDashboard>
    );
  }

  // TODO: Developer path — will use <DeveloperDashboard /> (Person C)
  return (
    <SharedDashboard title="Welcome back" subtitle="platform-core · updated 2 min ago">
      <div className="text-sm text-muted">Developer dashboard coming soon.</div>
    </SharedDashboard>
  );
}
