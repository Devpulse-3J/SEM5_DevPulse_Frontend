"use client";

import { Card } from "@/components/ui/Card";
import { LeadTimeChart } from "@/components/charts/LeadTimeChart";

/* ── Placeholder data (replace with React Query hooks) ── */

interface DoraMetric {
  label: string;
  value: string;
  unit: string;
  trend: string;
  level: "elite" | "high" | "needs-attention";
  /** 7 sparkline bar heights as percentages (0–100) */
  spark: number[];
}

const doraMetrics: DoraMetric[] = [
  {
    label: "Deployment Frequency",
    value: "6.2",
    unit: "/day",
    trend: "▲ Elite · +0.8 vs prior period",
    level: "elite",
    spark: [40, 55, 50, 70, 65, 85, 100],
  },
  {
    label: "Lead Time for Changes",
    value: "4.1",
    unit: "hrs",
    trend: "▼ Elite · −1.4hrs vs prior period",
    level: "elite",
    spark: [80, 70, 60, 55, 40, 35, 30],
  },
  {
    label: "Mean Time to Recovery",
    value: "2.8",
    unit: "hrs",
    trend: "▲ High · +0.6hrs vs prior period",
    level: "high",
    spark: [30, 35, 60, 55, 65, 50, 58],
  },
  {
    label: "Change Failure Rate",
    value: "18.4",
    unit: "%",
    trend: "▲ Needs Attention · +3.1pp vs prior period",
    level: "needs-attention",
    spark: [35, 40, 45, 55, 75, 80, 90],
  },
];

const levelBorder: Record<string, string> = {
  elite: "border-l-success",
  high: "border-l-warning",
  "needs-attention": "border-l-danger",
};

const levelText: Record<string, string> = {
  elite: "text-success",
  high: "text-warning",
  "needs-attention": "text-danger",
};

const sparkColor: Record<string, { dim: string; bright: string }> = {
  elite: {
    dim: "bg-success/40",
    bright: "bg-success",
  },
  high: {
    dim: "bg-warning/40",
    bright: "bg-warning",
  },
  "needs-attention": {
    dim: "bg-danger/40",
    bright: "bg-danger",
  },
};

const leadTimeLabels = [
  "W1", "W2", "W3", "W4", "W5", "W6",
  "W7", "W8", "W9", "W10", "W11", "W12",
];
const leadTimeData = [8.2, 7.5, 7.8, 6.8, 7.1, 5.4, 5.8, 4.2, 4.6, 3.5, 3.1, 2.8];

const deploysByRepo = [
  { name: "api-gateway", count: 42, pct: 88 },
  { name: "web-app", count: 34, pct: 70 },
  { name: "payments-svc", count: 25, pct: 52 },
  { name: "mobile-ios", count: 14, pct: 30 },
  { name: "data-pipeline", count: 9, pct: 20 },
];

interface HighRiskPR {
  risk: string;
  riskScore: number;
  riskLevel: "high" | "med";
  title: string;
  author: string;
  open: string;
  openLevel: "high" | "med" | "normal";
  size: string;
}

const highRiskPRs: HighRiskPR[] = [
  {
    risk: "HIGH",
    riskScore: 0.92,
    riskLevel: "high",
    title: "#4128 Refactor auth token rotation",
    author: "M. Webb",
    open: "11d",
    openLevel: "high",
    size: "+890",
  },
  {
    risk: "HIGH",
    riskScore: 0.87,
    riskLevel: "high",
    title: "#4131 Payment retry queue rewrite",
    author: "D. Alvarez",
    open: "8d",
    openLevel: "high",
    size: "+612",
  },
  {
    risk: "MED",
    riskScore: 0.58,
    riskLevel: "med",
    title: "#4140 Mobile push notification retry",
    author: "A. Osei",
    open: "4d",
    openLevel: "med",
    size: "+205",
  },
  {
    risk: "MED",
    riskScore: 0.51,
    riskLevel: "med",
    title: "#4145 Data pipeline schema migration",
    author: "J. Kim",
    open: "3d",
    openLevel: "med",
    size: "+340",
  },
];

const riskBadgeStyle: Record<string, string> = {
  high: "bg-danger/40 text-danger",
  med: "bg-warning/40 text-warning",
};

const openTimeColor: Record<string, string> = {
  high: "text-danger",
  med: "text-warning",
  normal: "text-muted",
};

