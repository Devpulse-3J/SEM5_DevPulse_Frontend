"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { GithubConnectionStatus, LinkedRepo } from "@/types/adminProject";

export interface GithubConnectionSectionProps {
  repo: LinkedRepo | undefined;
  onReconnect: () => void;
  onSync: () => void;
  onCycleStatus: () => void;
}

const STATUS_BADGE: Record<
  GithubConnectionStatus,
  { variant: "success" | "warning" | "danger"; label: string }
> = {
  CONNECTED: { variant: "success", label: "Connected" },
  SYNCING: { variant: "warning", label: "Syncing" },
  DISCONNECTED: { variant: "danger", label: "Disconnected" },
};

function formatTimestamp(iso?: string): string {
  if (!iso) return "Never";
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function GithubConnectionSection({
  repo,
  onReconnect,
  onSync,
  onCycleStatus,
}: GithubConnectionSectionProps) {
  const [secretRevealed, setSecretRevealed] = useState(false);

  if (!repo) {
    return (
      <section className="flex flex-col gap-3 rounded-panel border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold text-ink">GitHub connection</h2>
        <div className="rounded-lg border border-dashed border-border p-6 text-center">
          <p className="text-sm text-ink">No repository linked</p>
          <p className="mx-auto mt-1.5 max-w-md text-xs text-muted">
            This project has no GitHub repository. Linking one after creation
            needs <code>POST /api/projects/{"{id}"}/github/link</code>, which
            does not exist yet.
          </p>
        </div>
      </section>
    );
  }

  const badge = STATUS_BADGE[repo.status];
  const isSyncing = repo.status === "SYNCING";

  return (
    <section className="flex flex-col gap-4 rounded-panel border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-ink">GitHub connection</h2>
          <p className="mt-0.5 text-[11px] text-subtle">
            The repository this project draws pull requests and commits from
          </p>
        </div>
        <Badge variant={badge.variant}>{badge.label}</Badge>
      </div>

      <dl className="flex flex-col gap-2.5 text-xs">
        <div className="flex items-baseline gap-3">
          <dt className="w-32 flex-shrink-0 text-subtle">Repository</dt>
          <dd className="min-w-0 font-mono text-[11px] break-all text-ink">
            {repo.url}
          </dd>
        </div>
        <div className="flex items-baseline gap-3">
          <dt className="w-32 flex-shrink-0 text-subtle">Owner / name</dt>
          <dd className="font-mono text-[11px] text-muted">
            {repo.owner} / {repo.name}
          </dd>
        </div>
        <div className="flex items-baseline gap-3">
          <dt className="w-32 flex-shrink-0 text-subtle">Last synced</dt>
          <dd className="font-mono text-[11px] text-muted">
            {formatTimestamp(repo.lastSyncedAt)}
          </dd>
        </div>
        <div className="flex items-baseline gap-3">
          <dt className="w-32 flex-shrink-0 text-subtle">Webhook secret</dt>
          <dd className="flex min-w-0 items-baseline gap-2">
            {repo.webhookSecret ? (
              <>
                <span className="font-mono text-[11px] break-all text-muted">
                  {secretRevealed
                    ? repo.webhookSecret
                    : "•".repeat(repo.webhookSecret.length)}
                </span>
                <button
                  type="button"
                  onClick={() => setSecretRevealed((prev) => !prev)}
                  className="flex-shrink-0 cursor-pointer border-none bg-transparent text-[11px] font-medium text-accent hover:underline"
                >
                  {secretRevealed ? "Hide" : "Reveal"}
                </button>
              </>
            ) : (
              <span className="text-[11px] text-subtle">
                Not set — falls back to the server-wide secret
              </span>
            )}
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap items-center gap-2.5 border-t border-border/60 pt-3.5">
        <Button
          variant="secondary"
          size="sm"
          onClick={onReconnect}
          disabled={isSyncing}
        >
          Reconnect
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onSync}
          loading={isSyncing}
          disabled={isSyncing || repo.status === "DISCONNECTED"}
        >
          {isSyncing ? "Syncing…" : "Trigger sync"}
        </Button>
        <Button variant="ghost" size="sm" onClick={onCycleStatus}>
          Cycle status (demo)
        </Button>
      </div>

      <p className="text-[11px] text-subtle">
        All three buttons are placeholders — nothing contacts GitHub. Status is
        local state only.
      </p>
    </section>
  );
}

export default GithubConnectionSection;
