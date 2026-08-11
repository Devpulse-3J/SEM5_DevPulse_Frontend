"use client";

import { type ReactNode, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { setActiveProject } from "@/store/dashboardSlice";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { initials } from "@/utils/helpers";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const { user, systemRole, logout, isLoading } = useAuth();

  const activeProject = useSelector(
    (s: RootState) => s.dashboard.activeProject
  );

  // Auto-assign default project if none selected yet
  useEffect(() => {
    if (!activeProject && !isLoading) {
      const defaultRole = systemRole === "MANAGER" ? "MANAGER" : "DEVELOPER";
      dispatch(
        setActiveProject({
          id: "platform-core",
          name: "platform-core",
          role: defaultRole,
        })
      );
    }
  }, [activeProject, systemRole, isLoading, dispatch]);

  const effectiveRole = activeProject?.role || (systemRole === "MANAGER" ? "MANAGER" : "DEVELOPER");
  const userFullName = user?.fullName || "Developer";
  const userEmail = user?.email || "user@devpulse.io";
  const userInitials = initials(userFullName);
  const projectName = `Nimbus Labs / ${activeProject?.name || "platform-core"}`;

  return (
    <div className="flex h-screen flex-col bg-app">
      <Header
        role={effectiveRole}
        initials={userInitials}
        userName={userFullName}
        email={userEmail}
        project={projectName}
        onLogout={logout}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar role={effectiveRole} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
