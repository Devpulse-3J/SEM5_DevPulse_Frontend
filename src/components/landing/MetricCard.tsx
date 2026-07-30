import React from "react";
import { Sparkline } from "./Sparkline";

interface MetricCardProps {
  label: string;
  value: string;
  unit: string;
  sparkData: number[];
  accentColor: string;
  trend: string;
}

export function MetricCard({
  label,
  value,
  unit,
  sparkData,
  accentColor,
  trend,
}: MetricCardProps) {
  return (
    <div
      className="bg-surface border border-border rounded-card p-4"
      style={{ borderLeftWidth: 3, borderLeftColor: accentColor }}
    >
      <div className="text-xs text-muted mb-2.5">{label}</div>
      <div className="font-mono text-[28px] font-semibold text-ink">
        {value}
        <span className="text-sm text-muted">{unit}</span>
      </div>
      <Sparkline data={sparkData} color={accentColor} />
      <div className="text-[11px] font-semibold mt-2" style={{ color: accentColor }}>
        {trend}
      </div>
    </div>
  );
}
