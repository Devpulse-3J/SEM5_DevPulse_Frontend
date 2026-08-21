import type { DoraMetric, DoraMetricKey } from "@/types/dora";

export const METRIC_LABELS: Record<DoraMetricKey, string> = {
  deploymentFrequency: "Deployment frequency",
  leadTime: "Lead time for changes",
  mttr: "Mean time to recovery",
  changeFailureRate: "Change failure rate",
};

export function formatMetricValue(metric: Pick<DoraMetric, "value" | "unit">): string {
  if (metric.value === null) return "Not available";
  if (metric.unit === "%") return `${metric.value.toFixed(1)}%`;
  if (metric.unit === "hours") return `${metric.value.toFixed(1)} h`;
  if (metric.unit === "deployments/day") return `${metric.value.toFixed(2)}/day`;
  return `${metric.value} ${metric.unit}`.trim();
}

export function describeMetricChange(
  metric: Pick<DoraMetric, "key" | "value" | "previousValue" | "unit">,
): { label: string; improving: boolean | null } {
  if (metric.value === null || metric.previousValue === null) {
    return { label: "No comparable previous window", improving: null };
  }
  const delta = metric.value - metric.previousValue;
  if (delta === 0) return { label: "No change from previous window", improving: null };

  const lowerIsBetter = metric.key !== "deploymentFrequency";
  const improving = lowerIsBetter ? delta < 0 : delta > 0;
  const amount = formatMetricValue({ value: Math.abs(delta), unit: metric.unit });
  return {
    label: `${delta > 0 ? "+" : "−"}${amount} vs previous window`,
    improving,
  };
}
