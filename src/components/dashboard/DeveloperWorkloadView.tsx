"use client";

import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useAuth } from "@/hooks/useAuth";
import { useJiraIssues } from "@/hooks/useJira";
import { useWorkload } from "@/hooks/useDora";
import type { JiraIssue } from "@/services/api/integrations";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { FeatureUnavailable } from "@/components/ui/FeatureUnavailable";
import { formatDateTime } from "@/utils/formatDate";

export interface DeveloperWorkloadViewProps {
  className?: string;
  showAllOption?: boolean;
}

export function DeveloperWorkloadView({
  className = "",
  showAllOption = true,
}: DeveloperWorkloadViewProps) {
  const { user } = useAuth();
  const activeProject = useSelector((state: RootState) => state.dashboard.activeProject);
  const projectId = activeProject ? Number(activeProject.id) : undefined;

  const jiraQuery = useJiraIssues();
  const workloadQuery = useWorkload(projectId, 30);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [scope, setScope] = useState<"ASSIGNED" | "ALL">("ASSIGNED");

  // Filter tasks assigned to the current user
  const issues = useMemo(() => {
    return jiraQuery.data || [];
  }, [jiraQuery.data]);

  const assignedToMe = useMemo(() => {
    if (!user) return [];
    return issues.filter((issue: JiraIssue) => {
      if (issue.assigneeId === null || issue.assigneeId === undefined) {
        return false;
      }
      return Number(issue.assigneeId) === Number(user.userId);
    });
  }, [issues, user]);

  // Which pool of issues to display
  const baseIssues = scope === "ASSIGNED" ? assignedToMe : issues;

  // Filtered issues based on user inputs
  const filteredIssues = useMemo(() => {
    return baseIssues.filter((issue) => {
      const matchesSearch =
        (issue.jiraKey || "").toLowerCase().includes(search.toLowerCase()) ||
        (issue.summary || "").toLowerCase().includes(search.toLowerCase());

      const normStatus = (issue.status || "").toUpperCase();
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "IN_PROGRESS" && normStatus.includes("PROGRESS")) ||
        (statusFilter === "DONE" && (normStatus.includes("DONE") || normStatus.includes("CLOSED") || normStatus.includes("RESOLVED"))) ||
        (statusFilter === "TODO" && (normStatus.includes("TO DO") || normStatus.includes("TODO") || normStatus.includes("OPEN")));

      const normPriority = (issue.priority || "").toUpperCase();
      const matchesPriority =
        priorityFilter === "ALL" ||
        (priorityFilter === "HIGH" && (normPriority.includes("HIGH") || normPriority.includes("CRITICAL"))) ||
        (priorityFilter === "MEDIUM" && normPriority.includes("MED")) ||
        (priorityFilter === "LOW" && normPriority.includes("LOW"));

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [baseIssues, search, statusFilter, priorityFilter]);

  // Personal metrics from assigned issues
  const metrics = useMemo(() => {
    const total = assignedToMe.length;
    let inProgress = 0;
    let completed = 0;
    let totalStoryPoints = 0;

    for (const issue of assignedToMe) {
      const s = (issue.status || "").toUpperCase();
      if (s.includes("PROGRESS")) inProgress += 1;
      else if (s.includes("DONE") || s.includes("CLOSED") || s.includes("RESOLVED")) completed += 1;

      if (issue.storyPoints) {
        totalStoryPoints += Number(issue.storyPoints);
      }
    }

    return { total, inProgress, completed, totalStoryPoints };
  }, [assignedToMe]);

  // Developer capacity from metrics-service if available
  const developerWorkloadEntry = useMemo(() => {
    if (!workloadQuery.data || !user) return null;
    return (
      workloadQuery.data.find(
        (entry) =>
          entry.userId === String(user.userId) ||
          (user.fullName && entry.name.toLowerCase() === user.fullName.toLowerCase())
      ) || null
    );
  }, [workloadQuery.data, user]);

  if (jiraQuery.isPending) {
    return (
      <Card className={`flex min-h-[260px] items-center justify-center ${className}`}>
        <Spinner />
      </Card>
    );
  }

  if (jiraQuery.isError) {
    return (
      <FeatureUnavailable
        title="Unable to load Jira tasks"
        message={
          jiraQuery.error instanceof Error
            ? jiraQuery.error.message
            : "Failed to communicate with Jira integration service."
        }
      />
    );
  }

  const renderStatusBadge = (status: string) => {
    const s = (status || "").toUpperCase();
    if (s.includes("PROGRESS")) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning/15 px-2.5 py-0.5 text-[11px] font-semibold text-warning">
          <span className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse" />
          {status}
        </span>
      );
    }
    if (s.includes("DONE") || s.includes("CLOSED") || s.includes("RESOLVED")) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/15 px-2.5 py-0.5 text-[11px] font-semibold text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          {status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-raised px-2.5 py-0.5 text-[11px] font-medium text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-subtle" />
        {status || "To Do"}
      </span>
    );
  };

  const renderPriorityBadge = (priority?: string) => {
    const p = (priority || "").toUpperCase();
    if (p.includes("HIGH") || p.includes("CRITICAL")) {
      return (
        <span className="inline-flex items-center rounded border border-danger/30 bg-danger/10 px-2 py-0.5 text-[10px] font-bold uppercase text-danger">
          ▲ {priority}
        </span>
      );
    }
    if (p.includes("MED")) {
      return (
        <span className="inline-flex items-center rounded border border-warning/30 bg-warning/10 px-2 py-0.5 text-[10px] font-bold uppercase text-warning">
          ■ {priority}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded border border-border bg-surface-raised px-2 py-0.5 text-[10px] font-medium text-subtle">
        ▼ {priority || "Low"}
      </span>
    );
  };

  const renderTypeBadge = (issueType?: string) => {
    const t = (issueType || "").toUpperCase();
    let color = "text-accent bg-accent/10 border-accent/20";
    if (t.includes("BUG")) {
      color = "text-danger bg-danger/10 border-danger/20";
    } else if (t.includes("STORY")) {
      color = "text-success bg-success/10 border-success/20";
    }
    return (
      <span className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold tracking-wide ${color}`}>
        {issueType || "Task"}
      </span>
    );
  };

  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      {/* Workload Summary KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
        <Card className="flex flex-col gap-1 p-4 border-l-4 border-l-accent">
          <span className="text-[11px] font-medium uppercase tracking-wider text-subtle">
            Assigned Jira Tasks
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-ink">{metrics.total}</span>
            <span className="text-xs text-subtle">issues</span>
          </div>
        </Card>

        <Card className="flex flex-col gap-1 p-4 border-l-4 border-l-warning">
          <span className="text-[11px] font-medium uppercase tracking-wider text-subtle">
            In Progress
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-warning">{metrics.inProgress}</span>
            <span className="text-xs text-subtle">active</span>
          </div>
        </Card>

        <Card className="flex flex-col gap-1 p-4 border-l-4 border-l-success">
          <span className="text-[11px] font-medium uppercase tracking-wider text-subtle">
            Completed Issues
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-success">{metrics.completed}</span>
            <span className="text-xs text-subtle">resolved</span>
          </div>
        </Card>

        <Card className="flex flex-col gap-1 p-4 border-l-4 border-l-border">
          <span className="text-[11px] font-medium uppercase tracking-wider text-subtle">
            Story Points Committed
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-ink">{metrics.totalStoryPoints}</span>
            <span className="text-xs text-subtle">pts</span>
          </div>
          {developerWorkloadEntry && (
            <span className="text-[10px] text-muted">
              Capacity Load: {developerWorkloadEntry.loadPct}% ({developerWorkloadEntry.activePrs} PRs)
            </span>
          )}
        </Card>
      </div>

      {/* Main Workload & Tasks Table Card */}
      <Card padding={false} className="overflow-hidden border border-border">
        {/* Card Header & Controls */}
        <div className="border-b border-border p-4 bg-surface-raised/30">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Developer workload</CardTitle>
              <p className="mt-0.5 text-xs text-subtle">
                Tasks assigned to you fetched from connected Jira workspace
              </p>
            </div>

            {/* Scope Toggle (Assigned vs All) */}
            {showAllOption && (
              <div className="flex items-center rounded-lg border border-border bg-surface p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setScope("ASSIGNED")}
                  className={`rounded px-3 py-1 text-xs font-semibold transition-colors ${
                    scope === "ASSIGNED"
                      ? "bg-accent text-black shadow-sm"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  Assigned to me ({assignedToMe.length})
                </button>
                <button
                  type="button"
                  onClick={() => setScope("ALL")}
                  className={`rounded px-3 py-1 text-xs font-semibold transition-colors ${
                    scope === "ALL"
                      ? "bg-accent text-black shadow-sm"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  All project tasks ({issues.length})
                </button>
              </div>
            )}
          </div>

          {/* Filters Bar */}
          <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-border/50">
            <div className="min-w-[200px] flex-1">
              <Input
                type="text"
                placeholder="Search key or summary..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 rounded-[7px] border border-border bg-surface px-2.5 text-xs text-ink focus:border-accent focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="TODO">To Do</option>
              <option value="DONE">Done / Closed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="h-8 rounded-[7px] border border-border bg-surface px-2.5 text-xs text-ink focus:border-accent focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High / Critical</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs text-ink">
            <thead className="border-b border-border bg-surface-raised/50 font-semibold text-subtle">
              <tr>
                <th className="py-3 px-4">Task Key</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Summary</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Points</th>
                <th className="py-3 px-4 text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-muted">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-2xl">📋</span>
                      <p className="font-semibold text-ink">No Jira tasks found</p>
                      <p className="text-xs text-subtle max-w-sm">
                        {scope === "ASSIGNED"
                          ? assignedToMe.length === 0
                            ? "You do not have any tasks currently assigned to you in Jira."
                            : "No assigned tasks matched your search or filters."
                          : "No Jira issues match the selected criteria."}
                      </p>
                      {scope === "ASSIGNED" && issues.length > 0 && assignedToMe.length === 0 && (
                        <button
                          type="button"
                          onClick={() => setScope("ALL")}
                          className="mt-2 text-xs font-semibold text-accent hover:underline"
                        >
                          View all {issues.length} project tasks →
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredIssues.map((issue) => (
                  <tr
                    key={issue.issueId || issue.jiraKey}
                    className="hover:bg-surface-raised/30 transition-colors"
                  >
                    {/* Key */}
                    <td className="py-3 px-4 font-mono font-bold text-accent whitespace-nowrap">
                      <span className="rounded bg-accent/10 px-2 py-1 border border-accent/20">
                        {issue.jiraKey}
                      </span>
                    </td>

                    {/* Type */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {renderTypeBadge(issue.issueType)}
                    </td>

                    {/* Summary */}
                    <td className="py-3 px-4 max-w-md">
                      <p className="font-medium text-ink truncate" title={issue.summary}>
                        {issue.summary}
                      </p>
                      {issue.assigneeId ? (
                        <span className="text-[10px] text-subtle font-mono">
                          Assignee ID: {issue.assigneeId}
                          {user && Number(issue.assigneeId) === Number(user.userId) ? " (You)" : ""}
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted italic">Unassigned</span>
                      )}
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {renderPriorityBadge(issue.priority)}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {renderStatusBadge(issue.status)}
                    </td>

                    {/* Story Points */}
                    <td className="py-3 px-4 text-center font-mono font-semibold">
                      {issue.storyPoints !== null && issue.storyPoints !== undefined ? (
                        <span className="rounded bg-surface-raised px-2 py-0.5 text-xs text-ink border border-border">
                          {issue.storyPoints}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className="py-3 px-4 text-right text-subtle font-mono text-[11px] whitespace-nowrap">
                      {issue.createdAt ? formatDateTime(issue.createdAt) : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default DeveloperWorkloadView;
