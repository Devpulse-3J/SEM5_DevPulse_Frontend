"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRequireAdmin } from "@/lib/auth-guard";
import { initials } from "@/utils/helpers";
import { AdminTour, replayAdminTour } from "@/components/onboarding/AdminTour";

/* ─── Admin Shell Layout
   Gated on systemRole === "admin". That check is a UX gate only — the gateway
   enforces authorisation independently on every request. */

const NAV_ITEMS = [
  { label: "Overview", href: "/admin/overview", icon: "▣" },
  { label: "Projects", href: "/admin/projects", icon: "◧" },
  { label: "Members", href: "/admin/members", icon: "◫" },
  { label: "Integrations", href: "/admin/integrations", icon: "◎" },
  { label: "Settings", href: "/admin/settings", icon: "⚙" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isAllowed } = useRequireAdmin();
  const { user, logout } = useAuth();

  if (!isAllowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  const fullName = user?.fullName ?? "";
  const companyName =
    user && "companyName" in user ? (user.companyName as string | undefined) : undefined;

  return (
    <div className="flex min-h-screen flex-col bg-app text-ink">
      <header className="sticky top-0 z-40 flex h-14 flex-shrink-0 items-center justify-between border-b border-border bg-app px-5">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/overview"
            className="flex items-center gap-2 font-mono text-[15px] font-bold text-ink no-underline hover:no-underline"
          >
            <Image
              src="/icons/icon.png"
              alt="OdinEye"
              width={22}
              height={22}
              className="rounded object-contain"
            />
            <span>OdinEye</span>
          </Link>
          <div className="h-5 w-px bg-border" />
          <span className="font-mono text-[12px] tracking-widest text-subtle">
            ADMIN CONSOLE
          </span>
          {companyName && (
            <>
              <div className="h-5 w-px bg-border" />
              <span className="text-xs text-muted">{companyName}</span>
            </>
          )}
          {/* Replays the admin guide (AdminTour): project setup and integrations. */}
          <button
            type="button"
            onClick={replayAdminTour}
            className="flex cursor-pointer items-center gap-1.5 rounded-[7px] border border-[#257f61]/60 bg-[#257f61]/15 px-2.5 py-1 text-xs font-medium text-[#5fd3a8] transition-colors hover:bg-[#257f61]/30"
          >
            <span aria-hidden>?</span>
            <span>Guide</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={logout}
            className="cursor-pointer border-none bg-transparent text-xs font-medium text-muted hover:text-ink"
          >
            Sign out
          </button>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#262626] text-[11px] font-bold text-ink">
            {initials(fullName)}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="flex w-52 flex-shrink-0 flex-col gap-1 border-r border-border bg-app p-4">
          <div className="px-2.5 pb-2 pt-1 text-[11px] font-semibold tracking-widest text-subtle">
            ADMIN
          </div>
          {NAV_ITEMS.map(({ label, href, icon }) => (
            <Link
              key={href}
              href={href}
              // Lets the admin guide (AdminTour) point at this link.
              data-tour={href}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-muted no-underline transition-colors hover:bg-surface-raised hover:text-ink hover:no-underline"
            >
              <span className="w-4 text-center">{icon}</span>
              {label}
            </Link>
          ))}
        </aside>

        <main className="flex-1 overflow-auto p-6 md:p-8">{children}</main>
      </div>
      <AdminTour userId={user?.userId} />
    </div>
  );
}
