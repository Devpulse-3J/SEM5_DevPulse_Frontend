"use client";

import { type ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useRequireAuth } from "@/lib/auth-guard";
import { initials } from "@/utils/helpers";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { isAuthed } = useRequireAuth();

  const activeProject = useSelector((s: RootState) => s.dashboard.activeProject);

  /**
   * No project chosen → send the user to the picker.
   *
   * This previously auto-assigned a hardcoded "platform-core" project, which
   * meant every user silently landed in a project that may not exist and whose
   * role was guessed. The role is per-project and only /api/auth/me knows it.
   */
  useEffect(() => {
    if (isAuthed && !activeProject) {
      router.replace("/select-project");
    }
  }, [isAuthed, activeProject, router]);

  if (!isAuthed || !activeProject) {
    return (
      <div className="flex h-screen items-center justify-center bg-app">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  const userFullName = user?.fullName || "";
  const userEmail = user?.email || "";
  const companyName =
    user && "companyName" in user ? (user.companyName as string | undefined) : undefined;

  const rawRole = String(activeProject.role || "").toUpperCase();
  const effectiveRole =
    rawRole === "MANAGER" || rawRole === "ADMIN" || user?.systemRole === "admin"
      ? "MANAGER"
      : "DEVELOPER";

  return (
    <div className="flex h-screen flex-col bg-app">
      <Header
        role={effectiveRole}
        initials={initials(userFullName)}
        userName={userFullName}
        email={userEmail}
        project={companyName ? `${companyName} / ${activeProject.name}` : activeProject.name}
        onLogout={logout}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar role={effectiveRole} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
