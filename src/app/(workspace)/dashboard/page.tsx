"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useAuth } from "@/hooks/useAuth";
import { SharedDashboard } from "./SharedDashboard";
import { ManagerDashboard } from "./ManagerDashboard";
import { DeveloperDashboard } from "./DeveloperDashboard";

export default function DashboardPage() {
  const { user } = useAuth();
  const activeProject = useSelector((s: RootState) => s.dashboard.activeProject);

  // The workspace layout guarantees an active project before rendering, and the
  // role comes from that project — never from systemRole, which is company-wide.
  const role = activeProject?.role ?? "DEVELOPER";
  const firstName = user?.fullName ? user.fullName.split(" ")[0] : "there";
  const projectName = activeProject?.name ?? "";

  // Repo counts and "updated just now" were invented — nothing reports them.
  if (role === "MANAGER") {
    return (
      <SharedDashboard title="Overview" subtitle={projectName}>
        <ManagerDashboard />
      </SharedDashboard>
    );
  }

  return (
    <SharedDashboard title={`Welcome back, ${firstName}`} subtitle={projectName}>
      <DeveloperDashboard />
    </SharedDashboard>
  );
}
