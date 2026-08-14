import { FeatureUnavailable } from "@/components/ui/FeatureUnavailable";

export default function MyPRsPage() {
  return (
    <div className="flex flex-col gap-5 p-6 md:p-7">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-ink">My Pull Requests</h1>
        <p className="mt-1 font-mono text-xs text-subtle">
          Review status, change size, and risk scores
        </p>
      </div>

      <FeatureUnavailable
        title="Pull requests are not available yet"
        message="Your pull requests come from metrics-service, which is not yet implemented."
      />
    </div>
  );
}
