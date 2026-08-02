"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { SharedDashboard } from "./SharedDashboard";
import { ManagerDashboard } from "./ManagerDashboard";
import { DeveloperDashboard } from "./DeveloperDashboard";

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
  const role = useSelector((s: RootState) => s.dashboard.activeProject?.role);

  if (role === "MANAGER") {
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

  return (
    <SharedDashboard
      title="Welcome back, Alex"
      subtitle="platform-core · 12 connected repos · updated 2 min ago"
      filters={<FilterBar />}
    >
      <DeveloperDashboard />
    </SharedDashboard>
  );
}
