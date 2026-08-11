import { Card, CardTitle } from "@/components/ui/Card";
import { severityText, severityBg, type Severity } from "@/utils/colors";

// OWNER: Person B — PR Risk Detail drill-down (UI spec "PR Risk Detail").
// TODO: replace this local mock with usePullRequestRisk(id) once the gateway
// + Person C's PullRequest type are wired. Route param `id` will pick the PR.

type TimelineSeverity = Severity | "info" | "muted";

const pr = {
  id: "#4128",
  title: "Refactor auth token rotation",
  branch: "api-gateway · feature/token-rotation → main · linked JIRA-2291",
  score: "0.92",
  author: "Marcus Webb",
  openDays: 11,
  files: 23,
  diff: "+890 / −214",
  contributors: [
    { label: "Diff size vs. team baseline", value: "+0.34", pct: 82, severity: "bad" as Severity },
    { label: "Test coverage delta", value: "+0.27", pct: 65, severity: "bad" as Severity },
    { label: "Author unfamiliarity with files touched", value: "+0.18", pct: 44, severity: "warn" as Severity },
    { label: "PR age / open duration", value: "+0.13", pct: 31, severity: "warn" as Severity },
  ],
  timeline: [
    { text: "Opened by M. Webb", when: "11 days ago", sev: "info" as TimelineSeverity },
    { text: "Review requested — P. Patel, J. Kim", when: "10 days ago", sev: "info" as TimelineSeverity },
    { text: "3 change requests from P. Patel", when: "8 days ago", sev: "warn" as TimelineSeverity },
    { text: "CI failed — 2 consecutive runs", when: "2 days ago", sev: "bad" as TimelineSeverity },
    { text: "No activity since", when: "4 days ago", sev: "muted" as TimelineSeverity },
  ],
  reviewers: [
    { name: "Priya Patel", status: "CHANGES REQ.", cls: "bg-danger/40 text-danger" },
    { name: "Jordan Kim", status: "AWAITING", cls: "bg-surface-raised text-muted" },
  ],
};

const dotColor: Record<TimelineSeverity, string> = {
  good: "bg-success",
  warn: "bg-warning",
  bad: "bg-danger",
  info: "bg-accent",
  muted: "bg-subtle",
};

export default function PullRequestDetailPage() {
  return (
    <div className="flex flex-col gap-5 p-6 md:p-10">
      {/* Breadcrumb */}
      <div className="text-xs text-subtle">
        Overview <span className="mx-1.5">›</span> High-Risk Pull Requests
        <span className="mx-1.5">›</span>
        <span className="text-ink">{pr.id}</span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          {/* PR header */}
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-bold text-ink">
                  {pr.id} {pr.title}
                </div>
                <div className="mt-1.5 text-xs text-muted">{pr.branch}</div>
              </div>
              <span className="shrink-0 rounded-md bg-danger/40 px-3 py-1.5 text-xs font-bold text-danger">
                HIGH RISK · {pr.score}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-6 text-xs text-muted">
              <span>
                Author: <b className="text-ink">{pr.author}</b>
              </span>
              <span>
                Open: <b className="text-danger">{pr.openDays} days</b>
              </span>
              <span>
                Files: <b className="text-ink">{pr.files}</b>
              </span>
              <span>
                Diff: <b className="font-mono text-ink">{pr.diff}</b>
              </span>
            </div>
          </Card>

          {/* Risk contributors */}
          <Card>
            <CardTitle className="mb-3.5">Risk Contributors (ML model)</CardTitle>
            <div className="flex flex-col gap-3">
              {pr.contributors.map((c) => (
                <div key={c.label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-ink">{c.label}</span>
                    <span className={`font-mono ${severityText[c.severity]}`}>
                      {c.value}
                    </span>
                  </div>
                  <div className="h-[7px] rounded bg-surface-raised">
                    <div
                      className={`h-full rounded ${severityBg[c.severity]}`}
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* CI status */}
          <Card className="flex items-center justify-between">
            <div className="flex gap-5 text-xs">
              <span>
                CI: <span className="font-semibold text-danger">● Failing (3 runs)</span>
              </span>
              <span>
                Checks: <span className="font-semibold text-warning">2/4 passed</span>
              </span>
            </div>
            <span className="rounded-md border border-border bg-surface-raised px-2.5 py-1 text-[11px] font-semibold text-accent">
              STALE PR — no activity 4 days
            </span>
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Activity timeline */}
          <Card>
            <CardTitle className="mb-3.5">Activity Timeline</CardTitle>
            <div className="flex flex-col gap-3.5 text-xs">
              {pr.timeline.map((t, i) => (
                <div key={i} className="flex gap-2.5">
                  <span
                    className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dotColor[t.sev]}`}
                  />
                  <div>
                    <div className="text-ink">{t.text}</div>
                    <div className="text-[11px] text-subtle">{t.when}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Reviewers */}
          <Card>
            <CardTitle className="mb-3.5">Reviewers</CardTitle>
            <div className="flex flex-col gap-2.5 text-xs">
              {pr.reviewers.map((r) => (
                <div key={r.name} className="flex items-center justify-between">
                  <span className="text-ink">{r.name}</span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${r.cls}`}
                  >
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
