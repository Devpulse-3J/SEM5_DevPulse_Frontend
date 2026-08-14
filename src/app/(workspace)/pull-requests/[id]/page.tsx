import { FeatureUnavailable } from "@/components/ui/FeatureUnavailable";

/**
 * PR risk detail.
 *
 * The previous version rendered a hardcoded `pr` object and ignored its route
 * param entirely — every PR id showed the same fabricated "#4128". The param is
 * now read and displayed so the route is at least honest about what was asked
 * for, but there is no endpoint to resolve it.
 */
export default async function PullRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-5 p-6 md:p-7">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-ink">
          Pull request #{id}
        </h1>
        <p className="mt-1 font-mono text-xs text-subtle">Risk detail</p>
      </div>

      <FeatureUnavailable
        title="Pull request detail is not available yet"
        message="Fetching a pull request requires metrics-service, and its risk breakdown requires analytics-service; neither is implemented yet."
      />
    </div>
  );
}
