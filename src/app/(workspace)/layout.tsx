"use client";

import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

// TODO: replace with real role from useSession() + auth-guard once auth is wired
const ROLE: "MANAGER" | "DEVELOPER" = "MANAGER";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col bg-app">
      <Header
        role={ROLE}
        initials="SC"
        project="Nimbus Labs / platform-core"
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar role={ROLE} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
