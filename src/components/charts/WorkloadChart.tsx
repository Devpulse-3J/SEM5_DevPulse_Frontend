"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { chart } from "@/styles/theme";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export interface DeveloperLoad {
  name: string;
  /** Load percentage, e.g. 190 means 190% of team average */
  load: number;
}

export interface WorkloadChartProps {
  developers: DeveloperLoad[];
  /** Threshold above which load is considered overloaded (default 120) */
  dangerThreshold?: number;
  /** Threshold above which load is a warning (default 100) */
  warningThreshold?: number;
}

function getBarColor(load: number, warn: number, danger: number): string {
  if (load >= danger) return chart.danger;
  if (load >= warn) return chart.warning;
  return chart.success;
}

export function WorkloadChart({
  developers,
  dangerThreshold = 120,
  warningThreshold = 100,
}: WorkloadChartProps) {
  const labels = developers.map((d) => d.name);
  const values = developers.map((d) => d.load);
  const colors = values.map((v) =>
    getBarColor(v, warningThreshold, dangerThreshold),
  );

  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderRadius: 4,
            barThickness: 16,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
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
              label: (ctx) => `${ctx.parsed.x}% of team avg`,
            },
          },
        },
        scales: {
          x: {
            max: 200,
            grid: {
              color: chart.border,
            },
            ticks: {
              color: chart.subtle,
              font: { family: "'IBM Plex Mono', monospace", size: 10 },
              callback: (value) => `${value}%`,
            },
            border: { display: false },
          },
          y: {
            grid: { display: false },
            ticks: {
              color: chart.muted,
              font: { family: "'IBM Plex Sans', sans-serif", size: 11 },
            },
            border: { display: false },
          },
        },
      }}
    />
  );
}

export default WorkloadChart;
