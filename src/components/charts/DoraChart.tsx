"use client";

import React, { useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { chart, series } from "@/styles/theme";
import type { DoraMetric, DoraMetricKey, DoraSummary } from "@/types/dora";
import { METRIC_LABELS, formatMetricValue } from "@/features/dora/metric-display";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

export interface DoraChartProps {
  metrics?: DoraMetric[];
  summary?: DoraSummary;
  defaultMetric?: DoraMetricKey;
  className?: string;
  showSelector?: boolean;
}

const METRIC_CONFIG: Record<
  DoraMetricKey,
  {
    color: string;
    bgColor: string;
    unit: string;
    yAxisCallback: (val: number | string) => string;
  }
> = {
  deploymentFrequency: {
    color: chart.accent,
    bgColor: "rgba(57, 135, 229, 0.14)",
    unit: "deployments/day",
    yAxisCallback: (val) => `${val}/d`,
  },
  leadTime: {
    color: series[1], // Orange
    bgColor: "rgba(217, 89, 38, 0.14)",
    unit: "hours",
    yAxisCallback: (val) => `${val}h`,
  },
  changeFailureRate: {
    color: chart.danger,
    bgColor: "rgba(208, 59, 59, 0.14)",
    unit: "%",
    yAxisCallback: (val) => `${val}%`,
  },
  mttr: {
    color: series[3], // Yellow/Gold
    bgColor: "rgba(201, 133, 0, 0.14)",
    unit: "hours",
    yAxisCallback: (val) => `${val}h`,
  },
};

export function DoraChart({
  metrics: propMetrics,
  summary,
  defaultMetric = "deploymentFrequency",
  className = "",
  showSelector = true,
}: DoraChartProps) {
  const [selectedKey, setSelectedKey] = useState<DoraMetricKey | "all">(defaultMetric);

  const metrics = useMemo(() => {
    if (propMetrics && propMetrics.length > 0) return propMetrics;
    if (summary && Array.isArray(summary.metrics)) return summary.metrics;
    return [];
  }, [propMetrics, summary]);

  // Aggregate all unique sorted dates across available metrics
  const dates = useMemo(() => {
    const dateSet = new Set<string>();
    metrics.forEach((metric) => {
      metric.history?.forEach((pt) => {
        if (pt.date) dateSet.add(pt.date);
      });
    });
    return Array.from(dateSet).sort();
  }, [metrics]);

  const activeMetric = useMemo(() => {
    if (selectedKey === "all") return null;
    return metrics.find((m) => m.key === selectedKey) ?? null;
  }, [metrics, selectedKey]);

  // Check if there is valid history data
  const hasData = useMemo(() => {
    if (selectedKey === "all") {
      return metrics.some((m) => m.history?.some((pt) => pt.value !== null && !isNaN(Number(pt.value))));
    }
    return activeMetric?.history?.some((pt) => pt.value !== null && !isNaN(Number(pt.value))) ?? false;
  }, [selectedKey, metrics, activeMetric]);

  // Calculate summary stats for the active metric
  const stats = useMemo(() => {
    if (!activeMetric || !activeMetric.history?.length) return null;
    const validValues = activeMetric.history
      .map((p) => p.value)
      .filter((v): v is number => v !== null && !isNaN(v));
    if (validValues.length === 0) return null;

    const min = Math.min(...validValues);
    const max = Math.max(...validValues);
    const avg = validValues.reduce((sum, v) => sum + v, 0) / validValues.length;

    return { min, max, avg, count: validValues.length };
  }, [activeMetric]);

  const chartData = useMemo(() => {
    if (selectedKey === "all") {
      const datasets = metrics.map((metric) => {
        const config = METRIC_CONFIG[metric.key] ?? {
          color: chart.accent,
          bgColor: "rgba(57, 135, 229, 0.14)",
          unit: metric.unit,
        };

        const dataMap = new Map<string, number | null>();
        metric.history?.forEach((pt) => {
          dataMap.set(pt.date, pt.value);
        });

        const data = dates.map((date) => dataMap.get(date) ?? null);

        return {
          label: METRIC_LABELS[metric.key] ?? metric.key,
          data,
          borderColor: config.color,
          backgroundColor: config.bgColor,
          borderWidth: 2,
          pointRadius: 2.5,
          pointHoverRadius: 5,
          fill: false,
          tension: 0.35,
          spanGaps: true,
        };
      });

      return {
        labels: dates.map((d) => (d.length > 5 ? d.slice(5) : d)),
        datasets,
      };
    }

    // Single selected metric
    if (!activeMetric) return { labels: [], datasets: [] };

    const config = METRIC_CONFIG[activeMetric.key] ?? {
      color: chart.accent,
      bgColor: "rgba(57, 135, 229, 0.14)",
      unit: activeMetric.unit,
    };

    const metricDates = activeMetric.history?.map((pt) => pt.date) ?? [];
    const values = activeMetric.history?.map((pt) => pt.value) ?? [];

    return {
      labels: metricDates.map((d) => (d.length > 5 ? d.slice(5) : d)),
      datasets: [
        {
          label: METRIC_LABELS[activeMetric.key] ?? activeMetric.key,
          data: values,
          borderColor: config.color,
          backgroundColor: config.bgColor,
          borderWidth: 2.5,
          pointRadius: 3,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.35,
          spanGaps: true,
        },
      ],
    };
  }, [selectedKey, metrics, dates, activeMetric]);

  const options = useMemo(() => {
    const isSingle = selectedKey !== "all" && activeMetric;
    const config = isSingle ? METRIC_CONFIG[activeMetric.key] : null;

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: selectedKey === "all",
          position: "top" as const,
          labels: {
            color: chart.muted,
            font: { family: "'IBM Plex Mono', monospace", size: 10 },
            boxWidth: 12,
            boxHeight: 12,
          },
        },
        tooltip: {
          backgroundColor: chart.surfaceRaised,
          titleColor: chart.ink,
          bodyColor: chart.muted,
          borderColor: chart.border,
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (ctx: { dataset: { label?: string }; parsed: { y: number | null } }) => {
              const val = ctx.parsed.y;
              if (val === null || val === undefined) return "No data";
              const label = ctx.dataset.label || "Value";
              const unit = config?.unit ?? "";
              return `${label}: ${val.toFixed(2)} ${unit}`.trim();
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: chart.subtle,
            font: { family: "'IBM Plex Mono', monospace", size: 10 },
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 12,
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
            callback: (value: number | string) => {
              if (config) {
                return config.yAxisCallback(value);
              }
              return String(value);
            },
          },
          border: { display: false },
        },
      },
    };
  }, [selectedKey, activeMetric]);

  const metricKeys: DoraMetricKey[] = [
    "deploymentFrequency",
    "leadTime",
    "changeFailureRate",
    "mttr",
  ];

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {showSelector && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {metricKeys.map((key) => {
              const isActive = selectedKey === key;
              const metricItem = metrics.find((m) => m.key === key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedKey(key)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-accent/15 text-accent border border-accent/40"
                      : "text-muted hover:text-ink hover:bg-surface-raised border border-transparent"
                  }`}
                >
                  {METRIC_LABELS[key]}
                  {metricItem && metricItem.value !== null && (
                    <span className="ml-1.5 font-mono text-[10px] text-subtle">
                      ({formatMetricValue(metricItem)})
                    </span>
                  )}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setSelectedKey("all")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedKey === "all"
                  ? "bg-accent/15 text-accent border border-accent/40"
                  : "text-muted hover:text-ink hover:bg-surface-raised border border-transparent"
              }`}
            >
              All Trends
            </button>
          </div>

          {stats && activeMetric && (
            <div className="flex items-center gap-4 text-[11px] font-mono text-subtle">
              <span>
                Avg: <strong className="text-ink">{stats.avg.toFixed(1)}</strong> {METRIC_CONFIG[activeMetric.key]?.unit}
              </span>
              <span>
                Min: <strong className="text-ink">{stats.min.toFixed(1)}</strong>
              </span>
              <span>
                Max: <strong className="text-ink">{stats.max.toFixed(1)}</strong>
              </span>
              <span>
                Snapshots: <strong className="text-ink">{stats.count}</strong>
              </span>
            </div>
          )}
        </div>
      )}

      <div className="h-[280px] w-full">
        {hasData ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 p-6 text-center">
            <p className="text-xs font-medium text-muted">
              No historical snapshots available for {selectedKey === "all" ? "these metrics" : METRIC_LABELS[selectedKey]}.
            </p>
            <p className="max-w-md text-[11px] text-subtle">
              Daily snapshots are recorded continuously by the automated scheduler. Historical trend curves will plot here as snapshots accumulate.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoraChart;
