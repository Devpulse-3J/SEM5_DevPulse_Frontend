"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { FaSlack, FaPaperPlane } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Toast } from "@/components/notifications/Toast";
import { ToastMessage } from "@/store/notificationSlice";
import { integrationsApiService, SlackChannel } from "@/services/api/integrations";
import { ApiError } from "@/services/api-client";

export default function SlackIntegrationPage() {
  const searchParams = useSearchParams();
  const oauthConnected =
    Boolean(searchParams?.get("code")) ||
    searchParams?.get("status") === "connected" ||
    searchParams?.get("connected") === "true";

  // Channels state
  const [channels, setChannels] = useState<SlackChannel[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string>("");
  const [loadingChannels, setLoadingChannels] = useState(true);
  const isConnected = oauthConnected || channels.length > 0;

  // Test Notification state
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testMessageText, setTestMessageText] = useState("");

  // Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

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

  // Fetch Channels on mount
  const fetchChannels = useCallback(async () => {
    try {
      const list = await integrationsApiService.getSlackChannels();
      setChannels(list);
      if (list.length > 0) {
        setSelectedChannelId(list[0].id);
      }
    } catch (err: unknown) {
      console.warn("Failed to load Slack channels from API, displaying default options", err);
      // Fallback pre-populated channels as requested in spec (#dev-alerts, #general)
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
    const timeoutId = setTimeout(() => {
      void fetchChannels();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [fetchChannels]);

  // OAuth Flow: Redirect to /api/slack/oauth/install
  const handleAddToSlack = () => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const targetUrl = apiBase ? `${apiBase}/api/slack/oauth/install` : "/api/slack/oauth/install";
    window.location.href = targetUrl;
  };

  // Test Notification Action
  const handleSendTestAlert = async () => {
    const selectedChan = channels.find((c) => c.id === selectedChannelId);
    setIsSendingTest(true);

    try {
      const res = await integrationsApiService.sendTestNotification({
        channelId: selectedChannelId,
        channelName: selectedChan?.name,
        message: testMessageText || "This is a test notification from Odin Eye.",
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
      {/* Toast Render */}
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
          Authorize Slack via OAuth v2, configure channel routing for notification alert rules, and dispatch test notifications.
        </p>
      </div>

      {/* OAuth Connection Status & Action */}
      <div className="flex flex-col gap-4 rounded-panel border border-border bg-surface p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-ink">Slack OAuth Connection</h2>
            <p className="mt-0.5 text-xs text-subtle">
              Connect your Slack Workspace to receive real-time security and PR risk alerts.
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
