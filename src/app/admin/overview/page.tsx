import Link from "next/link";

export const metadata = { title: "Admin Overview — DevPulse" };

/* ── Summary stat cards ── */
const STATS = [
  { label: "Total Projects",    value: "4",  sub: "3 active · 1 archived",  color: "oklch(0.68 0.17 264)" },
  { label: "Members",           value: "26", sub: "2 admin · 8 manager · 16 dev", color: "oklch(0.72 0.16 155)" },
  { label: "Integrations",      value: "3",  sub: "2 healthy · 1 attention", color: "oklch(0.78 0.16 80)" },
  { label: "Repositories Tracked", value: "34", sub: "across all projects",  color: "oklch(0.68 0.17 264)" },
];

const RECENT_ACTIVITY = [
  { action: "Project created",    detail: "checkout-api by IT Ops",          time: "5 min ago",  dot: "text-accent" },
  { action: "Member invited",     detail: "priya.mehta@nimbuslabs.io",       time: "23 min ago", dot: "text-success" },
  { action: "Integration warning",detail: "Jira token expiring in 3 days",   time: "1 hr ago",   dot: "text-warning" },
  { action: "Project archived",   detail: "data-pipeline by Sarah Chen",     time: "2 hrs ago",  dot: "text-subtle" },
  { action: "Member role changed",detail: "marcus.webb → Developer",         time: "4 hrs ago",  dot: "text-accent" },
];

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Page heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold mb-0.5">Overview</h1>
          <p className="text-xs text-subtle font-mono">Nimbus Labs · organisation dashboard</p>
        </div>
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-accent text-canvas text-xs font-bold hover:brightness-110 transition-all no-underline hover:no-underline"
        >
          + Add Project
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="bg-surface border border-border rounded-card p-4"
            style={{ borderLeftWidth: 3, borderLeftColor: s.color }}
          >
            <div className="text-xs text-muted mb-2">{s.label}</div>
            <div className="font-mono text-2xl font-semibold text-ink">{s.value}</div>
            <div className="text-[11px] text-subtle mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-surface border border-border rounded-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-subtle">
          <span className="text-[13px] font-semibold">Recent Activity</span>
          <span className="text-[11px] text-subtle font-mono">org-wide</span>
        </div>
        <div className="divide-y divide-border-subtle">
          {RECENT_ACTIVITY.map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3 text-xs">
              <span className={`text-lg leading-none ${item.dot}`}>●</span>
              <div className="flex-1">
                <span className="font-semibold text-ink">{item.action}</span>
                <span className="text-muted ml-1.5">— {item.detail}</span>
              </div>
              <span className="text-subtle font-mono flex-shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Manage Projects",     href: "/admin/projects",     color: "text-accent" },
          { label: "Manage Users",        href: "/admin/users",        color: "text-success" },
          { label: "Integrations",        href: "/admin/integrations", color: "text-warning" },
          { label: "Settings",            href: "/admin/settings",     color: "text-muted" },
        ].map(({ label, href, color }) => (
          <Link
            key={href}
            href={href}
            className={`bg-surface border border-border rounded-card px-4 py-3 text-xs font-semibold ${color} hover:border-accent/30 hover:-translate-y-0.5 transition-all no-underline hover:no-underline`}
          >
            {label} →
          </Link>
        ))}
      </div>
    </div>
  );
}
