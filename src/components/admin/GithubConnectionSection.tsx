"use client";

import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAdminProjects } from "@/components/admin/AdminProjectsProvider";
import type { GithubConnectionStatus, LinkedRepo } from "@/types/adminProject";

export interface GithubConnectionSectionProps {
  projectId: string;
  repo: LinkedRepo | undefined;
  onReconnect?: () => void;
  onSync?: () => void;
  onCycleStatus?: () => void;
}

const STATUS_BADGE: Record<
  GithubConnectionStatus,
  { variant: "success" | "warning" | "danger"; label: string }
> = {
  CONNECTED: { variant: "success", label: "Connected" },
  SYNCING: { variant: "warning", label: "Syncing" },
  DISCONNECTED: { variant: "danger", label: "Disconnected" },
  ERROR: { variant: "danger", label: "Sync error" },
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
  projectId,
  repo,
  onSync,
  onCycleStatus,
}: GithubConnectionSectionProps) {
  const { getConnectUrl, linkRepoUrl } = useAdminProjects();
  const [loadingAppUrl, setLoadingAppUrl] = useState(false);
  const [linkingUrl, setLinkingUrl] = useState(false);
  const [repoUrlInput, setRepoUrlInput] = useState("");
  const [showDirectInput, setShowDirectInput] = useState(false);

  const handleConnectApp = async () => {
    setLoadingAppUrl(true);
    try {
      const url = await getConnectUrl(projectId);
      if (url) {
        window.location.href = url;
      }
    } catch (err: unknown) {
      console.error("Failed to get GitHub App URL", err);
    } finally {
      setLoadingAppUrl(false);
    }
  };

  const handleLinkRepoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrlInput.trim()) return;
    setLinkingUrl(true);
    try {
      await linkRepoUrl(projectId, repoUrlInput.trim());
      setRepoUrlInput("");
      setShowDirectInput(false);
    } catch (err: unknown) {
      console.error("Failed to link repository", err);
    } finally {
      setLinkingUrl(false);
    }
  };

  const badge = repo ? STATUS_BADGE[repo.status] : null;
  const isSyncing = repo?.status === "SYNCING";

  return (
    <section className="flex flex-col gap-4 rounded-panel border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-ink flex items-center gap-2">
            <FaGithub className="h-4 w-4 text-purple-400" />
            GitHub Connection
          </h2>
          <p className="mt-0.5 text-[11px] text-subtle">
            Connect the GitHub repository to sync pull requests, commits, and metrics.
          </p>
        </div>
        {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
      </div>

      {repo ? (
        <div className="flex flex-col gap-4">
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
          </dl>

          <div className="flex flex-wrap items-center gap-2.5 border-t border-border/60 pt-3.5">
            {onSync && (
              <Button
                variant="primary"
                size="sm"
                onClick={onSync}
                loading={isSyncing}
                disabled={isSyncing || repo.status === "DISCONNECTED"}
              >
                {isSyncing ? "Syncing…" : "Trigger sync"}
              </Button>
            )}
            <button
              type="button"
              onClick={handleConnectApp}
              disabled={loadingAppUrl || isSyncing}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-surface-hover hover:border-accent/40 disabled:opacity-50 cursor-pointer"
            >
              <FaGithub className="h-3.5 w-3.5" />
              {loadingAppUrl ? "Redirecting..." : "Install GitHub App"}
            </button>
            <button
              type="button"
              onClick={() => setShowDirectInput(!showDirectInput)}
              className="text-xs font-medium text-accent hover:underline cursor-pointer"
            >
              {showDirectInput ? "Cancel change" : "Change repository URL"}
            </button>
            {onCycleStatus && (
              <Button variant="ghost" size="sm" onClick={onCycleStatus}>
                Check status
              </Button>
            )}
          </div>

          {showDirectInput && (
            <form onSubmit={handleLinkRepoSubmit} className="flex gap-2 border-t border-border/60 pt-3">
              <input
                type="url"
                required
                placeholder="https://github.com/owner/repository"
                value={repoUrlInput}
                onChange={(e) => setRepoUrlInput(e.target.value)}
                className="flex-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-ink outline-none transition placeholder:text-subtle focus:border-accent focus:ring-1 focus:ring-accent/40"
              />
              <Button type="submit" variant="secondary" size="sm" loading={linkingUrl}>
                Update Repo
              </Button>
            </form>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4 rounded-xl border border-border/80 bg-surface/50 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium text-ink flex items-center gap-2">
                <FaGithub className="h-4 w-4 text-purple-400" /> Connect GitHub Repository
              </h3>
              <p className="mt-1 text-xs text-muted max-w-lg">
                Install the DevPulse GitHub App to automatically sync pull requests, commits, and metrics.
              </p>
            </div>
            <button
              type="button"
              onClick={handleConnectApp}
              disabled={loadingAppUrl}
              className="flex-shrink-0 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium px-4 py-2 rounded-lg transition disabled:opacity-50 cursor-pointer"
            >
              <FaGithub className="h-4 w-4" />
              {loadingAppUrl ? "Redirecting..." : "Install GitHub App"}
            </button>
          </div>

          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-3 text-[10px] text-subtle uppercase font-semibold">
              Or link by repository URL
            </span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <form onSubmit={handleLinkRepoSubmit} className="flex gap-2">
            <input
              type="url"
              required
              placeholder="https://github.com/owner/repository"
              value={repoUrlInput}
              onChange={(e) => setRepoUrlInput(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink outline-none transition placeholder:text-subtle focus:border-accent focus:ring-1 focus:ring-accent/40"
            />
            <Button type="submit" variant="secondary" size="sm" loading={linkingUrl}>
              {linkingUrl ? "Linking..." : "Link Repo"}
            </Button>
          </form>
        </div>
      )}
    </section>
  );
}

export default GithubConnectionSection;
