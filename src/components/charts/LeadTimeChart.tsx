"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { chart } from "@/styles/theme";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
);

export interface LeadTimeChartProps {
  /** Week labels, e.g. ["W1", "W2", …] */
  labels: string[];
  /** Median lead-time values per week (hours) */
  data: number[];
}

export function LeadTimeChart({ labels, data }: LeadTimeChartProps) {
  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            data,
            borderColor: chart.accent,
            backgroundColor: "rgba(57,135,229,0.14)",
            borderWidth: 2.5,
            pointRadius: 0,
            pointHitRadius: 8,
            fill: true,
            tension: 0.3,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
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
              label: (ctx) => `${ctx.parsed.y} hrs`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: chart.subtle,
              font: { family: "'IBM Plex Mono', monospace", size: 10 },
            },
            border: { display: false },
          },
          y: {
            grid: {
              color: chart.border,
            },
            ticks: {
              color: chart.subtle,
              font: { family: "'IBM Plex Mono', monospace", size: 10 },
              callback: (value) => `${value}h`,
            },
            border: { display: false },
          },
        },
      }}
    />
  );
}

export default LeadTimeChart;
