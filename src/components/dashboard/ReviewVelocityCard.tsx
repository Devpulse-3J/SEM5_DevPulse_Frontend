"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { useReviewVelocity } from "@/hooks/useMetrics";
import type { ReviewVelocitySummary } from "@/types/metrics";

export interface ReviewVelocityCardProps {
  data?: ReviewVelocitySummary;
  projectId?: number;
  windowDays?: number;
  className?: string;
}

export function formatHours(hours: number | null | undefined): string {
  if (hours === null || hours === undefined) return "N/A";
  if (hours < 1) {
    const mins = Math.max(1, Math.round(hours * 60));
    return `${mins}m`;
  }
  if (hours < 24) {
    return `${hours.toFixed(1)}h`;
  }
  const days = (hours / 24).toFixed(1);
  return `${days}d (${hours.toFixed(0)}h)`;
}

export function getTtfrStatus(hours: number | null | undefined): {
  label: string;
  variant: "success" | "warning" | "danger" | "default";
  textColor: string;
  bgColor: string;
  borderColor: string;
} {
  if (hours === null || hours === undefined) {
    return {
      label: "No reviews",
      variant: "default",
      textColor: "text-subtle",
      bgColor: "bg-surface-raised",
      borderColor: "border-border",
    };
  }
  if (hours < 4) {
    return {
      label: "Good (<4h)",
      variant: "success",
      textColor: "text-success",
      bgColor: "bg-success/15",
      borderColor: "border-success/30",
    };
  }
  if (hours <= 24) {
    return {
      label: "Moderate (4-24h)",
      variant: "warning",
      textColor: "text-warning",
      bgColor: "bg-warning/15",
      borderColor: "border-warning/30",
    };
  }
  return {
    label: "Alert (>24h)",
    variant: "danger",
    textColor: "text-danger",
    bgColor: "bg-danger/15",
    borderColor: "border-danger/30",
  };
}

