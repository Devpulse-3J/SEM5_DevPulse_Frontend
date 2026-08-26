"use client";

import Link from "next/link";
import { FeatureUnavailable } from "@/components/ui/FeatureUnavailable";
import { Spinner } from "@/components/ui/Spinner";
import { useRepositories } from "@/hooks/useRepositories";

function formatSyncTime(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function RepositoriesPage() {
  const query = useRepositories();

  if (query.isPending) {
    return <div className="flex min-h-[320px] items-center justify-center"><Spinner /></div>;
  }

  if (query.isError) {
    return (
      <div className="p-6 md:p-7">
        <FeatureUnavailable
          title="Unable to load repositories"
          message={query.error instanceof Error ? query.error.message : "The request failed."}
        />
      </div>
    );
  }

  const repositories = query.data ?? [];

  return (
    <div className="flex flex-col gap-5 p-6 md:p-7">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-ink">Repositories</h1>
        <p className="mt-1 font-mono text-xs text-subtle">
          Connected source repositories and their sync status
        </p>
      </div>

      {repositories.length === 0 ? (
        <p className="text-sm text-subtle">No repositories are connected to this company.</p>
      ) : (
        <div className="overflow-x-auto border border-line">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-surface-raised text-xs text-subtle">
              <tr>
                <th className="px-4 py-3 font-medium">Repository</th>
                <th className="px-4 py-3 font-medium">Owner</th>
                <th className="px-4 py-3 font-medium">Project</th>
                <th className="px-4 py-3 font-medium">Last synced</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {repositories.map((repository) => (
                <tr key={repository.id} className="text-ink">
                  <td className="px-4 py-3 font-medium">
                    <Link className="hover:underline" href={`/repositories/${repository.id}`}>
                      {repository.fullName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-subtle">{repository.ownerName}</td>
                  <td className="px-4 py-3 text-subtle">
                    {repository.projectName ?? "Unassigned"}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-subtle">
                    {formatSyncTime(repository.lastSyncedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
