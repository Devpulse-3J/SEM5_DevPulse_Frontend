"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useMyPullRequests } from "@/hooks/usePullRequests";
import { useAlerts } from "@/hooks/useAlerts";
import { useRepositories } from "@/hooks/useRepositories";
import { GitHubIntegration } from "@/features/integrations/GitHubIntegration";
import { JiraIntegration } from "@/features/integrations/JiraIntegration";

export function DeveloperDashboard() {
  const { data: pullRequests = [] } = useMyPullRequests();
  const { data: alerts = [] } = useAlerts();
  const { data: repositories = [] } = useRepositories();

  const openPrs = pullRequests.filter((pr) => pr.status === "open");
  const activeAlerts = alerts.filter((a) => !a.isAcknowledged);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Quick Personal Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col gap-1 border-l-4 border-l-accent">
          <span className="text-xs text-subtle font-medium">My Active PRs</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-ink">{openPrs.length}</span>
            <span className="text-xs text-muted">of {pullRequests.length} total</span>
          </div>
        </Card>

        <Card className="p-4 flex flex-col gap-1 border-l-4 border-l-warning">
          <span className="text-xs text-subtle font-medium">Active Alerts</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-warning">{activeAlerts.length}</span>
            <span className="text-xs text-muted">unacknowledged</span>
          </div>
        </Card>

        <Card className="p-4 flex flex-col gap-1 border-l-4 border-l-success">
          <span className="text-xs text-subtle font-medium">Tracked Repositories</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-ink">{repositories.length}</span>
            <span className="text-xs text-success">100% healthy</span>
          </div>
        </Card>

        <Card className="p-4 flex flex-col gap-1 border-l-4 border-l-accent">
          <span className="text-xs text-subtle font-medium">Reviews Pending</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-ink">1</span>
            <span className="text-xs text-muted">1 approval needed</span>
          </div>
        </Card>
      </div>

      {/* 2. My Active Pull Requests Widget & Active Alerts Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active PRs Widget */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card className="p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div>
                <h3 className="text-sm font-bold text-ink">My Open Pull Requests</h3>
                <p className="text-xs text-subtle mt-0.5">
                  Assigned code reviews and open feature branches
                </p>
              </div>
              <Link
                href="/my-prs"
                className="text-xs font-semibold text-accent hover:underline"
              >
                View all ({pullRequests.length}) →
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {openPrs.length === 0 ? (
                <span className="text-xs text-subtle p-4 text-center">
                  No open pull requests assigned to you.
                </span>
              ) : (
                openPrs.map((pr) => (
                  <div
                    key={pr.id}
                    className="flex items-center justify-between p-3 rounded-card bg-surface-raised/40 border border-border/40 text-xs"
                  >
                    <div className="flex flex-col gap-0.5 max-w-[70%]">
                      <a
                        href={pr.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-ink hover:text-accent truncate font-sans"
                      >
                        #{pr.number} {pr.title}
                      </a>
                      <span className="text-[11px] text-subtle font-mono">
                        {pr.repositoryName} • {pr.headBranch}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          pr.riskAnalysis.riskLevel === "HIGH" ||
                          pr.riskAnalysis.riskLevel === "CRITICAL"
                            ? "danger"
                            : pr.riskAnalysis.riskLevel === "MEDIUM"
                            ? "warning"
                            : "success"
                        }
                      >
                        Risk {pr.riskAnalysis.riskScore}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Quick Repositories list preview */}
          <Card className="p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div>
                <h3 className="text-sm font-bold text-ink">Recent Repositories</h3>
                <p className="text-xs text-subtle mt-0.5">Active codebase connections</p>
              </div>
              <Link href="/repositories" className="text-xs font-semibold text-accent hover:underline">
                View repositories →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {repositories.slice(0, 2).map((repo) => (
                <div
                  key={repo.id}
                  className="p-3 rounded-card bg-surface-raised/30 border border-border/40 text-xs flex flex-col gap-1"
                >
                  <Link
                    href={`/repositories/${repo.id}`}
                    className="font-bold font-mono text-ink hover:text-accent"
                  >
                    {repo.fullName}
                  </Link>
                  <div className="flex items-center justify-between text-[11px] text-subtle">
                    <span>{repo.language}</span>
                    <span>Health: {repo.metrics.healthScore}/100</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Alerts & Integrations Widget Column */}
        <div className="flex flex-col gap-6">
          {/* Active Alerts Widget */}
          <Card className="p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <h3 className="text-sm font-bold text-ink">Recent Alerts</h3>
              <Link href="/alerts" className="text-xs font-semibold text-accent hover:underline">
                Alerts Center →
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {activeAlerts.length === 0 ? (
                <span className="text-xs text-subtle p-2 text-center">
                  No unacknowledged alerts.
                </span>
              ) : (
                activeAlerts.slice(0, 2).map((alt) => (
                  <div
                    key={alt.id}
                    className="p-3 rounded-card bg-surface-raised/40 border border-border/40 text-xs flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          alt.severity === "CRITICAL" || alt.severity === "HIGH"
                            ? "danger"
                            : "warning"
                        }
                      >
                        {alt.severity}
                      </Badge>
                      <span className="text-[10px] text-subtle">
                        {new Date(alt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <span className="font-bold text-ink mt-1">{alt.title}</span>
                    <p className="text-[11px] text-muted line-clamp-2">{alt.message}</p>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Connected Integrations Quick Widgets */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-subtle uppercase tracking-wider">Integrations</h4>
            <GitHubIntegration />
            <JiraIntegration />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeveloperDashboard;
