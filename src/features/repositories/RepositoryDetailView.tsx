"use client";

import React from "react";
import type { Repository } from "@/types/repository";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface RepositoryDetailViewProps {
  repository: Repository;
  onSync?: (id: string) => void;
}

export function RepositoryDetailView({ repository, onSync }: RepositoryDetailViewProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-surface border border-border rounded-panel">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold font-mono text-ink">{repository.fullName}</h1>
            <Badge variant="info">{repository.language}</Badge>
            <Badge variant="success">{repository.status}</Badge>
          </div>
          <p className="text-xs text-muted mt-1">{repository.description}</p>
        </div>

        <div className="flex items-center gap-3">
          {onSync && (
            <Button variant="secondary" size="sm" onClick={() => onSync(repository.id)}>
              🔄 Sync Repository
            </Button>
          )}
          <a
            href={repository.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-[7px] border border-border bg-surface px-3 py-[7px] text-xs font-semibold text-accent hover:underline"
          >
            View on GitHub ↗
          </a>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col gap-1">
          <span className="text-xs text-subtle">Health Score</span>
          <span className="text-2xl font-bold text-success">{repository.metrics.healthScore}/100</span>
        </Card>
        <Card className="p-4 flex flex-col gap-1">
          <span className="text-xs text-subtle">Code Coverage</span>
          <span className="text-2xl font-bold text-accent">
            {repository.metrics.codeCoverage ? `${repository.metrics.codeCoverage}%` : "N/A"}
          </span>
        </Card>
        <Card className="p-4 flex flex-col gap-1">
          <span className="text-xs text-subtle">Open Pull Requests</span>
          <span className="text-2xl font-bold text-ink">{repository.metrics.openPullRequests}</span>
        </Card>
        <Card className="p-4 flex flex-col gap-1">
          <span className="text-xs text-subtle">Open Issues</span>
          <span className="text-2xl font-bold text-warning">{repository.metrics.openIssues}</span>
        </Card>
      </div>

      {/* Branches and Commits split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Branches */}
        <Card className="p-5 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-ink">Active Branches</h3>
          {repository.branches && repository.branches.length > 0 ? (
            <div className="flex flex-col gap-2">
              {repository.branches.map((b) => (
                <div
                  key={b.name}
                  className="flex items-center justify-between p-3 bg-surface-raised/40 rounded-card text-xs border border-border/40"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-ink">{b.name}</span>
                    {b.isDefault && <Badge variant="default">default</Badge>}
                  </div>
                  <span className="font-mono text-subtle">{b.lastCommitHash}</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-xs text-subtle">No branch detail loaded.</span>
          )}
        </Card>

        {/* Recent Commits */}
        <Card className="p-5 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-ink">Recent Activity</h3>
          {repository.recentCommits && repository.recentCommits.length > 0 ? (
            <div className="flex flex-col gap-3">
              {repository.recentCommits.map((c) => (
                <div key={c.hash} className="flex flex-col gap-1 border-b border-border/40 pb-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-accent">{c.hash}</span>
                    <span className="text-subtle">{new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-ink font-medium">{c.message}</p>
                  <span className="text-[11px] text-muted">by {c.author}</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-xs text-subtle">No recent commits logged.</span>
          )}
        </Card>
      </div>
    </div>
  );
}

export default RepositoryDetailView;
