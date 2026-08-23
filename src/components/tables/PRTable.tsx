// OWNER: Person B — reusable High-Risk PR table.

import type { PRRiskLevel, PullRequest } from "@/types/pullRequest";
import { daysOpen } from "@/utils/calculateDuration";

/**
 * `riskAnalysis` is nullable on the gateway DTO (a PR that the ML scorer has
 * not picked up yet), so the styling maps carry an extra "UNSCORED" key rather
 * than the four `PRRiskLevel` values alone.
 */
type RiskKey = PRRiskLevel | "UNSCORED";

const riskStyle: Record<RiskKey, string> = {
  CRITICAL: "bg-danger/70 text-ink",
  HIGH: "bg-danger/40 text-danger",
  MEDIUM: "bg-warning/40 text-warning",
  LOW: "bg-success/40 text-success",
  UNSCORED: "bg-white/5 text-subtle",
};
const openStyle: Record<RiskKey, string> = {
  CRITICAL: "text-danger",
  HIGH: "text-danger",
  MEDIUM: "text-warning",
  LOW: "text-muted",
  UNSCORED: "text-muted",
};

export interface PRTableProps {
  rows: PullRequest[];
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
      {rows.map((pr) => {
        const risk: RiskKey = pr.riskAnalysis?.riskLevel ?? "UNSCORED";
        return (
          <div
            key={pr.id}
            className="grid grid-cols-[1.2fr_3fr_1.2fr_1fr_1fr] items-center border-b border-border-subtle px-4.5 py-2.75 text-xs last:border-b-0 hover:bg-white/[0.02]"
          >
            <div>
              <span
                className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${riskStyle[risk]}`}
              >
                {pr.riskAnalysis
                  ? `${pr.riskAnalysis.riskLevel} · ${Math.round(pr.riskAnalysis.riskScore)}`
                  : "UNSCORED"}
              </span>
            </div>
            <div className="truncate pr-2 text-ink">
              <span className="mr-1.5 font-mono text-muted">#{pr.number}</span>
              {pr.title}
            </div>
            <div className="truncate text-muted">{pr.author}</div>
            <div className={`text-[11px] font-semibold ${openStyle[risk]}`}>
              {daysOpen(pr.createdAt)}d
            </div>
            <div className="text-right font-mono text-[11px]">
              <span className="text-success">+{pr.additions}</span>{" "}
              <span className="text-danger">−{pr.deletions}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PRTable;
