import { FeatureUnavailable } from "@/components/ui/FeatureUnavailable";

export default function PullRequestsPage() {
  return (
    <div className="flex flex-col gap-5 p-6 md:p-7">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-ink">PR Risk &amp; Insights</h1>
        <p className="mt-1 font-mono text-xs text-subtle">
          Pull requests scored by ML risk analysis
        </p>
      </div>

      <FeatureUnavailable
        title="Pull request data is not available yet"
        message="Pull requests come from metrics-service and risk scores from analytics-service; neither is implemented yet."
      />
    </div>
  );
}
