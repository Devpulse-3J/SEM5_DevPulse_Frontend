export const metadata = { title: "Users — DevPulse Admin" };

type Role = "Manager" | "Developer" | "Admin";

interface Member {
  name: string;
  email: string;
  role: Role;
  access: string;
  avatar: string;
}

const MEMBERS: Member[] = [
  { name: "Sarah Chen",   email: "sarah.chen@nimbuslabs.io",   role: "Manager",   access: "All teams",    avatar: "SC" },
  { name: "Marcus Webb",  email: "marcus.webb@nimbuslabs.io",  role: "Developer", access: "Backend team", avatar: "MW" },
  { name: "IT Ops",       email: "itops@nimbuslabs.io",        role: "Admin",     access: "Org-wide",     avatar: "IO" },
  { name: "Priya Mehta",  email: "priya.mehta@nimbuslabs.io",  role: "Developer", access: "Frontend team",avatar: "PM" },
  { name: "Diego Alvarez",email: "diego.alvarez@nimbuslabs.io",role: "Developer", access: "Backend team", avatar: "DA" },
];

const ROLE_STYLES: Record<Role, { color: string; bg: string }> = {
  Manager:   { color: "oklch(0.68 0.17 264)", bg: "oklch(0.225 0.013 260)" },
  Developer: { color: "oklch(0.70 0.018 260)", bg: "oklch(0.225 0.013 260)" },
  Admin:     { color: "oklch(0.78 0.16 80)",  bg: "oklch(0.225 0.013 260)" },
};

const AVATAR_COLORS: Record<string, string> = {
  SC: "oklch(0.30 0.08 264)",
  MW: "oklch(0.30 0.12 22)",
  IO: "oklch(0.30 0.09 80)",
  PM: "oklch(0.30 0.10 155)",
  DA: "oklch(0.30 0.09 22)",
};

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold mb-0.5">Members &amp; Roles</h1>
          <p className="text-xs text-subtle">Manage organisation members, roles, and access permissions</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-accent text-canvas text-xs font-bold hover:brightness-110 transition-all cursor-pointer border-none"
        >
          + Invite Member
        </button>
      </div>

      {/* Role summary chips */}
      <div className="flex gap-3 flex-wrap">
        {(
          [
            { label: "2 Admins",    color: "text-warning" },
            { label: "1 Manager",   color: "text-accent" },
            { label: "16 Developers", color: "text-success" },
          ] as const
        ).map(({ label, color }) => (
          <div key={label} className={`text-[11px] font-semibold px-3 py-1.5 rounded-md bg-surface border border-border ${color}`}>
            {label}
          </div>
        ))}
      </div>

      {/* Members table */}
      <div className="bg-surface border border-border rounded-card overflow-hidden">
        {/* Column headers */}
        <div className="grid grid-cols-[2fr_2.5fr_1fr_1.2fr_0.5fr] px-5 py-2.5 border-b border-border-subtle text-[11px] text-subtle font-semibold tracking-widest">
          <div>MEMBER</div>
          <div>EMAIL</div>
          <div>ROLE</div>
          <div>ACCESS</div>
          <div />
        </div>

        {MEMBERS.map((m, i) => {
          const style = ROLE_STYLES[m.role];
          return (
            <div
              key={m.email}
              className={`grid grid-cols-[2fr_2.5fr_1fr_1.2fr_0.5fr] items-center px-5 py-3 text-xs ${
                i < MEMBERS.length - 1 ? "border-b border-border-subtle" : ""
              } hover:bg-surface-raised/50 transition-colors`}
            >
              {/* Name + avatar */}
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-ink flex-shrink-0"
                  style={{ background: AVATAR_COLORS[m.avatar] ?? "oklch(0.30 0.08 264)" }}
                >
                  {m.avatar}
                </div>
                <span className="font-medium text-ink">{m.name}</span>
              </div>

              <div className="font-mono text-[11px] text-muted">{m.email}</div>

              {/* Role badge */}
              <div>
                <span
                  className="text-[11px] font-semibold px-2 py-1 rounded-md"
                  style={{ color: style.color, background: style.bg }}
                >
                  {m.role}
                </span>
              </div>

              <div className="text-muted">{m.access}</div>

              <div>
                <button
                  type="button"
                  className="text-accent text-xs font-medium hover:underline cursor-pointer bg-transparent border-none p-0"
                >
                  Edit →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invite form */}
      <div className="bg-surface-raised border border-border rounded-panel p-5 flex flex-col gap-3 max-w-md">
        <h2 className="text-sm font-bold">Invite Member</h2>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted">Work email</label>
          <input
            type="email"
            placeholder="newmember@nimbuslabs.io"
            className="h-9 px-3 rounded-lg bg-app border border-border text-xs text-ink focus:outline-none focus:border-accent transition-colors placeholder:text-subtle"
          />
        </div>
        <div className="flex justify-end">
          <button type="button" className="h-9 px-4 rounded-lg bg-accent text-canvas text-xs font-bold border-none cursor-pointer hover:brightness-110 transition-all">
            Send Invite
          </button>
        </div>
      </div>
    </div>
  );
}
