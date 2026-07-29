import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { PRTable, type PrRiskRow } from "@/components/tables/PRTable";

// Local mock until Person C's PullRequest type + service land.
// TODO(Person B): replace with usePullRequests() feeding PRTable.
const mockHighRiskPrs: PrRiskRow[] = [
  { id: "#4128", title: "Refactor auth token rotation", author: "M. Webb", risk: "HIGH", score: 0.92, openDays: 11, diff: "+890" },
  { id: "#4131", title: "Payment retry queue rewrite", author: "D. Alvarez", risk: "HIGH", score: 0.87, openDays: 8, diff: "+612" },
  { id: "#4140", title: "Mobile push notification retry", author: "A. Osei", risk: "MED", score: 0.58, openDays: 4, diff: "+205" },
  { id: "#4145", title: "Data pipeline schema migration", author: "J. Kim", risk: "MED", score: 0.51, openDays: 3, diff: "+340" },
];

export default function PullRequestsPage() {
  return (
    <div className="flex flex-col gap-5 p-6 md:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[22px] font-bold tracking-tight text-ink">
          PR Risk &amp; Insights
        </h1>
        <div className="flex gap-2">
          <span className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-muted">
            All Teams ⌄
          </span>
          <span className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-muted">
            High risk first ⌄
          </span>
        </div>
      </div>

      <Card padding={false} className="overflow-hidden">
        <CardHeader className="p-4.5 pb-2.5">
          <CardTitle>High-Risk Pull Requests</CardTitle>
          <span className="text-[11px] text-subtle">
            {mockHighRiskPrs.length} open
          </span>
        </CardHeader>
        <PRTable rows={mockHighRiskPrs} />
      </Card>
    </div>
  );
}
