"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useAuth } from "@/hooks/useAuth";
import { SharedDashboard } from "./SharedDashboard";
import { ManagerDashboard } from "./ManagerDashboard";
import { DeveloperDashboard } from "./DeveloperDashboard";

function FilterBar() {
  return (
    <>
      <span className="rounded-[7px] border border-border bg-surface px-3 py-[7px] text-xs font-medium text-ink">
        All Teams ⌄
      </span>
      <span className="rounded-[7px] border border-border bg-surface px-3 py-[7px] text-xs font-medium text-ink">
        Last 30 days ⌄
      </span>
    </>
  );
}

export default function DashboardPage() {
  const { user, systemRole } = useAuth();
  const activeProject = useSelector((s: RootState) => s.dashboard.activeProject);

  const role = activeProject?.role || (systemRole === "MANAGER" ? "MANAGER" : "DEVELOPER");
  const firstName = user?.fullName ? user.fullName.split(" ")[0] : "Developer";
  const projectName = activeProject?.name || "platform-core";

  if (role === "MANAGER") {
    return (
      <SharedDashboard
        title="Overview"
        subtitle={`${projectName} · 34 repos · updated just now`}
        filters={<FilterBar />}
      >
        <ManagerDashboard />
      </SharedDashboard>
    );
  }

  return (
    <SharedDashboard
      title={`Welcome back, ${firstName}`}
      subtitle={`${projectName} · 12 connected repos · updated just now`}
      filters={<FilterBar />}
    >
      <DeveloperDashboard />
    </SharedDashboard>
  );
}
