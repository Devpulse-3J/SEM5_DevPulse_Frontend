"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useAuth } from "@/hooks/useAuth";
import { useMyPullRequests } from "@/hooks/usePullRequests";
import { MyPRList } from "@/features/pullRequests/MyPRList";
import { FeatureUnavailable } from "@/components/ui/FeatureUnavailable";
import { Spinner } from "@/components/ui/Spinner";

export default function MyPRsPage() {
  const activeProject = useSelector((state: RootState) => state.dashboard.activeProject);
  const { user } = useAuth();
  const query = useMyPullRequests(
    activeProject ? Number(activeProject.id) : undefined,
    user?.fullName,
  );

  if (query.isPending) {
    return <div className="flex min-h-[320px] items-center justify-center"><Spinner /></div>;
  }
  return (
    <div className="flex flex-col gap-5 p-6 md:p-7">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-ink">My Pull Requests</h1>
        <p className="mt-1 font-mono text-xs text-subtle">
          Review status and change size for PRs matching your profile name
        </p>
      </div>

      {query.isError ? (
        <FeatureUnavailable
          title="Unable to load your pull requests"
          message={query.error instanceof Error ? query.error.message : "The request failed."}
        />
      ) : (
        <MyPRList pullRequests={query.data ?? []} />
      )}
    </div>
  );
}
