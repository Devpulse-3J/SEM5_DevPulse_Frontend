"use client";

import type { ReactNode } from "react";
import { AdminProjectsProvider } from "@/components/admin/AdminProjectsProvider";

/**
 * Wraps the projects list and the `[id]` detail route in one provider, so
 * mock state survives navigation between them. Scoped here rather than in
 * `admin/layout.tsx` so the rest of the admin console is untouched.
 */
export default function AdminProjectsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AdminProjectsProvider>{children}</AdminProjectsProvider>;
}
