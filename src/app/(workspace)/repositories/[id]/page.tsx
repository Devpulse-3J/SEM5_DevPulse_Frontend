"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { FeatureUnavailable } from "@/components/ui/FeatureUnavailable";
import { Spinner } from "@/components/ui/Spinner";
import { useRepositoryDetail } from "@/hooks/useRepositories";

function formatSyncTime(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function RepositoryDetailPage() {
  const params = useParams<{ id: string }>();
  const repositoryId = Number(params.id);
  const query = useRepositoryDetail(Number.isInteger(repositoryId) ? repositoryId : undefined);

  if (query.isPending) {
    return <div className="flex min-h-[320px] items-center justify-center"><Spinner /></div>;
  }

  if (query.isError || !query.data) {
    return (
      <div className="p-6 md:p-7">
        <FeatureUnavailable
          title="Unable to load repository"
          message={query.error instanceof Error ? query.error.message : "The repository was not found."}
        />
      </div>
    );
  }

  const repository = query.data;

  return (
    <div className="flex flex-col gap-5 p-6 md:p-7">
      <div>
        <Link className="font-mono text-xs text-subtle hover:underline" href="/repositories">
          Back to repositories
        </Link>
        <h1 className="mt-2 text-[22px] font-bold tracking-tight text-ink">{repository.fullName}</h1>
        <p className="mt-1 font-mono text-xs text-subtle">Repository integration details</p>
      </div>

      <Card className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-[11px] uppercase text-subtle">Repository</p>
          <p className="mt-1 text-sm font-semibold text-ink">{repository.repoName}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase text-subtle">Owner</p>
          <p className="mt-1 text-sm text-ink">{repository.ownerName}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase text-subtle">Project</p>
          <p className="mt-1 text-sm text-ink">{repository.projectName ?? "Unassigned"}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase text-subtle">Last synced</p>
          <p className="mt-1 font-mono text-xs text-ink">{formatSyncTime(repository.lastSyncedAt)}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase text-subtle">GitHub repository ID</p>
          <p className="mt-1 font-mono text-xs text-ink">{repository.githubRepoId}</p>
        </div>
      </Card>
    </div>
  );
}
