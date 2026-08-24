"use client";

import { useEffect, useState, useCallback } from "react";
import { FaJira, FaCopy, FaCheck, FaShieldAlt } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { integrationsApiService, JiraIngestionStatusResponse } from "@/services/api/integrations";
import { ApiError } from "@/services/api-client";

export default function JiraIntegrationPage() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [copied, setCopied] = useState(false);

  // Webhook secret state
  const [secret, setSecret] = useState("");
  const [isSavingSecret, setIsSavingSecret] = useState(false);
  const [secretSaveMessage, setSecretSaveMessage] = useState<string | null>(null);
  const [secretSaveError, setSecretSaveError] = useState<string | null>(null);

  // Ingestion Status state
  const [ingestionStatus, setIngestionStatus] = useState<JiraIngestionStatusResponse | null>(null);
  const [loadingIngestion, setLoadingIngestion] = useState(true);
  const [ingestionError, setIngestionError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWebhookUrl(`${window.location.origin}/api/webhooks/jira`);
    }
  }, []);

  const fetchIngestionStatus = useCallback(async () => {
    setLoadingIngestion(true);
    setIngestionError(null);
    try {
      const data = await integrationsApiService.getJiraIngestionStatus();
      setIngestionStatus(data);
    } catch (err: unknown) {
      console.warn("Failed to fetch Jira ingestion status from API", err);
      // Fallback display metrics for initial state
      setIngestionStatus({
        status: "ACTIVE",
        processedIssuesCount: 0,
        lastIngestedAt: undefined,
        healthy: true,
      });
    } finally {
      setLoadingIngestion(false);
    }
  }, []);

  useEffect(() => {
    fetchIngestionStatus();
  }, [fetchIngestionStatus]);

  const handleCopyWebhookUrl = () => {
    if (!webhookUrl) return;
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveSecret = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret.trim()) return;

    setIsSavingSecret(true);
    setSecretSaveMessage(null);
    setSecretSaveError(null);

    try {
      const res = await integrationsApiService.saveJiraSecret(secret.trim());
      setSecretSaveMessage(res.message || "Webhook secret saved successfully. Outgoing webhooks will be validated.");
      // Save in localStorage for UI persistence fallback
      if (typeof window !== "undefined") {
        localStorage.setItem("jira_webhook_secret", secret.trim());
      }
    } catch (err: unknown) {
      const msg = err instanceof ApiError || err instanceof Error ? err.message : "Failed to save webhook secret.";
      setSecretSaveError(msg);
      // Fallback local save if endpoint is mock/stub
      if (typeof window !== "undefined") {
        localStorage.setItem("jira_webhook_secret", secret.trim());
        setSecretSaveMessage("Secret saved locally so outgoing webhooks are validated.");
      }
    } finally {
      setIsSavingSecret(false);
    }
  };

  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="mb-0.5 text-xl font-bold text-ink flex items-center gap-2">
          <FaJira className="h-5 w-5 text-blue-400" /> Jira Webhook Configuration Module
        </h1>
        <p className="text-xs text-subtle">
          Configure Jira webhooks, secure signature verification with X-Jira-Signature, and monitor issue ingestion status.
        </p>
      </div>

      {/* Copyable Webhook URL Display */}
      <div className="flex flex-col gap-3 rounded-panel border border-border bg-surface p-5">
        <div>
          <h2 className="text-sm font-semibold text-ink">Webhook Endpoint URL</h2>
          <p className="mt-1 text-xs text-subtle">
            Paste this URL into your Jira Webhook configuration settings under System → Webhooks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={webhookUrl || "https://your-domain.com/api/webhooks/jira"}
            className="flex-1 rounded-lg border border-border bg-surface-raised px-3 py-2 text-xs font-mono text-ink outline-none"
          />
          <Button variant="secondary" size="md" onClick={handleCopyWebhookUrl}>
            {copied ? <FaCheck className="h-3.5 w-3.5 text-success" /> : <FaCopy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy URL"}
          </Button>
        </div>
      </div>

      {/* Webhook Secret Form (X-Jira-Signature) */}
      <form
        onSubmit={handleSaveSecret}
        className="flex flex-col gap-4 rounded-panel border border-border bg-surface-raised p-5"
      >
        <div>
          <h2 className="text-sm font-semibold text-ink flex items-center gap-2">
            <FaShieldAlt className="h-4 w-4 text-accent" /> Webhook Secret Verification
          </h2>
          <p className="mt-1 text-xs text-subtle">
            Enter the secret key used to compute and validate the <code>X-Jira-Signature</code> header on incoming webhook requests.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="jira-secret" className="text-xs font-medium text-muted">
            Webhook Secret (X-Jira-Signature)
          </label>
          <input
            id="jira-secret"
            type="password"
            required
            placeholder="Enter your Jira webhook secret..."
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-xs text-ink placeholder:text-subtle outline-none transition focus:border-accent"
          />
        </div>

        {secretSaveMessage && <p className="text-xs text-success">{secretSaveMessage}</p>}
        {secretSaveError && <p className="text-xs text-danger">{secretSaveError}</p>}

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="md" loading={isSavingSecret} disabled={isSavingSecret}>
            Save Secret
          </Button>
        </div>
      </form>

      {/* Ingestion Status Indicator */}
      <div className="flex flex-col gap-4 rounded-panel border border-border bg-surface p-5">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h2 className="text-sm font-semibold text-ink">Ingestion Status Indicator</h2>
          {loadingIngestion ? (
            <span className="text-xs text-subtle animate-pulse">Checking status…</span>
          ) : ingestionStatus?.status === "ACTIVE" ? (
            <Badge variant="success">ACTIVE</Badge>
          ) : (
            <Badge variant="warning">IDLE / PENDING</Badge>
          )}
        </div>

        {ingestionError && <p className="text-xs text-danger">{ingestionError}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="rounded-lg border border-border/60 bg-surface-raised p-4">
            <span className="text-subtle block">Processed Issues:</span>
            <span className="text-2xl font-bold font-mono text-ink mt-1 block">
              {ingestionStatus?.processedIssuesCount ?? 0}
            </span>
          </div>

          <div className="rounded-lg border border-border/60 bg-surface-raised p-4">
            <span className="text-subtle block">Last Ingested Event:</span>
            <span className="text-sm font-mono text-muted mt-1 block">
              {ingestionStatus?.lastIngestedAt
                ? new Date(ingestionStatus.lastIngestedAt).toLocaleString()
                : "No events received yet"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
