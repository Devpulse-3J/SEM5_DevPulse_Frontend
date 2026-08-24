"use client";

import { useEffect, useState, useCallback } from "react";
import { FaGithub, FaCheckCircle, FaExclamationTriangle, FaSync } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { integrationsApiService, GithubStatusResponse } from "@/services/api/integrations";
import { projectService, ProjectApiResponse } from "@/services/project.service";
import { ApiError } from "@/services/api-client";

export default function GithubIntegrationPage() {
  const [projects, setProjects] = useState<ProjectApiResponse[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Flow 1 State
  const [loadingAppUrl, setLoadingAppUrl] = useState(false);
  const [appUrlError, setAppUrlError] = useState<string | null>(null);

  // Flow 2 State
  const [repoUrlInput, setRepoUrlInput] = useState("");
  const [webhookSecretInput, setWebhookSecretInput] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linkNotes, setLinkNotes] = useState<string | null>(null);

  // Flow 3 State
  const [status, setStatus] = useState<GithubStatusResponse | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Load Projects on mount
  useEffect(() => {
    async function loadProjects() {
      try {
        const list = await projectService.getAll();
        setProjects(list);
        if (list.length > 0) {
          setSelectedProjectId(String(list[0].projectId));
        }
      } catch (err) {
        console.warn("Could not load projects for GitHub integration", err);
      } finally {
        setLoadingProjects(false);
      }
    }
    loadProjects();
  }, []);

  // Fetch status when selectedProjectId changes
  const fetchStatus = useCallback(async (projectId: string) => {
    if (!projectId) return;
    setLoadingStatus(true);
    setSyncError(null);
    try {
      const res = await integrationsApiService.getGithubStatus(projectId);
      setStatus(res);
      if (res.status === "SYNCING") {
        setIsSyncing(true);
      }
    } catch (err: unknown) {
      console.warn("Failed to fetch GitHub status", err);
      // Fallback status object for UI rendering
      setStatus({
        status: "DISCONNECTED",
      });
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchStatus(selectedProjectId);
    }
  }, [selectedProjectId, fetchStatus]);

  // Flow 1: 1-Click GitHub App Authorization
  const handleConnectGitHubApp = async () => {
    if (!selectedProjectId) return;
    setLoadingAppUrl(true);
    setAppUrlError(null);
    try {
      const res = await integrationsApiService.getGithubConnectUrl(selectedProjectId);
      if (res?.connectUrl) {
        window.location.href = res.connectUrl;
      } else {
        throw new Error("No connect URL returned by API.");
      }
    } catch (err: unknown) {
      const msg = err instanceof ApiError || err instanceof Error ? err.message : "Failed to obtain GitHub App URL.";
      setAppUrlError(msg);
      // Fallback redirection format as specified in spec if API backend endpoint fails
      const fallbackUrl = `https://github.com/apps/devpulse-app/installations/new?state=${selectedProjectId}`;
      window.location.href = fallbackUrl;
    } finally {
      setLoadingAppUrl(false);
    }
  };

  // Flow 2: Manual Repository Link (Fallback Form)
  const handleManualLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !repoUrlInput.trim()) return;

    setIsLinking(true);
    setLinkError(null);
    setLinkNotes(null);

    try {
      const res = await integrationsApiService.linkGithubRepo(selectedProjectId, {
        repoUrl: repoUrlInput.trim(),
        webhookSecret: webhookSecretInput.trim() || undefined,
      });

      setStatus({
        linkedRepo: res.linkedRepo || repoUrlInput.trim(),
        defaultBranch: res.defaultBranch || "main",
        status: res.status || "CONNECTED",
        webhookRegistered: res.webhookRegistered,
      });

      setLinkNotes(
        res.notes ||
          res.message ||
          (res.webhookRegistered
            ? "Webhook was automatically registered with GitHub."
            : "Repository linked. If automatic webhook registration fails, ensure webhook Secret is set.")
      );

      setRepoUrlInput("");
      setWebhookSecretInput("");
    } catch (err: unknown) {
      const msg = err instanceof ApiError || err instanceof Error ? err.message : "Could not link repository.";
      setLinkError(msg);
    } finally {
      setIsLinking(false);
    }
  };

  // Flow 3: Historical Sync Execution
  const handleSyncHistoricalData = async () => {
    if (!selectedProjectId) return;
    setIsSyncing(true);
    setSyncError(null);
    setSyncMessage(null);

    try {
      const res = await integrationsApiService.syncGithubData(selectedProjectId);
      setSyncMessage(res.message || "Historical sync initiated successfully.");
      setStatus((prev) => (prev ? { ...prev, status: "SYNCING" } : null));

      // Re-poll status after 3 seconds
      setTimeout(() => {
        setIsSyncing(false);
        fetchStatus(selectedProjectId);
      }, 3000);
    } catch (err: unknown) {
      const msg = err instanceof ApiError || err instanceof Error ? err.message : "Failed to trigger historical sync.";
      setSyncError(msg);
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="mb-0.5 text-xl font-bold text-ink flex items-center gap-2">
          <FaGithub className="h-5 w-5 text-purple-400" /> GitHub Connection &amp; Sync Module
        </h1>
        <p className="text-xs text-subtle">
          Authorize GitHub App or link repositories manually to sync commits, pull requests, and PR metrics.
        </p>
      </div>

      {/* Project Selector */}
      <div className="flex items-center gap-4 rounded-panel border border-border bg-surface p-4">
        <label htmlFor="project-select" className="text-xs font-semibold text-ink whitespace-nowrap">
          Target Project:
        </label>
        {loadingProjects ? (
          <div className="h-4 w-32 animate-pulse rounded bg-surface-raised" />
        ) : (
          <select
            id="project-select"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="h-9 w-full max-w-xs cursor-pointer rounded-lg border border-border bg-surface-raised px-3 text-xs text-ink outline-none transition focus:border-accent"
          >
            {projects.map((p) => (
              <option key={p.projectId} value={p.projectId}>
                {p.projectName} (ID: {p.projectId})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Flow 3: Current Status Display Card */}
      <div className="flex flex-col gap-4 rounded-panel border border-border bg-surface p-5">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h2 className="text-sm font-semibold text-ink flex items-center gap-2">
            Status &amp; Repository Connection
          </h2>
          {loadingStatus ? (
            <span className="text-xs text-subtle animate-pulse">Checking status…</span>
          ) : status?.status === "CONNECTED" ? (
            <Badge variant="success">CONNECTED</Badge>
          ) : isSyncing || status?.status === "SYNCING" ? (
            <Badge variant="warning">SYNCING</Badge>
          ) : (
            <Badge variant="danger">DISCONNECTED</Badge>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-subtle block">Linked Repo:</span>
            <span className="font-mono text-ink font-medium">
              {status?.linkedRepo || status?.repoUrl || "No repo linked"}
            </span>
          </div>
          <div>
            <span className="text-subtle block">Default Branch:</span>
            <span className="font-mono text-ink font-medium">{status?.defaultBranch || "main"}</span>
          </div>
          <div>
            <span className="text-subtle block">Last Synced:</span>
            <span className="font-mono text-muted">
              {status?.lastSyncedAt ? new Date(status.lastSyncedAt).toLocaleString() : "Never"}
            </span>
          </div>
        </div>

        {/* Sync Historical Data Action */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleSyncHistoricalData}
            loading={isSyncing}
            disabled={isSyncing || !selectedProjectId}
          >
            <FaSync className={`h-3 w-3 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Syncing Historical Data…" : "Sync Historical Data"}
          </Button>

          {syncMessage && <span className="text-xs text-success flex items-center gap-1"><FaCheckCircle /> {syncMessage}</span>}
          {syncError && <span className="text-xs text-danger flex items-center gap-1"><FaExclamationTriangle /> {syncError}</span>}
        </div>
      </div>

      {/* Flow 1: 1-Click GitHub App Authorization (Recommended) */}
      <div className="flex flex-col gap-3 rounded-panel border border-purple-500/30 bg-purple-950/10 p-5">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-purple-400 uppercase">Flow 1 (Recommended)</span>
          <h2 className="text-sm font-semibold text-ink mt-0.5">1-Click GitHub App Authorization</h2>
          <p className="mt-1 text-xs text-muted">
            Clicking this button requests authorization from GitHub and redirects to install the official DevPulse App.
          </p>
        </div>

        {appUrlError && <p className="text-xs text-danger">{appUrlError}</p>}

        <div>
          <button
            type="button"
            onClick={handleConnectGitHubApp}
            disabled={loadingAppUrl || !selectedProjectId}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50 cursor-pointer"
          >
            <FaGithub className="h-4 w-4" />
            {loadingAppUrl ? "Fetching Redirect URL..." : "Connect GitHub App"}
          </button>
        </div>
      </div>

      {/* Flow 2: Manual Repository Link (Fallback Form) */}
      <form
        onSubmit={handleManualLinkSubmit}
        className="flex flex-col gap-4 rounded-panel border border-border bg-surface-raised p-5"
      >
        <div>
          <span className="text-[10px] font-bold tracking-widest text-subtle uppercase">Flow 2 (Fallback)</span>
          <h2 className="text-sm font-semibold text-ink mt-0.5">Manual Repository Link</h2>
          <p className="mt-1 text-xs text-subtle">
            If 1-click install is not available, enter the repository URL and optional webhook secret manually.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="repo-url" className="text-xs font-medium text-muted">
              Repository URL *
            </label>
            <input
              id="repo-url"
              type="url"
              required
              placeholder="https://github.com/owner/repository"
              value={repoUrlInput}
              onChange={(e) => setRepoUrlInput(e.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-xs text-ink placeholder:text-subtle outline-none transition focus:border-accent"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="webhook-secret" className="text-xs font-medium text-muted">
              Webhook Secret (Optional)
            </label>
            <input
              id="webhook-secret"
              type="password"
              placeholder="Custom secret for verifying webhook signatures"
              value={webhookSecretInput}
              onChange={(e) => setWebhookSecretInput(e.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-xs text-ink placeholder:text-subtle outline-none transition focus:border-accent"
            />
          </div>
        </div>

        {linkError && <p className="text-xs text-danger">{linkError}</p>}
        {linkNotes && (
          <div className="rounded-lg border border-border/80 bg-surface p-3 text-xs text-success font-mono">
            {linkNotes}
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" variant="secondary" size="md" loading={isLinking} disabled={isLinking}>
            Link Repository
          </Button>
        </div>
      </form>
    </div>
  );
}
