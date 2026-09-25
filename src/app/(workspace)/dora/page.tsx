"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useAuth } from "@/hooks/useAuth";
import { useDoraSummary, useRebuildDoraHistory } from "@/hooks/useDora";
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
  const { user } = useAuth();
  const rebuild = useRebuildDoraHistory(projectId);
  // Company admins only; the API enforces this too, the button is just hidden for others.
  const canRebuild = user?.systemRole === "admin";

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
          <div className="flex items-center gap-3">
            {canRebuild && (
              <button
                type="button"
                onClick={() => rebuild.mutate(windowDays)}
                disabled={rebuild.isPending}
                title="Recalculate the stored daily snapshots from the data as it is now"
                className="cursor-pointer rounded-md border border-border bg-canvas px-2.5 py-1 text-[11px] font-medium text-ink hover:border-accent/40 disabled:cursor-wait disabled:opacity-60"
              >
                {rebuild.isPending ? "Rebuilding…" : "Rebuild history"}
              </button>
            )}
            <span className="text-[11px] text-subtle">hours</span>
          </div>
        </CardHeader>
        {rebuild.isSuccess && (
          <p role="status" className="mt-2 text-[11px] text-success">
            Rebuilt {rebuild.data.snapshotsRebuilt} daily snapshot{rebuild.data.snapshotsRebuilt === 1 ? "" : "s"}.
          </p>
        )}
        {rebuild.isError && (
          <p role="alert" className="mt-2 text-[11px] font-medium text-danger">
            {rebuild.error instanceof Error ? rebuild.error.message : "Could not rebuild the history."}
          </p>
        )}
        <div className="mt-5 h-[260px]">
          {leadHistory.length > 0 ? (
            <LeadTimeChart
              labels={leadHistory.map((point) => point.date.slice(5))}
              data={leadHistory.map((point) => point.value)}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted">
              Historical snapshots appear as each day is calculated. An admin can use “Rebuild history” to recalculate past days now.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
