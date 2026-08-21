"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useDoraSummary } from "@/hooks/useDora";
import { DoraMetricGrid } from "@/features/dora/DoraMetricGrid";
import { LeadTimeChart } from "@/components/charts/LeadTimeChart";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { FeatureUnavailable } from "@/components/ui/FeatureUnavailable";
import { Spinner } from "@/components/ui/Spinner";

export default function DoraPage() {
  const { activeProject, dateRange } = useSelector((state: RootState) => state.dashboard);
  const projectId = activeProject ? Number(activeProject.id) : undefined;
  const windowDays = Number.parseInt(dateRange, 10);
  const summary = useDoraSummary(projectId, windowDays, windowDays);

  if (summary.isPending) {
    return <div className="flex min-h-[320px] items-center justify-center"><Spinner /></div>;
  }

  if (summary.isError || !summary.data) {
    return (
      <div className="p-6 md:p-7">
        <FeatureUnavailable
          title="Unable to load DORA metrics"
          message={summary.error instanceof Error ? summary.error.message : "The metrics request failed."}
        />
      </div>
    );
  }

  const leadTime = summary.data.metrics.find((metric) => metric.key === "leadTime");
  const leadHistory = leadTime?.history.filter(
    (point): point is { date: string; value: number } => point.value !== null,
  ) ?? [];

  return (
    <div className="flex flex-col gap-5 p-6 md:p-7">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-ink">DORA Metrics</h1>
        <p className="mt-1 font-mono text-xs text-subtle">
          Deployment frequency · lead time · MTTR · change failure rate
        </p>
      </div>

      <p className="text-xs text-muted">
        {summary.data.projectName} · {summary.data.repoCount} repositories · {summary.data.windowDays}-day window
      </p>

      <DoraMetricGrid summary={summary.data} />

      <Card className="min-h-[340px]">
        <CardHeader>
          <CardTitle>Lead time history</CardTitle>
          <span className="text-[11px] text-subtle">hours</span>
        </CardHeader>
        <div className="mt-5 h-[260px]">
          {leadHistory.length > 0 ? (
            <LeadTimeChart
              labels={leadHistory.map((point) => point.date.slice(5))}
              data={leadHistory.map((point) => point.value)}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted">
              Historical snapshots will appear after they are calculated.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
