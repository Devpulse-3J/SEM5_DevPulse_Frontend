// OWNER: Person B — reusable High-Risk PR table.
// NOTE: `PrRiskRow` is a temporary local shape. Migrate to Person C's
// `PullRequest` type (types/pullRequest.ts) once it exists.

export type PrRisk = "HIGH" | "MED" | "LOW";

export interface PrRiskRow {
  id: string; // "#4128"
  title: string;
  author: string;
  risk: PrRisk;
  score: number; // 0–1
  openDays: number;
  diff: string; // "+890"
}

const riskStyle: Record<PrRisk, string> = {
  HIGH: "bg-danger/40 text-danger",
  MED: "bg-warning/40 text-warning",
  LOW: "bg-success/40 text-success",
};
const openStyle: Record<PrRisk, string> = {
  HIGH: "text-danger",
  MED: "text-warning",
  LOW: "text-muted",
};

export interface PRTableProps {
  rows: PrRiskRow[];
}

export function PRTable({ rows }: PRTableProps) {
  return (
    <div>
      <div className="grid grid-cols-[1.2fr_3fr_1.2fr_1fr_1fr] border-b border-border-subtle px-4.5 py-2 font-mono text-[11px] font-semibold text-subtle">
        <div>RISK</div>
        <div>PULL REQUEST</div>
        <div>AUTHOR</div>
        <div>OPEN</div>
        <div className="text-right">SIZE</div>
      </div>
      {rows.map((pr) => (
        <div
          key={pr.id}
          className="grid grid-cols-[1.2fr_3fr_1.2fr_1fr_1fr] items-center border-b border-border-subtle px-4.5 py-2.75 text-xs last:border-b-0 hover:bg-white/[0.02]"
        >
          <div>
            <span
              className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${riskStyle[pr.risk]}`}
            >
              {pr.risk} · {pr.score.toFixed(2)}
            </span>
          </div>
          <div className="truncate pr-2 text-ink">
            <span className="mr-1.5 font-mono text-muted">{pr.id}</span>
            {pr.title}
          </div>
          <div className="truncate text-muted">{pr.author}</div>
          <div className={`text-[11px] font-semibold ${openStyle[pr.risk]}`}>
            {pr.openDays}d
          </div>
          <div className="text-right font-mono text-[11px] text-muted">
            {pr.diff}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PRTable;
