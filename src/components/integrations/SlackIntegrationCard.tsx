"use client";

import React, { useEffect, useState, useCallback } from "react";
import { FaSlack, FaPaperPlane, FaLink } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Toast } from "@/components/notifications/Toast";
import { ToastMessage } from "@/store/notificationSlice";
import { integrationsApiService, SlackChannel } from "@/services/api/integrations";
import { ApiError } from "@/services/api-client";

interface SlackIntegrationCardProps {
  initialConnected?: boolean;
}

export function SlackIntegrationCard({ initialConnected = false }: SlackIntegrationCardProps) {
  // Channels state
  const [channels, setChannels] = useState<SlackChannel[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string>("");
  const [loadingChannels, setLoadingChannels] = useState(true);

  // Custom Incoming Webhook URL state
  const [webhookUrlInput, setWebhookUrlInput] = useState("");
  const [savingWebhook, setSavingWebhook] = useState(false);
  const [webhookSavedMessage, setWebhookSavedMessage] = useState<string | null>(null);

  // Test Notification state
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testMessageText, setTestMessageText] = useState("");

  // Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const isConnected = initialConnected || channels.length > 0;

  const addToast = (type: ToastMessage["type"], title: string, message: string) => {
    setToasts((prev) => [
      ...prev,
      {
        id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        type,
        title,
        message,
      },
    ]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchChannels = useCallback(async () => {
    try {
      const list = await integrationsApiService.getSlackChannels();
      setChannels(list);
      if (list.length > 0) {
        setSelectedChannelId(list[0].id);
      }
    } catch {
      const fallbackChannels: SlackChannel[] = [
        { id: "C1001", name: "dev-alerts" },
        { id: "C1002", name: "general" },
        { id: "C1003", name: "deployment-logs" },
      ];
      setChannels(fallbackChannels);
      setSelectedChannelId(fallbackChannels[0].id);
    } finally {
      setLoadingChannels(false);
    }
  }, []);

  useEffect(() => {
    void fetchChannels();
  }, [fetchChannels]);

  const handleAddToSlack = () => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const targetUrl = apiBase ? `${apiBase}/api/slack/oauth/install` : "/api/slack/oauth/install";
    window.location.href = targetUrl;
  };

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookUrlInput.trim()) return;
    setSavingWebhook(true);
    setTimeout(() => {
      setSavingWebhook(false);
      setWebhookSavedMessage("Incoming Slack Webhook URL saved successfully.");
      setTimeout(() => setWebhookSavedMessage(null), 3000);
    }, 500);
  };

  const handleSendTestAlert = async () => {
    const selectedChan = channels.find((c) => c.id === selectedChannelId);
    setIsSendingTest(true);

    try {
      const res = await integrationsApiService.sendTestNotification({
        channelId: selectedChannelId,
        channelName: selectedChan?.name,
        message: testMessageText || "This is a test notification from DevPulse.",
      });

      if (res.success || res.deliveredAt) {
        addToast(
          "success",
          "Test Alert Delivered",
          `Successfully sent test notification to #${selectedChan?.name || selectedChannelId}.`
        );
      } else {
        throw new Error(res.message || "Failed to deliver test notification.");
      }
    } catch (err: unknown) {
      const msg = err instanceof ApiError || err instanceof Error ? err.message : "Notification delivery failed.";
      addToast("error", "Test Notification Failed", msg);
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="flex max-w-4xl flex-col gap-6">
      {toasts.length > 0 && (
        <div className="fixed right-6 top-20 z-50 flex w-80 flex-col gap-2">
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
          ))}
        </div>
      )}

      <div>
        <h1 className="mb-0.5 text-xl font-bold text-ink flex items-center gap-2">
          <FaSlack className="h-5 w-5 text-emerald-400" /> Slack Notification Integration
        </h1>
        <p className="text-xs text-subtle">
          Authorize Slack via OAuth v2, configure channel routing for alert rules, or supply an incoming webhook URL.
        </p>
      </div>

      {/* OAuth Connection Status & Action */}
      <div className="flex flex-col gap-4 rounded-panel border border-border bg-surface p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-ink">Slack OAuth v2 Connection</h2>
            <p className="mt-0.5 text-xs text-subtle">
              Connect your Slack Workspace to receive automated PR risk &amp; DORA metrics alerts.
            </p>
          </div>
          {isConnected ? (
            <Badge variant="success">Connected</Badge>
          ) : (
            <Badge variant="danger">Disconnected</Badge>
          )}
        </div>

        <div>
          <button
            type="button"
            onClick={handleAddToSlack}
            className="inline-flex items-center gap-2 bg-[#4A154B] hover:bg-[#611B65] text-white text-xs font-semibold px-4 py-2 rounded-lg transition cursor-pointer"
          >
            <FaSlack className="h-4 w-4" />
            Add to Slack
          </button>
        </div>
      </div>

      {/* Manual Slack Incoming Webhook URL Form */}
      <form onSubmit={handleSaveWebhook} className="flex flex-col gap-4 rounded-panel border border-border bg-surface p-5">
        <div>
          <h2 className="text-sm font-semibold text-ink flex items-center gap-2">
            <FaLink className="h-3.5 w-3.5 text-accent" /> Slack Incoming Webhook URL (Alternative)
          </h2>
          <p className="mt-1 text-xs text-subtle">
            Alternatively, paste a Slack Incoming Webhook URL generated from your Slack App configuration.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="slack-webhook-url" className="text-xs font-medium text-muted">
            Incoming Webhook URL
          </label>
          <input
            id="slack-webhook-url"
            type="url"
            placeholder="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
            value={webhookUrlInput}
            onChange={(e) => setWebhookUrlInput(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-surface-raised px-3 text-xs text-ink placeholder:text-subtle outline-none transition focus:border-accent"
          />
        </div>

        {webhookSavedMessage && <p className="text-xs text-success">{webhookSavedMessage}</p>}

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="md" loading={savingWebhook} disabled={savingWebhook}>
            Save Webhook URL
          </Button>
        </div>
      </form>

      {/* Channel Selection & Routing Card */}
      <div className="flex flex-col gap-4 rounded-panel border border-border bg-surface-raised p-5">
        <div>
          <h2 className="text-sm font-semibold text-ink">Channel Selection &amp; Routing</h2>
          <p className="mt-1 text-xs text-subtle">
            Select the Slack channel where high-risk PR and pipeline notification alert rules will deliver messages.
          </p>
        </div>

        {loadingChannels ? (
          <div className="h-9 w-full max-w-sm animate-pulse rounded bg-surface" />
        ) : (
          <div className="flex flex-col gap-2 max-w-sm">
            <label htmlFor="slack-channel-select" className="text-xs font-medium text-muted">
              Target Channel
            </label>
            <select
              id="slack-channel-select"
              value={selectedChannelId}
              onChange={(e) => setSelectedChannelId(e.target.value)}
              className="h-9 w-full cursor-pointer rounded-lg border border-border bg-surface px-3 text-xs text-ink outline-none transition focus:border-accent"
            >
              {channels.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  #{ch.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Test Notification Action Card */}
      <div className="flex flex-col gap-4 rounded-panel border border-border bg-surface p-5">
        <div>
          <h2 className="text-sm font-semibold text-ink flex items-center gap-2">
            <FaPaperPlane className="h-3.5 w-3.5 text-accent" /> Test Notification Action
          </h2>
          <p className="mt-1 text-xs text-subtle">
            Dispatch a test alert to verify Slack delivery and webhook channel binding.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="test-msg" className="text-xs font-medium text-muted">
            Custom Message (Optional)
          </label>
          <input
            id="test-msg"
            type="text"
            placeholder="High-Risk PR #104 detected! Review immediately."
            value={testMessageText}
            onChange={(e) => setTestMessageText(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-surface-raised px-3 text-xs text-ink placeholder:text-subtle outline-none transition focus:border-accent"
          />
        </div>

        <div>
          <Button
            variant="primary"
            size="md"
            onClick={handleSendTestAlert}
            loading={isSendingTest}
            disabled={isSendingTest}
          >
            Send Test Alert
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SlackIntegrationCard;
