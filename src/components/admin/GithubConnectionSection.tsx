"use client";

import { useEffect, useState, useCallback } from "react";
import { FaGithub, FaCheckCircle } from "react-icons/fa";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAdminProjects } from "@/components/admin/AdminProjectsProvider";
import { integrationsApiService, GithubAvailableReposResponse } from "@/services/api/integrations";
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
  const { getConnectUrl, linkRepoUrl, showToast } = useAdminProjects();
  const [loadingAppUrl, setLoadingAppUrl] = useState(false);
  const [linkingUrl, setLinkingUrl] = useState(false);
  const [showDirectInput, setShowDirectInput] = useState(false);
  const [manualRepoUrl, setManualRepoUrl] = useState("");

  // Available Repositories & Installation Status
  const [loadingAvailable, setLoadingAvailable] = useState(true);
  const [availableData, setAvailableData] = useState<GithubAvailableReposResponse | null>(null);
  const [selectedRepoUrl, setSelectedRepoUrl] = useState("");
  const [returnedFromGithub, setReturnedFromGithub] = useState(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return Boolean(
      params.get("installation_id") || params.get("setup_action") === "install" || params.get("code")
    );
  });

  // Check URL query params for returning from GitHub installation redirect
  useEffect(() => {
    if (returnedFromGithub) {
      showToast(
        "success",
        "GitHub App Installed",
        "App authorized! Select your repository below to complete linking."
      );
    }
  }, [returnedFromGithub, showToast]);

  const fetchAvailableRepos = useCallback(async () => {
    if (!projectId) return;
    setLoadingAvailable(true);
    try {
      const res = await integrationsApiService.getGithubAvailableRepos(projectId);
      setAvailableData(res);
      if (res.repositories && res.repositories.length > 0) {
        setSelectedRepoUrl(res.repositories[0].repoUrl);
      }
    } catch (err: unknown) {
      console.warn("Could not fetch available repos", err);
      setAvailableData({
        installed: false,
        connectUrl: `https://github.com/apps/devpulse-app/installations/new?state=${encodeURIComponent(projectId)}`,
        repositories: [],
      });
    } finally {
      setLoadingAvailable(false);
    }
  }, [projectId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchAvailableRepos();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchAvailableRepos]);

  const handleInstallApp = async () => {
    setLoadingAppUrl(true);
    try {
      const targetUrl = availableData?.connectUrl || (await getConnectUrl(projectId));
      if (targetUrl) {
        window.location.href = targetUrl;
      }
    } catch (err: unknown) {
      console.error("Failed to get GitHub App install URL", err);
    } finally {
      setLoadingAppUrl(false);
    }
  };

  const handleLinkRepoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const urlToLink = selectedRepoUrl || manualRepoUrl;
    if (!urlToLink.trim()) return;

    setLinkingUrl(true);
    try {
      await linkRepoUrl(projectId, urlToLink.trim());
      showToast("success", "GitHub Connected", "Repository linked successfully.");
      setManualRepoUrl("");
      setShowDirectInput(false);
      setReturnedFromGithub(false);
      if (onCycleStatus) {
        onCycleStatus();
      }
    } catch (err: unknown) {
      console.error("Failed to link repository", err);
      const msg = err instanceof Error ? err.message : "Failed to link repository.";
      showToast("error", "Link Failed", msg);
    } finally {
      setLinkingUrl(false);
    }
  };

  const badge = repo ? STATUS_BADGE[repo.status] : null;
  const isSyncing = repo?.status === "SYNCING";

  // App is considered installed if returned from GitHub, endpoint returned installed, or repos list exists
  const isAppInstalled = Boolean(
    returnedFromGithub ||
      availableData?.installed ||
      (availableData?.repositories && availableData.repositories.length > 0)
  );

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

      {repo && !showDirectInput ? (
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
              onClick={handleInstallApp}
              disabled={loadingAppUrl || isSyncing}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-surface-hover hover:border-accent/40 disabled:opacity-50 cursor-pointer"
            >
              <FaGithub className="h-3.5 w-3.5" />
              {loadingAppUrl ? "Redirecting..." : "Reinstall GitHub App"}
            </button>
            <button
              type="button"
              onClick={() => setShowDirectInput(true)}
              className="text-xs font-medium text-accent hover:underline cursor-pointer"
            >
              Change repository
            </button>
            {onCycleStatus && (
              <Button variant="ghost" size="sm" onClick={onCycleStatus}>
                Check status
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 rounded-xl border border-border/80 bg-surface/50 p-5">
          {showDirectInput && repo && (
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-subtle font-medium">Changing repository for current project</span>
              <button
                type="button"
                onClick={() => setShowDirectInput(false)}
                className="text-xs text-subtle hover:text-ink cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}

          {returnedFromGithub && (
            <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-xs text-success font-medium">
              <FaCheckCircle className="h-4 w-4 flex-shrink-0 text-success" />
              <span>GitHub App authorized successfully! Choose your repository below and click <strong>Link Repository</strong> to complete setup.</span>
            </div>
          )}

          {loadingAvailable ? (
            <div className="flex items-center gap-3 py-4 text-xs text-subtle animate-pulse">
              <FaGithub className="h-4 w-4 text-purple-400 animate-spin" />
              <span>Checking GitHub App installation &amp; fetching repositories…</span>
            </div>
          ) : !isAppInstalled ? (
            /* Conditional Rendering: App Not Installed */
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-medium text-ink flex items-center gap-2">
                  <FaGithub className="h-4 w-4 text-purple-400" /> Install GitHub App
                </h3>
                <p className="mt-1 text-xs text-muted max-w-lg">
                  Install the DevPulse GitHub App to grant access to your repositories and automatically sync pull requests, commits, and metrics.
                </p>
              </div>
              <button
                type="button"
                onClick={handleInstallApp}
                disabled={loadingAppUrl}
                className="flex-shrink-0 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50 cursor-pointer"
              >
                <FaGithub className="h-4 w-4" />
                {loadingAppUrl ? "Redirecting..." : "Install GitHub App"}
              </button>
            </div>
          ) : (
            /* Conditional Rendering: App Installed -> 1-Click Dropdown & Link Form */
            <form onSubmit={handleLinkRepoSubmit} className="flex flex-col gap-3">
              <div>
                <h3 className="text-sm font-medium text-ink flex items-center gap-2">
                  <FaGithub className="h-4 w-4 text-purple-400" /> Select Authorized Repository
                </h3>
                <p className="mt-1 text-xs text-muted">
                  Choose a repository from your GitHub App installation to link to this project.
                </p>
              </div>

              {availableData?.repositories && availableData.repositories.length > 0 ? (
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <select
                    value={selectedRepoUrl}
                    onChange={(e) => setSelectedRepoUrl(e.target.value)}
                    className="flex-1 h-9 rounded-lg border border-border bg-surface-raised px-3 text-xs text-ink outline-none transition focus:border-accent cursor-pointer"
                  >
                    {availableData.repositories.map((r) => (
                      <option key={r.id || r.repoUrl} value={r.repoUrl}>
                        {r.fullName || r.name} ({r.repoUrl})
                      </option>
                    ))}
                  </select>

                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    loading={linkingUrl}
                    disabled={linkingUrl || !selectedRepoUrl}
                  >
                    {linkingUrl ? "Linking..." : "Link Repository"}
                  </Button>
                </div>
              ) : (
                <div className="text-xs text-subtle">
                  No repositories listed automatically. Enter your repository URL below to link:
                </div>
              )}
            </form>
          )}

          {/* Manual Input Fallback */}
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
              placeholder="https://github.com/owner/repository"
              value={manualRepoUrl}
              onChange={(e) => setManualRepoUrl(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-ink outline-none transition placeholder:text-subtle focus:border-accent focus:ring-1 focus:ring-accent/40"
            />
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              loading={linkingUrl}
              disabled={linkingUrl || (!manualRepoUrl.trim() && !selectedRepoUrl)}
            >
              Link Repo
            </Button>
          </form>
        </div>
      )}
    </section>
  );
}

export default GithubConnectionSection;
