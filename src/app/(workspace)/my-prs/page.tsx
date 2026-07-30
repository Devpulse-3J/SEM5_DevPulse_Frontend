"use client";

import React from "react";
import { SharedDashboard } from "../dashboard/SharedDashboard";
import { MyPRList } from "@/features/pullRequests/MyPRList";
import { useMyPullRequests } from "@/hooks/usePullRequests";

export default function MyPRsPage() {
  const { data: pullRequests = [], isLoading } = useMyPullRequests();

  return (
    <SharedDashboard
      title="My Pull Requests"
      subtitle="Track review status, code change metrics, and automated risk scores for your PRs"
    >
      {isLoading ? (
        <div className="p-8 text-center text-xs text-subtle">Loading pull requests...</div>
      ) : (
        <MyPRList pullRequests={pullRequests} />
      )}
    </SharedDashboard>
  );
}
