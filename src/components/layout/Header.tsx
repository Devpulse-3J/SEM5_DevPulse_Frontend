"use client";

export interface HeaderProps {
  role: "ADMIN" | "MANAGER" | "DEVELOPER";
  /** User initials for the avatar, e.g. "SC" */
  initials?: string;
  /** Organisation / project label shown in the project picker */
  project?: string;
}

const roleBadgeColor: Record<string, string> = {
  ADMIN: "text-warning",
  MANAGER: "text-accent",
  DEVELOPER: "text-success",
};

export function Header({
  role,
  initials = "??",
  project = "Select project",
}: HeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border-subtle bg-app px-5">
      {/* Left */}
      <div className="flex items-center gap-[18px]">
        <span className="font-mono text-[15px] font-bold tracking-wide">
          ◆ Odin Eye
        </span>
        <div className="h-5 w-px bg-border" />
        <div className="flex items-center gap-1.5 rounded-[7px] border border-border bg-surface px-2.5 py-1.5 text-[13px] font-medium">
          {project}
          <span className="text-subtle"> ⌄</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3.5">
        {/* Integration status dots */}
        <div className="flex gap-2">
          {(
            [
              { label: "GH", color: "text-success" },
              { label: "JR", color: "text-success" },
              { label: "SL", color: "text-warning" },
            ] as const
          ).map((svc) => (
            <span
              key={svc.label}
              title={svc.label}
              className={`flex h-[22px] w-[22px] items-center justify-center rounded-md border border-border bg-surface-raised font-mono text-[10px] font-bold ${svc.color}`}
            >
              {svc.label}
            </span>
          ))}
        </div>

        <div className="h-5 w-px bg-border" />

        {/* Role badge */}
        <div
          className={`rounded-md border border-border bg-surface-raised px-2.5 py-1 text-xs font-semibold ${roleBadgeColor[role] ?? "text-muted"}`}
        >
          {role.charAt(0) + role.slice(1).toLowerCase()} ⌄
        </div>

        {/* Avatar */}
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#262626] text-[11px] font-bold">
          {initials}
        </div>
      </div>
    </header>
  );
}

export default Header;
