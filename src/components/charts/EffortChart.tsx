"use client";

import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { chart } from "@/styles/theme";
import type { EffortSlice } from "@/types";

ChartJS.register(ArcElement, Tooltip);

/** Slice colors, in the order the spec's Effort Distribution legend uses. */
export const EFFORT_COLORS = [
  chart.accent, // Feature work
  chart.warning, // Code review
  chart.success, // Bug fixes
  chart.subtle, // Meetings / other
] as const;

export interface EffortChartProps {
  data: EffortSlice[];
}

export function EffortChart({ data }: EffortChartProps) {
  return (
    <Doughnut
      data={{
        labels: data.map((d) => d.label),
        datasets: [
          {
            data: data.map((d) => d.pct),
            backgroundColor: data.map(
              (_, i) => EFFORT_COLORS[i % EFFORT_COLORS.length],
            ),
            borderColor: chart.surface,
            borderWidth: 2,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        cutout: "62%",
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: chart.surfaceRaised,
            titleColor: chart.ink,
            bodyColor: chart.muted,
            borderColor: chart.border,
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`,
            },
          },
        },
      }}
    />
  );
}

export default EffortChart;
