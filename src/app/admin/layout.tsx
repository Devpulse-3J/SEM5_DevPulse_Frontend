import type { ReactNode } from "react";
import Link from "next/link";

/* ─── Admin Shell Layout
   Owner: Person A — all admin pages + layout.tsx
   Wraps every /admin/* route with the global header + sidebar.     */

const NAV_ITEMS = [
  { label: "Overview",     href: "/admin/overview",      icon: "▣" },
  { label: "Projects",     href: "/admin/projects",      icon: "◧" },
  { label: "Users",        href: "/admin/users",         icon: "◫" },
  { label: "Integrations", href: "/admin/integrations",  icon: "◎" },
  { label: "Settings",     href: "/admin/settings",      icon: "⚙" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-app text-ink flex flex-col">
      {/* ── TOP HEADER ── */}
      <header className="h-14 bg-app border-b border-border flex items-center justify-between px-5 flex-shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/admin/overview" className="font-mono font-bold text-[15px] text-ink no-underline hover:no-underline">
            ◆ Odin Eye
          </Link>
          <div className="w-px h-5 bg-border" />
          <span className="text-[12px] font-mono text-subtle tracking-widest">ADMIN CONSOLE</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Integration status indicators */}
          <div className="flex gap-2">
            {[
              { tag: "GH", color: "text-success" },
              { tag: "JR", color: "text-warning" },
              { tag: "SL", color: "text-success" },
            ].map(({ tag, color }) => (
              <span
                key={tag}
                className={`w-[22px] h-[22px] rounded-md bg-surface-raised border border-border flex items-center justify-center font-mono text-[10px] font-bold ${color}`}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="w-px h-5 bg-border" />
          <div className="text-xs font-semibold px-2.5 py-1 rounded-md bg-surface-raised text-warning border border-border">
            Admin ⌄
          </div>
          {/* Avatar */}
          <div className="w-7 h-7 rounded-full bg-[#262626] flex items-center justify-center text-[11px] font-bold text-ink">
            SC
          </div>
        </div>
      </header>

      {/* ── BODY: sidebar + page ── */}
      <div className="flex flex-1">
        {/* ── SIDEBAR ── */}
        <aside className="w-52 flex-shrink-0 border-r border-border bg-app p-4 flex flex-col gap-1">
          <div className="text-[11px] font-semibold text-subtle tracking-widest px-2.5 pt-1 pb-2">
            ADMIN
          </div>
          {NAV_ITEMS.map(({ label, href, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-muted hover:text-ink hover:bg-surface-raised transition-colors no-underline hover:no-underline"
            >
              <span className="w-4 text-center">{icon}</span>
              {label}
            </Link>
          ))}
        </aside>

        {/* ── PAGE CONTENT ── */}
        <main className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}