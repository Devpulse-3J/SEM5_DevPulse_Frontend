"use client";

import { useState } from "react";
import { FeatureUnavailable } from "@/components/ui/FeatureUnavailable";
import { Button } from "@/components/ui/Button";
import { webhookService } from "@/services/webhook.service";
import { ApiError } from "@/services/api-client";

type DemoState = "idle" | "sending" | "sent" | "failed";

export default function IntegrationsPage() {
  const [demoState, setDemoState] = useState<DemoState>("idle");
  const [demoError, setDemoError] = useState<string | null>(null);

  /**
   * POST /api/webhooks/test-high-risk-alert publishes a synthetic high-risk-PR
   * event through RabbitMQ. It is the only way to exercise the notification
   * pipeline end to end, since nothing else produces events yet.
   */
  const handleTriggerDemo = async () => {
    setDemoState("sending");
    setDemoError(null);
    try {
      await webhookService.triggerHighRiskAlertDemo();
      setDemoState("sent");
    } catch (err: unknown) {
      setDemoState("failed");
      setDemoError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Could not reach the webhook endpoint."
      );
    }
  };

  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="mb-0.5 text-xl font-bold">Integrations</h1>
        <p className="text-xs text-subtle">
          Connected data sources and the event pipeline
        </p>
      </div>

      {/* Real, working endpoint. */}
      <div className="flex flex-col gap-3 rounded-panel border border-border bg-surface p-5">
        <div>
          <h2 className="text-sm font-semibold text-ink">Event pipeline</h2>
          <p className="mt-1 text-xs text-muted">
            Publishes a synthetic high-risk pull request event through RabbitMQ into
            notification-service. Alert rules matching <code>HIGH_RISK_PR</code> will
            fire against their configured Slack channel.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={handleTriggerDemo}
            disabled={demoState === "sending"}
          >
            {demoState === "sending" ? "Sending…" : "Trigger demo alert"}
          </Button>

          {demoState === "sent" && (
            <span className="text-xs text-success">
              Event published — check your Slack channel.
            </span>
          )}
          {demoState === "failed" && (
            <span className="text-xs text-danger">{demoError}</span>
          )}
        </div>
      </div>

      <FeatureUnavailable
        title="GitHub, Jira, and Slack connections are not available yet"
        message="Connecting and syncing external accounts requires integration-service, which is not yet implemented. Slack delivery is configured per alert rule instead."
      />
    </div>
  );
}
