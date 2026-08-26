"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useDeployments, useDoraSummary, useWorkload } from "@/hooks/useDora";
import { DoraMetricGrid } from "@/features/dora/DoraMetricGrid";
import { WorkloadChart } from "@/components/charts/WorkloadChart";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { FeatureUnavailable } from "@/components/ui/FeatureUnavailable";
import { Spinner } from "@/components/ui/Spinner";
import { formatDateTime } from "@/utils/formatDate";

export function ManagerDashboard() {
  const { activeProject, dateRange } = useSelector((state: RootState) => state.dashboard);
  const projectId = activeProject ? Number(activeProject.id) : undefined;
  const windowDays = Number.parseInt(dateRange, 10);
  const dora = useDoraSummary(projectId, windowDays, windowDays);
  const workload = useWorkload(projectId, windowDays);
  const deployments = useDeployments(projectId, {
    environment: "production",
    limit: 8,
    offset: 0,
  });

  if (dora.isPending || workload.isPending || deployments.isPending) {
    return <div className="flex min-h-[280px] items-center justify-center"><Spinner /></div>;
  }

  if (dora.isError || !dora.data) {
    return (
      <FeatureUnavailable
        title="Unable to load manager metrics"
        message={dora.error instanceof Error ? dora.error.message : "The metrics request failed."}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <DoraMetricGrid summary={dora.data} />

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="min-h-[340px]">
          <CardHeader>
            <CardTitle>Developer workload</CardTitle>
            <span className="text-[11px] text-subtle">target active PR capacity</span>
          </CardHeader>
          <div className="mt-5 h-[260px]">
            {workload.data?.length ? (
              <WorkloadChart
                developers={workload.data.map((entry) => ({
                  name: entry.name,
                  load: entry.loadPct,
                }))}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted">
                No project-member workload data.
              </div>
            )}
          </div>
        </Card>

        <Card padding={false} className="overflow-hidden">
          <div className="border-b border-border p-5">
            <CardTitle>Recent production deployments</CardTitle>
          </div>
          <div className="divide-y divide-border-subtle">
            {deployments.data?.length ? (
              deployments.data.map((deployment) => (
                <div key={deployment.id} className="flex items-center justify-between gap-4 px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-mono text-xs text-ink">
                      {deployment.commitSha?.slice(0, 8) ?? "No linked commit"}
                    </p>
                    <p className="mt-1 text-[10px] text-subtle">
                      {formatDateTime(deployment.deployedAt)}
                    </p>
                  </div>
                  <span className="rounded-md border border-border px-2 py-1 text-[10px] uppercase text-muted">
                    {deployment.status.replace("_", " ")}
                  </span>
                </div>
              ))
            ) : (
              <p className="p-5 text-xs text-muted">No production deployments found.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ManagerDashboard;
