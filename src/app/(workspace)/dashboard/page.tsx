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
  const rawRole = String(activeProject?.role || "").toUpperCase();
  const isManager = rawRole === "MANAGER" || rawRole === "ADMIN" || user?.systemRole === "admin";
  const firstName = user?.fullName ? user.fullName.split(" ")[0] : "there";
  const projectName = activeProject?.name ?? "";

  if (isManager) {
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