export function ReviewVelocityCard({
  data: propData,
  projectId,
  windowDays = 30,
  className = "",
}: ReviewVelocityCardProps) {
  const query = useReviewVelocity(propData ? undefined : projectId, windowDays);
  const [showPrList, setShowPrList] = useState(false);

  const data = propData ?? query.data;

  if (!propData && query.isPending) {
    return (
      <Card className={`flex min-h-[300px] items-center justify-center ${className}`}>
        <Spinner />
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className={`p-6 ${className}`}>
        <CardTitle>Code Review Velocity</CardTitle>
        <p className="mt-4 text-xs text-muted">
          {query.isError
            ? "Unable to load review velocity metrics."
            : "Select a project to view review velocity."}
        </p>
      </Card>
    );
  }

  const ttfrStatus = getTtfrStatus(data.averageTtfrHours);
  const coveragePct = Math.min(100, Math.max(0, data.reviewCoveragePct ?? 0));
  const coverageColor =
    coveragePct >= 80 ? "bg-success" : coveragePct >= 60 ? "bg-warning" : "bg-danger";

  return (
    <Card className={`flex flex-col gap-6 ${className}`}>
      <CardHeader className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <CardTitle>Code Review Velocity</CardTitle>
          <p className="mt-1 text-xs text-subtle font-mono">
            {data.windowDays}-day window · {data.totalPullRequests} total PRs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${ttfrStatus.bgColor} ${ttfrStatus.textColor} ${ttfrStatus.borderColor}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                ttfrStatus.variant === "success"
                  ? "bg-success"
                  : ttfrStatus.variant === "warning"
                    ? "bg-warning"
                    : ttfrStatus.variant === "danger"
                      ? "bg-danger"
                      : "bg-subtle"
              }`}
            />
            TTFR: {ttfrStatus.label}
          </span>
        </div>
      </CardHeader>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Avg TTFR */}
        <div className="rounded-lg border border-border bg-surface-raised/40 p-4">
          <p className="text-[11px] font-medium text-subtle uppercase">Avg Time to First Review</p>
          <p className={`mt-2 font-mono text-2xl font-bold ${ttfrStatus.textColor}`}>
            {formatHours(data.averageTtfrHours)}
          </p>
          <p className="mt-1 text-[10px] text-muted">
            {data.averageTtfrHours !== null && data.averageTtfrHours < 4
              ? "Fast review feedback"
              : data.averageTtfrHours !== null && data.averageTtfrHours <= 24
                ? "Acceptable response time"
                : "Bottleneck in review queue"}
          </p>
        </div>

        {/* Median TTFR */}
        <div className="rounded-lg border border-border bg-surface-raised/40 p-4">
          <p className="text-[11px] font-medium text-subtle uppercase">Median TTFR</p>
          <p className="mt-2 font-mono text-2xl font-bold text-ink">
            {formatHours(data.medianTtfrHours)}
          </p>
          <p className="mt-1 text-[10px] text-muted">50th percentile turnaround</p>
        </div>

        {/* Turnaround Time */}
        <div className="rounded-lg border border-border bg-surface-raised/40 p-4">
          <p className="text-[11px] font-medium text-subtle uppercase">Avg Turnaround Time</p>
          <p className="mt-2 font-mono text-2xl font-bold text-ink">
            {formatHours(data.averageTurnaroundHours)}
          </p>
          <p className="mt-1 text-[10px] text-muted">First review to merge/close</p>
        </div>

        {/* Review Iterations */}
        <div className="rounded-lg border border-border bg-surface-raised/40 p-4">
          <p className="text-[11px] font-medium text-subtle uppercase">Avg Review Cycles</p>
          <p className="mt-2 font-mono text-2xl font-bold text-ink">
            {data.averageReviewIterations?.toFixed(1) ?? "1.0"}
            <span className="ml-1 text-xs font-normal text-subtle">iterations</span>
          </p>
          <p className="mt-1 text-[10px] text-muted">Passes per pull request</p>
        </div>
      </div>

      {/* Review Coverage Gauge & Progress Bar */}
      <div className="rounded-lg border border-border bg-surface-raised/30 p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-ink">Review Coverage</span>
          <span className="font-mono text-xs font-bold text-ink">
            {coveragePct.toFixed(1)}% ({data.reviewedPullRequests} / {data.totalPullRequests} PRs)
          </span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-border">
          <div
            className={`h-full transition-all duration-500 rounded-full ${coverageColor}`}
            style={{ width: `${coveragePct}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] text-subtle">
          <span>0%</span>
          <span>Target: &gt; 80% coverage</span>
          <span>100%</span>
        </div>
      </div>

      {/* Optional Pull Requests Drilldown */}
      {data.pullRequests && data.pullRequests.length > 0 && (
        <div className="border-t border-border pt-3">
          <button
            type="button"
            onClick={() => setShowPrList(!showPrList)}
            className="flex items-center justify-between w-full text-xs font-medium text-muted hover:text-ink transition-colors cursor-pointer py-1"
          >
            <span>Recent PR Review Speeds ({data.pullRequests.length} PRs)</span>
            <span>{showPrList ? "Hide ▲" : "Show ▼"}</span>
          </button>

          {showPrList && (
            <div className="mt-3 max-h-60 overflow-y-auto divide-y divide-border/60 rounded-md border border-border bg-surface">
              {data.pullRequests.map((pr) => {
                const prTtfrStatus = getTtfrStatus(pr.ttfrHours);
                return (
                  <div key={pr.prId} className="flex items-center justify-between gap-4 p-3 text-xs">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">
                        #{pr.prNumber} {pr.title}
                      </p>
                      <p className="mt-0.5 text-[10px] text-subtle">
                        {pr.reviewCount} review{pr.reviewCount === 1 ? "" : "s"} · Turnaround:{" "}
                        {formatHours(pr.turnaroundHours)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`rounded px-2 py-0.5 font-mono text-[10px] font-semibold border ${prTtfrStatus.bgColor} ${prTtfrStatus.textColor} ${prTtfrStatus.borderColor}`}
                      >
                        TTFR: {formatHours(pr.ttfrHours)}
                      </span>
                      <Badge variant="default">{pr.state}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

export default ReviewVelocityCard;
