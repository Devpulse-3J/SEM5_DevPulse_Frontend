import React from "react";

export type StatusVariant =
  | "CONNECTED"
  | "ATTENTION"
  | "NOT_CONNECTED"
  | "ESCALATED"
  | "WAITING"
  | "CHANGES_REQ"
  | "NEUTRAL";

interface StatusBadgeProps {
  status?: StatusVariant;
  text?: string;
  dot?: boolean;
  className?: string;
}

export function StatusBadge({
  status = "NEUTRAL",
  text,
  dot,
  className = "",
}: StatusBadgeProps) {
  if (status === "CONNECTED" || status === "ATTENTION" || status === "NOT_CONNECTED") {
    const configs = {
      CONNECTED: {
        color: "oklch(0.72 0.16 155)",
        label: "CONNECTED",
      },
      ATTENTION: {
        color: "oklch(0.78 0.16 80)",
        label: "ATTENTION",
      },
      NOT_CONNECTED: {
        color: "oklch(0.52 0.02 260)",
        label: "NOT CONNECTED",
      },
    };
    const cfg = configs[status];
    return (
      <span
        style={{
          backgroundColor: "var(--dp-surface-raised)",
          color: cfg.color,
        }}
        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.25 py-0.75 rounded-[5px] font-mono ${className}`}
      >
        <span
          style={{ backgroundColor: cfg.color }}
          className="w-1.5 h-1.5 rounded-full inline-block"
        />
        {text || cfg.label}
      </span>
    );
  }

  if (status === "ESCALATED" || status === "CHANGES_REQ") {
    return (
      <span
        style={{
          backgroundColor: "rgba(239, 68, 68, 0.35)",
          color: "oklch(0.78 0.16 22)",
        }}
        className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-[5px] ${className}`}
      >
        {text || (status === "ESCALATED" ? "ESCALATED" : "CHANGES REQ.")}
      </span>
    );
  }

  if (status === "WAITING") {
    return (
      <span
        style={{
          backgroundColor: "rgba(245, 158, 11, 0.35)",
          color: "oklch(0.83 0.14 80)",
        }}
        className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-[5px] ${className}`}
      >
        {text || "WAITING"}
      </span>
    );
  }

  return (
    <span
      style={{
        backgroundColor: "var(--dp-surface-raised)",
        color: "var(--dp-text-secondary)",
      }}
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.25 py-0.75 rounded-[5px] ${className}`}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--dp-text-secondary)] inline-block" />
      )}
      {text}
    </span>
  );
}
