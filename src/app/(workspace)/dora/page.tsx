import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { LeadTimeChart } from "@/components/charts/LeadTimeChart";
import {
  mockDoraSummary,
  mockLeadTimeTrend,
  mockRepoDeploys,
} from "@/features/dora/mockDora";
import type { DoraMetricCard, MetricSeverity } from "@/types";

// TODO(Person B): swap mock imports for useDora() once the gateway is wired.

const sevBorder: Record<MetricSeverity, string> = {
  good: "border-l-success",
  warn: "border-l-warning",
  bad: "border-l-danger",
};
const sevText: Record<MetricSeverity, string> = {
  good: "text-success",
  warn: "text-warning",
  bad: "text-danger",
};
const sevBar: Record<MetricSeverity, string> = {
  good: "bg-success",
  warn: "bg-warning",
  bad: "bg-danger",
};

function MetricCard({ metric }: { metric: DoraMetricCard }) {
  return (
    <Card className={`border-l-[3px] ${sevBorder[metric.severity]}`}>
      <div className="mb-2.5 text-xs text-muted">{metric.label}</div>
      <div className="font-mono text-[30px] font-semibold leading-none text-ink">
        {metric.value}
        <span className="ml-0.5 text-sm font-normal text-muted">
          {metric.unit}
        </span>
      </div>
      {/* Sparkline */}
      <div className="mt-2.5 flex h-7 items-end gap-[3px]">
        {metric.sparkline.map((h, i) => {
          const strong = i >= metric.sparkline.length - 2;
          return (
            <div
              key={i}
              className={`w-1.5 rounded-sm ${sevBar[metric.severity]} ${strong ? "" : "opacity-40"}`}
              style={{ height: `${h}%` }}
            />
          );
        })}
      </div>
      <div className={`mt-2 text-[11px] font-semibold ${sevText[metric.severity]}`}>
        {metric.trend.direction === "up" ? "▲" : "▼"} {metric.trend.text}
      </div>
    </Card>
  );
}

export default function DoraPage() {
  return (
    <div className="flex flex-col gap-5 p-6 md:p-7">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-ink">
            DORA Metrics
          </h1>
          <p className="mt-1 font-mono text-xs text-subtle">
            {mockDoraSummary.project} · {mockDoraSummary.repoCount} repos ·
            updated {mockDoraSummary.updatedAgo}
          </p>
        </div>
        <div className="flex gap-2">
          <span className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-muted">
            All Teams ⌄
          </span>
          <span className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-muted">
            Last 30 days ⌄
          </span>
        </div>
      </div>

      {/* DORA metric cards */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {mockDoraSummary.metrics.map((m) => (
          <MetricCard key={m.key} metric={m} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[2fr_1fr]">
        {/* Lead Time Trend */}
        <Card>
          <CardHeader className="mb-2">
            <CardTitle>Lead Time Trend — 12 Weeks</CardTitle>
            <span className="font-mono text-[11px] text-subtle">
              {mockLeadTimeTrend.unit}
            </span>
          </CardHeader>
          <div className="h-[180px] w-full">
            <LeadTimeChart
              labels={mockLeadTimeTrend.points.map((p) => p.week)}
              data={mockLeadTimeTrend.points.map((p) => p.hours)}
            />
          </div>
        </Card>

        {/* Deploys by Repo */}
        <Card>
          <CardTitle className="mb-3">Deploys by Repo (7d)</CardTitle>
          <div className="flex flex-col gap-2.5">
            {mockRepoDeploys.map((r) => (
              <div key={r.repo} className="flex items-center gap-2 text-xs">
                <span className="w-[88px] truncate text-[11px] text-muted">
                  {r.repo}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-raised">
                  <div
                    className="h-full rounded-full bg-viz-1"
                    style={{ width: `${r.pct}%` }}
                  />
                </div>
                <span className="w-6 text-right font-mono text-[11px] text-ink">
                  {r.deploys}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
