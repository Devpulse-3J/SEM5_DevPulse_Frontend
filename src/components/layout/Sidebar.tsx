"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const managerNav: NavGroup[] = [
  {
    title: "MONITOR",
    items: [
      { label: "Overview", href: "/dashboard", icon: "▣" },
      { label: "DORA Metrics", href: "/dora", icon: "◧" },
      { label: "PR Risk & Insights", href: "/pull-requests", icon: "▲" },
      { label: "Team & Workload", href: "/team", icon: "◫" },
    ],
  },
  {
    title: "CONFIGURE",
    items: [
      { label: "Integrations", href: "/integrations", icon: "◎" },
      { label: "Settings", href: "/settings", icon: "⚙" },
    ],
  },
];

const developerNav: NavGroup[] = [
  {
    title: "MY WORK",
    items: [
      { label: "Overview", href: "/dashboard", icon: "▣" },
      { label: "My PRs", href: "/my-prs", icon: "◧" },
      { label: "Repositories", href: "/repositories", icon: "📦" },
      { label: "Alerts & Rules", href: "/alerts", icon: "◎" },
    ],
  },
  {
    title: "TEAM",
    items: [
      { label: "Team DORA Metrics", href: "/dora", icon: "◧" },
      { label: "Team & Workload", href: "/team", icon: "◫" },
    ],
  },
];

export interface SidebarProps {
  role: "MANAGER" | "DEVELOPER";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const groups = role === "MANAGER" ? managerNav : developerNav;

  return (
    <aside className="flex w-[212px] shrink-0 flex-col gap-0.5 border-r border-border-subtle bg-app px-3 py-4">
      {groups.map((group) => (
        <div key={group.title}>
          <div className="px-2.5 pt-4 pb-1 text-[11px] font-semibold tracking-wider text-subtle">
            {group.title}
          </div>
          {group.items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-2.5 rounded-[7px] px-2.5 py-[9px] text-[13px] no-underline transition-colors",
                  active
                    ? "bg-surface-raised font-semibold text-ink"
                    : "text-muted hover:bg-surface-raised/50 hover:text-ink",
                )}
              >
                <span className="text-sm">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge != null && (
                  <span className="rounded-full bg-danger px-1.5 py-px text-[10px] font-bold text-ink">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </aside>
  );
}

export default Sidebar;
