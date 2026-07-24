import React from "react";
import { Card } from "./Card";

export interface SparklineBar {
  heightPct: number;
  highlighted?: boolean;
  color?: string;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  borderColor: string;
  trendText: string;
  trendColor: string;
  sparklineBars: SparklineBar[];
}

export function MetricCard({
  title,
  value,
  unit,
  borderColor,
  trendText,
  trendColor,
  sparklineBars,
}: MetricCardProps) {
  return (
    <Card borderLeftColor={borderColor} padding="md" className="flex flex-col justify-between">
      <div>
        <div className="text-xs text-[var(--dp-text-secondary)] mb-2.5 font-medium">
          {title}
        </div>
        <div className="font-mono text-[30px] font-semibold tracking-tight text-[var(--dp-text-primary)] leading-none">
          {value}
          {unit && (
            <span className="text-sm font-sans font-normal text-[var(--dp-text-secondary)] ml-0.5">
              {unit}
            </span>
          )}
        </div>
      </div>

      <div>
        {/* Sparkline chart */}
        <div className="flex items-end gap-[3px] h-[28px] mt-2.5">
          {sparklineBars.map((bar, i) => (
            <div
              key={i}
              style={{
                height: `${bar.heightPct}%`,
                backgroundColor: bar.color || (bar.highlighted ? borderColor : "rgba(255,255,255,0.15)"),
              }}
              className="w-1.5 rounded-[2px] transition-all"
            />
          ))}
        </div>

        {/* Trend Footer */}
        <div
          style={{ color: trendColor }}
          className="text-[11px] font-semibold mt-2 font-sans tracking-tight"
        >
          {trendText}
        </div>
      </div>
    </Card>
  );
}
