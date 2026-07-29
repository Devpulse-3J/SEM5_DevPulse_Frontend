"use client";

import React, { use } from "react";
import { SharedDashboard } from "../../dashboard/SharedDashboard";
import { RepositoryDetailView } from "@/features/repositories/RepositoryDetailView";
import { useRepositoryDetail, useSyncRepository } from "@/hooks/useRepositories";

interface RepositoryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function RepositoryDetailPage({ params }: RepositoryDetailPageProps) {
  const resolvedParams = use(params);
  const { data: repository, isLoading } = useRepositoryDetail(resolvedParams.id);
  const syncMutation = useSyncRepository();

  const handleSync = (id: string) => {
    syncMutation.mutate(id);
  };

  return (
    <SharedDashboard
      title={repository ? repository.fullName : "Repository Detail"}
      subtitle="Deep metric analysis, branch health, and recent repository commits"
    >
      {isLoading || !repository ? (
        <div className="p-8 text-center text-xs text-subtle">Loading repository details...</div>
      ) : (
        <RepositoryDetailView repository={repository} onSync={handleSync} />
      )}
    </SharedDashboard>
  );
}
