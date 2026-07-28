"use client";

import React from "react";
import { SharedDashboard } from "../dashboard/SharedDashboard";
import { RepositoryList } from "@/features/repositories/RepositoryList";
import { useRepositories, useSyncRepository } from "@/hooks/useRepositories";

export default function RepositoriesPage() {
  const { data: repositories = [], isLoading } = useRepositories();
  const syncMutation = useSyncRepository();

  const handleSyncRepo = (id: string) => {
    syncMutation.mutate(id);
  };

  return (
    <SharedDashboard
      title="Repositories"
      subtitle="Connected source code repositories, health indicators, and activity metrics"
    >
      {isLoading ? (
        <div className="p-8 text-center text-xs text-subtle">Loading repositories...</div>
      ) : (
        <RepositoryList
          repositories={repositories}
          onSyncRepo={handleSyncRepo}
        />
      )}
    </SharedDashboard>
  );
}
