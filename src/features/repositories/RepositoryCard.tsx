"use client";

import React from "react";
import Link from "next/link";
import type { Repository } from "@/types/repository";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

interface RepositoryCardProps {
  repository: Repository;
  onSync?: (id: string) => void;
}

export function RepositoryCard({ repository, onSync }: RepositoryCardProps) {
  return (
    <Card className="flex flex-col justify-between gap-4 p-5 hover:border-accent/40 transition-colors">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-subtle">
              {repository.isPrivate ? "🔒 Private" : "🌐 Public"}
            </span>
            <Badge variant="info">{repository.language}</Badge>
          </div>
          <Badge
            variant={
              repository.status === "active"
                ? "success"
                : repository.status === "syncing"
                ? "warning"
                : "default"
            }
          >
            {repository.status}
          </Badge>
        </div>

        <Link
          href={`/repositories/${repository.id}`}
          className="text-base font-bold text-ink hover:text-accent font-mono transition-colors"
        >
          {repository.fullName}
        </Link>
        <p className="text-xs text-muted line-clamp-2">{repository.description}</p>
      </div>

      <div className="flex flex-col gap-3 pt-3 border-t border-border/50">
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-surface-raised/40 p-2 rounded-card">
            <div className="text-subtle text-[10px]">Open PRs</div>
            <div className="font-bold text-ink">{repository.metrics.openPullRequests}</div>
          </div>
          <div className="bg-surface-raised/40 p-2 rounded-card">
            <div className="text-subtle text-[10px]">Coverage</div>
            <div className="font-bold text-ink">
              {repository.metrics.codeCoverage ? `${repository.metrics.codeCoverage}%` : "N/A"}
            </div>
          </div>
          <div className="bg-surface-raised/40 p-2 rounded-card">
            <div className="text-subtle text-[10px]">Health</div>
            <div className="font-bold text-success">{repository.metrics.healthScore}/100</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-subtle pt-1">
          <span>Synced {new Date(repository.metrics.lastSyncAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {onSync && (
            <button
              onClick={() => onSync(repository.id)}
              className="text-accent hover:underline text-xs"
            >
              Sync Now
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default RepositoryCard;
