import { Card, CardTitle } from "@/components/ui/Card";
import { EffortChart, EFFORT_COLORS } from "@/components/charts/EffortChart";
import {
  mockWorkload,
  mockEffort,
  mockCycleTime,
  mockReviewBottlenecks,
} from "@/features/dora/mockDora";
import type { LoadSeverity, ReviewStatus } from "@/types";

// TODO(Person B): swap mock imports for useWorkload()/useAnalytics() once
// Person A's api-client + gateway are ready.

const loadText: Record<LoadSeverity, string> = {
  good: "text-success",
  warn: "text-warning",
  bad: "text-danger",
};
const loadBar: Record<LoadSeverity, string> = {
  good: "bg-success",
  warn: "bg-warning",
  bad: "bg-danger",
};

const teamColor: Record<string, string> = {
  Backend: "bg-accent",
  Frontend: "bg-warning",
  Mobile: "bg-success",
  Data: "bg-danger",
};

const statusStyle: Record<ReviewStatus, string> = {
  ESCALATED: "bg-danger/15 text-danger",
  WAITING: "bg-warning/15 text-warning",
  OK: "bg-success/15 text-success",
};

export default function TeamPage() {
  return (
    <div className="flex flex-col gap-5 p-6 md:p-7">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[22px] font-bold tracking-tight text-ink">
          Team &amp; Workload
        </h1>
        <div className="flex gap-2">
          <span className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-muted">
            Backend Team ⌄
          </span>
          <span className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-muted">
            Last 14 days ⌄
          </span>
        </div>
      </div>

      {/* Roster + Effort */}
      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[1.6fr_1fr]">
        {/* Developer Capacity roster */}
        <Card padding={false} className="overflow-hidden">
          <CardTitle className="p-4.5 pb-2.5">Developer Capacity</CardTitle>
          <div className="grid grid-cols-[1.6fr_0.8fr_1.4fr_1fr] border-b border-border-subtle px-4.5 py-2 font-mono text-[11px] font-semibold text-subtle">
            <div>DEVELOPER</div>
            <div>ACTIVE PRs</div>
            <div>LOAD</div>
            <div>CYCLE</div>
          </div>
          {mockWorkload.map((d) => (
            <div
              key={d.id}
              className="grid grid-cols-[1.6fr_0.8fr_1.4fr_1fr] items-center border-b border-border-subtle px-4.5 py-2.5 text-xs last:border-b-0"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-surface-raised text-[10px] font-bold text-ink">
                  {d.initials}
                </span>
                <span className="text-ink">{d.name}</span>
              </div>
              <div className="font-mono text-muted">{d.activePrs}</div>
              <div className="flex items-center gap-2 pr-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-raised">
                  <div
                    className={`h-full rounded-full ${loadBar[d.loadSeverity]}`}
                    style={{ width: `${Math.min(d.loadPct, 100)}%` }}
                  />
                </div>
                <span className={`text-[10px] ${loadText[d.loadSeverity]}`}>
                  {d.loadPct}%
                </span>
              </div>
              <div className="font-mono text-muted">{d.cycleTimeDays}d</div>
            </div>
          ))}
        </Card>

        {/* Effort Distribution */}
        <Card>
          <CardTitle className="mb-3">Effort Distribution</CardTitle>
          <div className="flex items-center gap-5">
            <div className="relative h-[120px] w-[120px] shrink-0">
              <EffortChart data={mockEffort} />
            </div>
            <div className="flex flex-col gap-2 text-xs">
              {mockEffort.map((slice, i) => (
                <div key={slice.label} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ background: EFFORT_COLORS[i % EFFORT_COLORS.length] }}
                  />
                  <span className="text-muted">
                    {slice.label} · {slice.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Cycle Time Breakdown */}
      <Card>
        <CardTitle className="mb-3.5">Cycle Time Breakdown by Stage</CardTitle>
        <div className="flex flex-col gap-2.5">
          {mockCycleTime.map((stage) => (
            <div key={stage.stage} className="flex items-center gap-2.5">
              <span className="w-28 text-[11px] text-muted">{stage.stage}</span>
              <div className="flex h-4 flex-1 overflow-hidden rounded">
                {stage.segments.map((seg) => (
                  <div
                    key={seg.team}
                    className={teamColor[seg.team] ?? "bg-subtle"}
                    style={{ width: `${seg.pct}%` }}
                    title={`${seg.team} · ${seg.pct}%`}
                  />
                ))}
              </div>
              <span className="w-10 text-right font-mono text-[11px] text-ink">
                {stage.totalHours}h
              </span>
            </div>
          ))}
          <div className="mt-1.5 flex gap-4 text-[11px] text-subtle">
            {Object.entries(teamColor).map(([team, cls]) => (
              <span key={team} className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-sm ${cls}`} />
                {team}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* Review Bottlenecks */}
      <Card padding={false} className="overflow-hidden">
        <CardTitle className="p-4.5 pb-2.5">Review Bottlenecks</CardTitle>
        <div className="grid grid-cols-[1.4fr_2fr_1.2fr_1fr_1fr] border-b border-border-subtle px-4.5 py-2 font-mono text-[11px] font-semibold text-subtle">
          <div>PR</div>
          <div>TITLE</div>
          <div>REVIEWER</div>
          <div>WAITING</div>
          <div>STATUS</div>
        </div>
        {mockReviewBottlenecks.map((row) => (
          <div
            key={row.prId}
            className="grid grid-cols-[1.4fr_2fr_1.2fr_1fr_1fr] items-center border-b border-border-subtle px-4.5 py-2.75 text-xs last:border-b-0"
          >
            <div className="font-mono text-muted">{row.prId}</div>
            <div className="truncate pr-2 text-ink">{row.title}</div>
            <div className="text-muted">{row.reviewer}</div>
            <div
              className={
                row.waitingHours >= 48 ? "text-danger" : "text-warning"
              }
            >
              {row.waitingHours}h
            </div>
            <div>
              <span
                className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${statusStyle[row.status]}`}
              >
                {row.status}
              </span>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
