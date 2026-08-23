import React from "react";

export function Header() {
  return (
    <header
      style={{
        backgroundColor: "var(--dp-app-bg)",
        borderColor: "var(--dp-border-subtle)",
      }}
      className="h-[56px] border-b flex items-center justify-between px-5 sticky top-0 z-40"
    >
      {/* Left section */}
      <div className="flex items-center gap-4.5">
        <span className="font-mono font-bold text-[15px] tracking-wide text-[var(--dp-text-primary)] flex items-center gap-2">
          <span className="text-[var(--dp-accent)]">◆</span> DEVPULSE
        </span>

        <div
          style={{ backgroundColor: "var(--dp-border)" }}
          className="w-[1px] h-5"
        />

        <div
          style={{
            backgroundColor: "var(--dp-surface)",
            borderColor: "var(--dp-border)",
          }}
          className="flex items-center gap-1.5 text-xs font-medium border px-2.5 py-1.5 rounded-[7px] text-[var(--dp-text-primary)] cursor-pointer hover:bg-[var(--dp-surface-raised)] transition-colors"
        >
          Nimbus Labs <span className="text-[var(--dp-text-dim)]">/</span>{" "}
          platform-core <span className="text-[var(--dp-text-dim)] ml-1">⌄</span>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3.5">
        <div className="flex gap-2">
          <span
            title="GitHub Integration: Connected"
            style={{
              backgroundColor: "var(--dp-surface-raised)",
              color: "var(--dp-risk-low)",
              borderColor: "var(--dp-border)",
            }}
            className="w-5.5 h-5.5 rounded-md border flex items-center justify-center font-mono text-[10px] font-bold cursor-default"
          >
            GH
          </span>
          <span
            title="Jira Integration: Connected"
            style={{
              backgroundColor: "var(--dp-surface-raised)",
              color: "var(--dp-risk-low)",
              borderColor: "var(--dp-border)",
            }}
            className="w-5.5 h-5.5 rounded-md border flex items-center justify-center font-mono text-[10px] font-bold cursor-default"
          >
            JR
          </span>
          <span
            title="Slack Integration: Attention Required"
            style={{
              backgroundColor: "var(--dp-surface-raised)",
              color: "var(--dp-risk-med-text)",
              borderColor: "var(--dp-border)",
            }}
            className="w-5.5 h-5.5 rounded-md border flex items-center justify-center font-mono text-[10px] font-bold cursor-default"
          >
            SL
          </span>
        </div>

        <div
          style={{ backgroundColor: "var(--dp-border)" }}
          className="w-[1px] h-5"
        />

        <div
          style={{
            backgroundColor: "var(--dp-surface-raised)",
            color: "var(--dp-accent)",
            borderColor: "var(--dp-border)",
          }}
          className="text-[12px] font-semibold px-2.5 py-1 rounded-[6px] border cursor-pointer hover:border-[var(--dp-accent)] transition-colors"
        >
          Manager ⌄
        </div>

        <div
          style={{ backgroundColor: "oklch(0.30 0.08 264)" }}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-sm"
        >
          SC
        </div>
      </div>
    </header>
  );
}
