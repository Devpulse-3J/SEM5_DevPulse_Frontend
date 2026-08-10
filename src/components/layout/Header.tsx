"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { clearActiveProject } from "@/store/dashboardSlice";

export interface HeaderProps {
  role: "ADMIN" | "MANAGER" | "DEVELOPER" | string;
  /** User initials for the avatar, e.g. "SC" */
  initials?: string;
  /** Full name of the user */
  userName?: string;
  /** User email */
  email?: string;
  /** Organisation / project label shown in the project picker */
  project?: string;
  /** Logout callback */
  onLogout?: () => void;
}

const roleBadgeColor: Record<string, string> = {
  ADMIN: "text-warning bg-warning/15 border-warning/30",
  MANAGER: "text-accent bg-accent/15 border-accent/30",
  DEVELOPER: "text-success bg-success/15 border-success/30",
};

export function Header({
  role,
  initials = "SC",
  userName = "Developer",
  email = "user@devpulse.io",
  project = "platform-core",
  onLogout,
}: HeaderProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    dispatch(clearActiveProject());
    if (onLogout) {
      onLogout();
    }
    router.push("/login");
  };

  const normalizedRole = (role || "DEVELOPER").toUpperCase();
  const roleStyle = roleBadgeColor[normalizedRole] ?? "text-muted bg-surface-raised border-border";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border-subtle bg-app px-5 relative z-40">
      {/* Left */}
      <div className="flex items-center gap-[18px]">
        <span className="font-mono text-[15px] font-bold tracking-wide text-ink">
          ◆ DEVPULSE
        </span>
        <div className="h-5 w-px bg-border" />
        <div className="flex items-center gap-1.5 rounded-[7px] border border-border bg-surface px-2.5 py-1.5 text-[13px] font-medium text-ink">
          <span>{project}</span>
          <span className="text-subtle text-xs"> ⌄</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3.5">
        {/* Integration status dots */}
        <div className="flex gap-2">
          {(
            [
              { label: "GH", color: "text-success", title: "GitHub Connected" },
              { label: "JR", color: "text-success", title: "Jira Connected" },
              { label: "SL", color: "text-warning", title: "Slack Pending" },
            ] as const
          ).map((svc) => (
            <span
              key={svc.label}
              title={svc.title}
              className={`flex h-[22px] w-[22px] items-center justify-center rounded-md border border-border bg-surface-raised font-mono text-[10px] font-bold ${svc.color}`}
            >
              {svc.label}
            </span>
          ))}
        </div>

        <div className="h-5 w-px bg-border" />

        {/* Role badge */}
        <div
          className={`rounded-md border px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${roleStyle}`}
        >
          {normalizedRole}
        </div>

        {/* Profile Avatar & Dropdown Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-label="User Profile Menu"
            aria-expanded={isDropdownOpen}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 border border-accent/40 text-accent text-xs font-bold transition-all hover:ring-2 hover:ring-accent/40 hover:scale-105 cursor-pointer select-none"
          >
            {initials}
          </button>

          {/* Profile Dropdown Popover */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-surface p-2 shadow-2xl animate-fadeIn z-50 flex flex-col gap-1">
              {/* User info header */}
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-raised/60 border border-border/40">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-canvas text-xs font-bold">
                  {initials}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-ink truncate">{userName}</span>
                  <span className="text-[11px] text-muted truncate">{email}</span>
                </div>
              </div>

              {/* Role info row */}
              <div className="flex items-center justify-between px-2.5 py-1.5 text-xs">
                <span className="text-subtle">Role</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${roleStyle}`}>
                  {normalizedRole}
                </span>
              </div>

              <div className="h-px bg-border-subtle my-1" />

              {/* Navigation options */}
              <button
                type="button"
                onClick={() => {
                  setIsDropdownOpen(false);
                  router.push("/select-project");
                }}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-muted hover:text-ink hover:bg-surface-raised transition-colors cursor-pointer text-left w-full"
              >
                <span className="text-sm">🔄</span>
                <span>Switch Project</span>
              </button>

              <div className="h-px bg-border-subtle my-1" />

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-danger hover:bg-danger/10 hover:text-danger transition-colors cursor-pointer text-left w-full"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
