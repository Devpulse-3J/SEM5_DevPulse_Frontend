"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { DoraRating, DoraSummary } from "@/types/dora";
import { describeMetricChange, formatMetricValue, METRIC_LABELS } from "./metric-display";

const ratingVariant: Record<
  DoraRating,
  "default" | "success" | "warning" | "danger" | "info"
> = {
  ELITE: "success",
  HIGH: "info",
  MEDIUM: "warning",
  LOW: "danger",
  NOT_AVAILABLE: "default",
};

export function DoraMetricGrid({ summary }: { summary: DoraSummary }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {summary.metrics.map((metric) => {
        const change = describeMetricChange(metric);
        return (
          <Card key={metric.key} className="flex min-h-40 flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold text-muted">{METRIC_LABELS[metric.key]}</p>
              <Badge variant={ratingVariant[metric.rating]}>{metric.rating.replace("_", " ")}</Badge>
            </div>
            <div className="mt-5">
              <p className="font-mono text-3xl font-bold text-ink">{formatMetricValue(metric)}</p>
              <p
                className={`mt-2 text-[11px] ${
                  change.improving === true
                    ? "text-success"
                    : change.improving === false
                      ? "text-danger"
                      : "text-subtle"
                }`}
              >
                {change.label}
              </p>
              <p className="mt-1 text-[10px] text-subtle">{metric.sampleSize} samples</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
