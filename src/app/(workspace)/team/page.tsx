import { FeatureUnavailable } from "@/components/ui/FeatureUnavailable";

// Team workload, effort distribution, cycle time and review bottlenecks all
// come from analytics-service, which currently serves only /health.

export default function TeamPage() {
  return (
    <div className="flex flex-col gap-5 p-6 md:p-7">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-ink">Team &amp; Workload</h1>
        <p className="mt-1 font-mono text-xs text-subtle">
          Capacity · effort distribution · cycle time · review bottlenecks
        </p>
      </div>

      <FeatureUnavailable
        title="Team analytics are not available yet"
        message="Workload and cycle-time analytics require analytics-service, which is not yet implemented."
      />
    </div>
  );
}
