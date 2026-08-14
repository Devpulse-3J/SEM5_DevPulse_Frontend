import React from "react";

type RiskLevel = "LOW" | "MED" | "HIGH";

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number | string;
  className?: string;
}

export function RiskBadge({ level, score, className = "" }: RiskBadgeProps) {
  const levelStyles: Record<
    RiskLevel,
    { bg: string; color: string; label: string }
  > = {
    LOW: {
      bg: "rgba(34, 197, 94, 0.35)",
      color: "oklch(0.78 0.15 155)",
      label: "LOW RISK",
    },
    MED: {
      bg: "rgba(245, 158, 11, 0.35)",
      color: "oklch(0.83 0.14 80)",
      label: "MED RISK",
    },
    HIGH: {
      bg: "rgba(239, 68, 68, 0.35)",
      color: "oklch(0.78 0.16 22)",
      label: "HIGH RISK",
    },
  };

  const current = levelStyles[level];
  const text = score !== undefined ? `${level === "LOW" ? "LOW" : level} · ${score}` : current.label;

  return (
    <span
      style={{
        backgroundColor: current.bg,
        color: current.color,
      }}
      className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-[5px] tracking-wide font-mono ${className}`}
    >
      {text}
    </span>
  );
}
