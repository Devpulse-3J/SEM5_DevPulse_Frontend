import { FeatureUnavailable } from "@/components/ui/FeatureUnavailable";

export default function RepositoriesPage() {
  return (
    <div className="flex flex-col gap-5 p-6 md:p-7">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-ink">Repositories</h1>
        <p className="mt-1 font-mono text-xs text-subtle">
          Connected source repositories and their health
        </p>
      </div>

      <FeatureUnavailable
        title="Repositories are not available yet"
        message="Repository data requires integration-service to ingest GitHub, which is not yet implemented."
      />
    </div>
  );
}
