"use client";

import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { usePullRequest } from "@/hooks/usePullRequests";
import { PRRiskCard } from "@/features/pullRequests/PRRiskCard";
import { Card } from "@/components/ui/Card";
import { FeatureUnavailable } from "@/components/ui/FeatureUnavailable";
import { Spinner } from "@/components/ui/Spinner";

export default function PullRequestDetailPage() {
  const params = useParams<{ id: string }>();
  const activeProject = useSelector((state: RootState) => state.dashboard.activeProject);
  const query = usePullRequest(activeProject ? Number(activeProject.id) : undefined, params.id);

  if (query.isPending) {
    return <div className="flex min-h-[320px] items-center justify-center"><Spinner /></div>;
  }

  if (query.isError || !query.data) {
    return (
      <div className="p-6 md:p-7">
        <FeatureUnavailable
          title="Unable to load pull request"
          message={query.error instanceof Error ? query.error.message : "The request failed."}
        />
      </div>
    );
  }

  const pullRequest = query.data;

  return (
    <div className="flex flex-col gap-5 p-6 md:p-7">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-ink">
          Pull request #{pullRequest.number}
        </h1>
        <p className="mt-1 font-mono text-xs text-subtle">
          {pullRequest.repositoryName} · {pullRequest.status}
        </p>
      </div>

      <Card className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-[11px] uppercase text-subtle">Title</p>
          <p className="mt-1 text-sm font-semibold text-ink">{pullRequest.title}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase text-subtle">Author</p>
          <p className="mt-1 text-sm text-ink">{pullRequest.author}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase text-subtle">Branches</p>
          <p className="mt-1 font-mono text-xs text-ink">
            {pullRequest.headBranch ?? "unknown"} → {pullRequest.baseBranch}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase text-subtle">Change size</p>
          <p className="mt-1 font-mono text-xs text-ink">
            +{pullRequest.additions} / −{pullRequest.deletions} · {pullRequest.changedFiles} files
          </p>
        </div>
      </Card>

      {/* Review Velocity & Turnaround Metrics */}
      <Card className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-ink uppercase tracking-wider">
          Review Velocity & Feedback Speed
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {pullRequest.timeToFirstReviewHours !== undefined &&
          pullRequest.timeToFirstReviewHours !== null ? (
            <div className="rounded-md border border-border bg-surface-raised px-3 py-2">
              <span className="text-[10px] uppercase text-subtle block">Time to First Review</span>
              <span className="font-mono text-sm font-bold text-ink">
                First review in {pullRequest.timeToFirstReviewHours.toFixed(1)}h
              </span>
            </div>
          ) : (
            <div className="rounded-md border border-border bg-surface-raised px-3 py-2 text-subtle text-xs">
              Awaiting first review
            </div>
          )}

          <div className="rounded-md border border-border bg-surface-raised px-3 py-2">
            <span className="text-[10px] uppercase text-subtle block">Review Cycles</span>
            <span className="font-mono text-sm font-bold text-ink">
              {pullRequest.reviewIterations ?? (pullRequest.reviews.length > 0 ? 1 : 0)} iterations
            </span>
          </div>

          {pullRequest.reviewTurnaroundHours !== undefined &&
            pullRequest.reviewTurnaroundHours !== null && (
              <div className="rounded-md border border-border bg-surface-raised px-3 py-2">
                <span className="text-[10px] uppercase text-subtle block">Turnaround Time</span>
                <span className="font-mono text-sm font-bold text-ink">
                  {pullRequest.reviewTurnaroundHours.toFixed(1)}h from 1st review to merge
                </span>
              </div>
            )}
        </div>
      </Card>

      <PRRiskCard pullRequest={pullRequest} />
    </div>
  );
}
