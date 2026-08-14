import { FeatureUnavailable } from "@/components/ui/FeatureUnavailable";

// The DORA screens have no backend: metrics-service is an empty entrypoint
// class with no controllers, so there is no /api/metrics/** route to call.
// The page shell and route are kept so navigation still works.

export default function DoraPage() {
  return (
    <div className="flex flex-col gap-5 p-6 md:p-7">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-ink">DORA Metrics</h1>
        <p className="mt-1 font-mono text-xs text-subtle">
          Deployment frequency · lead time · MTTR · change failure rate
        </p>
      </div>

      <FeatureUnavailable
        title="DORA metrics are not available yet"
        message="DORA metrics require metrics-service, which is not yet implemented."
      />
    </div>
  );
}
