"use client";

import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { useDevExSummary } from "@/hooks/useMetrics";
import type { DevExSummary, WorkloadEntry, WorkloadStatus, TeamHealthStatus } from "@/types/metrics";
import { formatHours } from "./ReviewVelocityCard";

export interface DevExWorkloadViewProps {
  data?: DevExSummary;
  projectId?: number;
  windowDays?: number;
  className?: string;
}

export function DevExWorkloadView({
  data: propData,
  projectId,
  windowDays = 30,
  className = "",
}: DevExWorkloadViewProps) {
  const query = useDevExSummary(propData ? undefined : projectId, windowDays);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<WorkloadStatus | "ALL">("ALL");

  const data = propData ?? query.data;

  const filteredMembers = useMemo(() => {
    if (!data?.members) return [];
    return data.members.filter((member) => {
      const matchesSearch = member.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || member.workloadStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  if (!propData && query.isPending) {
    return (
      <Card className={`flex min-h-[340px] items-center justify-center ${className}`}>
        <Spinner />
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className={`p-6 ${className}`}>
        <CardTitle>DevEx & Workload Balance</CardTitle>
        <p className="mt-4 text-xs text-muted">
          {query.isError
            ? "Unable to load DevEx & Workload metrics."
            : "Select a project to view developer experience and workload balance."}
        </p>
      </Card>
    );
  }

  const teamHealth = data.overallTeamHealth ?? "HEALTHY";
  const healthConfig: Record<
    TeamHealthStatus,
    { label: string; text: string; bg: string; border: string; desc: string }
  > = {
    HEALTHY: {
      label: "Healthy Team Flow",
      text: "text-success",
      bg: "bg-success/15",
      border: "border-success/30",
      desc: "Balanced review distribution and manageable context switching.",
    },
    MODERATE: {
      label: "Moderate Strain",
      text: "text-warning",
      bg: "bg-warning/15",
      border: "border-warning/30",
      desc: "Noticeable multi-repo context switching or localized review load.",
    },
    BURNOUT_RISK: {
      label: "Burnout Risk Alert",
      text: "text-danger",
      bg: "bg-danger/15",
      border: "border-danger/30",
      desc: "Significant developer overload, fragmented focus, and review bottlenecks.",
    },
  };

  const health = healthConfig[teamHealth] ?? healthConfig.HEALTHY;

  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      {/* Team Health Banner */}
      <Card className="border border-border p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${health.bg} ${health.text} ${health.border}`}
              >
                <span className="h-2 w-2 rounded-full bg-current" />
                {data.overallTeamHealth?.replace("_", " ")}
              </span>
              <span className="text-xs text-subtle font-mono">
                {data.windowDays}-day assessment
              </span>
            </div>
            <p className="mt-1 text-sm font-semibold text-ink">{health.label}</p>
            <p className="text-xs text-muted">{health.desc}</p>
          </div>

          {/* DevEx Score & Sub-KPIs */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-6">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-subtle">Overall DevEx Flow</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-mono text-3xl font-bold text-ink">
                  {data.overallDevExScore ?? 0}
                </span>
                <span className="text-xs text-subtle">/ 100</span>
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-subtle">Avg Context Switching</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-mono text-xl font-bold text-ink">
                  {data.averageContextSwitchingIndex?.toFixed(1) ?? "0.0"}
                </span>
                <span className="text-xs text-subtle">/ 10.0 CSI</span>
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-subtle">Team Review Burden</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-mono text-xl font-bold text-ink">
                  {data.teamReviewBurdenRatio?.toFixed(2) ?? "1.00"}x
                </span>
                <span className="text-[10px] text-subtle">rev/author</span>
              </div>
            </div>

            {/* Distribution */}
            <div className="flex items-center gap-2">
              <span className="rounded bg-success/15 px-2 py-1 text-[11px] font-semibold text-success border border-success/30">
                {data.optimalCount ?? 0} Optimal
              </span>
              <span className="rounded bg-danger/15 px-2 py-1 text-[11px] font-semibold text-danger border border-danger/30">
                {data.overloadedCount ?? 0} Overloaded
              </span>
              <span className="rounded bg-surface-raised px-2 py-1 text-[11px] font-semibold text-subtle border border-border">
                {data.underutilizedCount ?? 0} Underutilized
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Developer Workload Table */}
      <Card className="p-0 overflow-hidden border border-border">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4 bg-surface-raised/40">
          <div>
            <CardTitle>Developer Workload & Cognitive Load Index</CardTitle>
            <p className="mt-0.5 text-xs text-subtle">
              Workload balance, active WIP, multi-repo context switching and review burden per member
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-48">
              <Input
                type="text"
                placeholder="Search member..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as WorkloadStatus | "ALL")}
              className="rounded-[7px] border border-border bg-surface px-3 py-[7px] text-xs text-ink focus:outline-none focus:border-accent"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPTIMAL">Optimal</option>
              <option value="OVERLOADED">Overloaded</option>
              <option value="UNDERUTILIZED">Underutilized</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-ink border-collapse">
            <thead className="bg-surface-raised/60 text-subtle font-semibold border-b border-border">
              <tr>
                <th className="py-3 px-4">Developer</th>
                <th className="py-3 px-4">Workload Status</th>
                <th className="py-3 px-4">DevEx Score</th>
                <th className="py-3 px-4">Active PRs (Load %)</th>
                <th className="py-3 px-4">
                  <span
                    className="cursor-help underline decoration-dotted"
                    title="Measures cognitive load across multi-repo switching and concurrent WIP"
                  >
                    Context Switching (CSI) ⓘ
                  </span>
                </th>
                <th className="py-3 px-4">Review Burden</th>
                <th className="py-3 px-4">Repos / Cycle Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted">
                    No team members matched the current filters.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((entry) => {
                  const csi = Math.min(10, Math.max(0, entry.contextSwitchingIndex ?? 0));
                  const csiPct = (csi / 10) * 100;
                  const csiColor =
                    csi <= 3.5 ? "bg-success" : csi <= 7.0 ? "bg-warning" : "bg-danger";

                  return (
                    <tr key={entry.userId} className="hover:bg-surface-raised/30 transition-colors">
                      {/* Name */}
                      <td className="py-3 px-4 font-semibold text-ink">
                        <div>
                          <span>{entry.name}</span>
                          <span className="block font-mono text-[10px] text-subtle">
                            ID: {entry.userId}
                          </span>
                        </div>
                      </td>

                      {/* Status Pills */}
                      <td className="py-3 px-4">
                        {entry.workloadStatus === "OPTIMAL" && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/15 px-2.5 py-0.5 text-[11px] font-semibold text-success">
                            ● OPTIMAL
                          </span>
                        )}
                        {entry.workloadStatus === "OVERLOADED" && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-danger/30 bg-danger/15 px-2.5 py-0.5 text-[11px] font-semibold text-danger">
                            ▲ OVERLOADED
                          </span>
                        )}
                        {entry.workloadStatus === "UNDERUTILIZED" && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-raised px-2.5 py-0.5 text-[11px] font-semibold text-subtle">
                            ○ UNDERUTILIZED
                          </span>
                        )}
                      </td>

                      {/* DevEx Score */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-ink">
                            {entry.devexScore ?? 0}
                          </span>
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-border">
                            <div
                              className="h-full bg-accent rounded-full"
                              style={{ width: `${Math.min(100, entry.devexScore ?? 0)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Active PRs & Load % */}
                      <td className="py-3 px-4 font-mono">
                        <span className="font-bold text-ink">{entry.activePrs}</span>
                        <span className="text-subtle ml-1">({entry.loadPct}%)</span>
                      </td>

                      {/* Context Switching Gauge */}
                      <td className="py-3 px-4">
                        <div
                          className="flex flex-col gap-1 min-w-[130px]"
                          title="Measures cognitive load across multi-repo switching and concurrent WIP"
                        >
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-ink font-semibold">{csi.toFixed(1)}</span>
                            <span className="text-subtle">/ 10.0</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                            <div
                              className={`h-full transition-all duration-300 rounded-full ${csiColor}`}
                              style={{ width: `${csiPct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Review Burden */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col font-mono text-[11px]">
                          <span className="font-bold text-ink">
                            {entry.reviewBurdenRatio?.toFixed(2) ?? "1.00"}x ratio
                          </span>
                          <span className="text-[10px] text-subtle">
                            {entry.completedReviews} reviews completed
                          </span>
                        </div>
                      </td>

                      {/* Repos / Cycle Time */}
                      <td className="py-3 px-4 text-subtle">
                        <div className="flex flex-col text-[11px]">
                          <span className="text-ink">
                            {entry.activeRepositories} repo{entry.activeRepositories === 1 ? "" : "s"}
                          </span>
                          <span className="font-mono text-[10px] text-muted">
                            Cycle: {formatHours(entry.cycleTimeHours)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default DevExWorkloadView;
