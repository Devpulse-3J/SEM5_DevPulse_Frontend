"use client";

import { type ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { initials } from "@/utils/helpers";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const activeProject = useSelector(
    (s: RootState) => s.dashboard.activeProject,
  );

  // No project chosen (e.g. straight after login) → send to the picker.
  useEffect(() => {
    if (!activeProject) router.replace("/select-project");
  }, [activeProject, router]);

  if (!activeProject) return null;

  return (
    <div className="flex h-screen flex-col bg-app">
      <Header
        role={activeProject.role}
        initials={initials("Sarah Chen")}
        project={`Nimbus Labs / ${activeProject.name}`}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar role={activeProject.role} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
