import { FeatureUnavailable } from "@/components/ui/FeatureUnavailable";

export default async function RepositoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-5 p-6 md:p-7">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-ink">Repository {id}</h1>
        <p className="mt-1 font-mono text-xs text-subtle">Branch health and recent commits</p>
      </div>

      <FeatureUnavailable
        title="Repository detail is not available yet"
        message="Repository data requires integration-service to ingest GitHub, which is not yet implemented."
      />
    </div>
  );
}
