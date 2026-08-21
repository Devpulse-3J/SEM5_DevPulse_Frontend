"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useAuth } from "@/hooks/useAuth";
import { useMyPullRequests } from "@/hooks/usePullRequests";
import { Card, CardTitle } from "@/components/ui/Card";
import { FeatureUnavailable } from "@/components/ui/FeatureUnavailable";
import { Spinner } from "@/components/ui/Spinner";

export function DeveloperDashboard() {
  const activeProject = useSelector((state: RootState) => state.dashboard.activeProject);
  const { user } = useAuth();
  const pullRequests = useMyPullRequests(
    activeProject ? Number(activeProject.id) : undefined,
    user?.fullName,
    20,
  );

  if (pullRequests.isPending) {
    return <div className="flex min-h-[220px] items-center justify-center"><Spinner /></div>;
  }

  if (pullRequests.isError) {
    return (
      <FeatureUnavailable
        title="Unable to load your pull requests"
        message={pullRequests.error instanceof Error ? pullRequests.error.message : "The request failed."}
      />
    );
  }

  return (
    <Card padding={false} className="overflow-hidden">
      <div className="border-b border-border p-5">
        <CardTitle>Your recent pull requests</CardTitle>
      </div>
      <div className="divide-y divide-border-subtle">
        {pullRequests.data?.length ? (
          pullRequests.data.slice(0, 8).map((pullRequest) => (
            <div key={pullRequest.id} className="flex items-center justify-between gap-4 px-5 py-3">
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-ink">
                  #{pullRequest.number} {pullRequest.title}
                </p>
                <p className="mt-1 text-[10px] text-subtle">{pullRequest.repositoryName}</p>
              </div>
              <span className="rounded-md border border-border px-2 py-1 text-[10px] uppercase text-muted">
                {pullRequest.status}
              </span>
            </div>
          ))
        ) : (
          <p className="p-5 text-xs text-muted">No PRs matched your profile name.</p>
        )}
      </div>
    </Card>
  );
}

export default DeveloperDashboard;