/* ── Component ── */

export function ManagerDashboard() {
  return (
    <>
      {/* DORA metric cards — 4 column grid */}
      <div className="grid grid-cols-4 gap-3.5">
        {doraMetrics.map((m) => (
          <Card
            key={m.label}
            className={`border-l-[3px] ${levelBorder[m.level]}`}
          >
            <div className="mb-2.5 text-xs text-muted">{m.label}</div>
            <div className="font-mono text-[30px] font-semibold leading-none">
              {m.value}
              <span className="text-sm text-muted">{m.unit}</span>
            </div>

            {/* Sparkline */}
            <div className="mt-2.5 flex items-end gap-[3px] h-7">
              {m.spark.map((h, i) => {
                const isRecent = i >= m.spark.length - 2;
                return (
                  <div
                    key={i}
                    className={`w-1.5 rounded-sm ${isRecent ? sparkColor[m.level].bright : sparkColor[m.level].dim}`}
                    style={{ height: `${h}%` }}
                  />
                );
              })}
            </div>

            <div
              className={`mt-2 text-[11px] font-semibold ${levelText[m.level]}`}
            >
              {m.trend}
            </div>
          </Card>
        ))}
      </div>

      {/* Charts row — 2fr / 1fr */}
      <div className="grid grid-cols-[2fr_1fr] gap-3.5">
        {/* Lead Time Trend */}
        <Card>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[13px] font-semibold">
              Lead Time Trend — 12 Weeks
            </span>
            <span className="text-[11px] text-subtle">median, hrs</span>
          </div>
          <div className="h-[180px]">
            <LeadTimeChart labels={leadTimeLabels} data={leadTimeData} />
          </div>
        </Card>

        {/* Deploys by Repo */}
        <Card>
          <div className="mb-3 text-[13px] font-semibold">
            Deploys by Repo (7d)
          </div>
          <div className="flex flex-col gap-2.5">
            {deploysByRepo.map((r) => (
              <div key={r.name} className="flex items-center gap-2">
                <span className="w-[82px] text-[11px] text-muted">
                  {r.name}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded bg-surface-raised">
                  <div
                    className="h-full rounded bg-accent"
                    style={{ width: `${r.pct}%` }}
                  />
                </div>
                <span className="w-6 text-right font-mono text-[11px]">
                  {r.count}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Risk table + Alerts — 2fr / 1fr */}
      <div className="grid grid-cols-[2fr_1fr] gap-3.5">
        {/* High-Risk Pull Requests */}
        <Card padding={false} className="overflow-hidden">
          <div className="flex items-center justify-between px-[18px] pt-4 pb-2.5">
            <span className="text-[13px] font-semibold">
              High-Risk Pull Requests
            </span>
            <span className="text-[11px] text-accent">View all →</span>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-[1.2fr_3fr_1.2fr_1fr_1fr] border-b border-border-subtle px-[18px] py-2 text-[11px] text-subtle">
            <div>RISK</div>
            <div>PULL REQUEST</div>
            <div>AUTHOR</div>
            <div>OPEN</div>
            <div>SIZE</div>
          </div>

          {/* Table rows */}
          {highRiskPRs.map((pr, i) => (
            <div
              key={pr.title}
              className={`grid grid-cols-[1.2fr_3fr_1.2fr_1fr_1fr] items-center px-[18px] py-[11px] text-xs ${
                i < highRiskPRs.length - 1
                  ? "border-b border-border-subtle"
                  : ""
              }`}
            >
              <div>
                <span
                  className={`rounded-[5px] px-2 py-[3px] text-[11px] font-bold ${riskBadgeStyle[pr.riskLevel]}`}
                >
                  {pr.risk} · {pr.riskScore}
                </span>
              </div>
              <div>{pr.title}</div>
              <div className="text-muted">{pr.author}</div>
              <div className={openTimeColor[pr.openLevel]}>{pr.open}</div>
              <div className="font-mono text-muted">{pr.size}</div>
            </div>
          ))}
        </Card>

        {/* Bottleneck Alerts — placeholder for Person C */}
        <Card>
          <div className="mb-3 text-[13px] font-semibold">
            Real-Time Bottleneck Alerts
          </div>
          <div className="text-xs text-subtle">
            Alert cards will be implemented by Person C.
          </div>
        </Card>
      </div>
    </>
  );
}

export default ManagerDashboard;
