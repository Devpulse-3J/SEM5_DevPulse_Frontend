"use client";

import { useState } from "react";
import Link from "next/link";
import { FaGithub, FaJira, FaSlack, FaArrowRight } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { webhookService } from "@/services/webhook.service";
import { ApiError } from "@/services/api-client";

type DemoState = "idle" | "sending" | "sent" | "failed";

export default function IntegrationsPage() {
  const [demoState, setDemoState] = useState<DemoState>("idle");
  const [demoError, setDemoError] = useState<string | null>(null);

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

  const INTEGRATION_CARDS = [
    {
      id: "github",
      title: "GitHub Integration",
      description: "1-Click GitHub App authorization, manual repo linking, and historical data sync.",
      href: "/admin/integrations/github",
      icon: <FaGithub className="h-6 w-6 text-purple-400" />,
      badge: "GitHub App / Repos",
    },
    {
      id: "jira",
      title: "Jira Integration",
      description: "Webhook URL configuration, X-Jira-Signature validation secret, and issue ingestion metrics.",
      href: "/admin/integrations/jira",
      icon: <FaJira className="h-6 w-6 text-blue-400" />,
      badge: "Webhooks / Secret",
    },
    {
      id: "slack",
      title: "Slack Integration",
      description: "OAuth v2 workspace authorization, channel dropdown routing, and test notification dispatch.",
      href: "/admin/integrations/slack",
      icon: <FaSlack className="h-6 w-6 text-emerald-400" />,
      badge: "OAuth v2 / Alert Rules",
    },
  ];

  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="mb-0.5 text-xl font-bold text-ink">Integrations Overview</h1>
        <p className="text-xs text-subtle">
          Manage connected data sources, authentication credentials, and notification webhooks.
        </p>
      </div>

      {/* Integration Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {INTEGRATION_CARDS.map((card) => (
          <Link
            key={card.id}
            href={card.href}
            className="flex flex-col justify-between gap-4 rounded-panel border border-border bg-surface p-5 transition hover:border-accent/40 hover:bg-surface-raised/40 no-underline text-ink"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="rounded-lg border border-border/80 bg-surface-raised p-2">
                  {card.icon}
                </div>
                <span className="rounded-full bg-surface-raised border border-border px-2.5 py-0.5 text-[10px] font-medium text-subtle">
                  {card.badge}
                </span>
              </div>
              <div>
                <h2 className="text-sm font-bold text-ink">{card.title}</h2>
                <p className="mt-1 text-xs text-subtle leading-relaxed">{card.description}</p>
              </div>
            </div>

            <div className="flex items-center text-xs font-semibold text-accent gap-1.5 pt-2">
              Configure Module <FaArrowRight className="h-3 w-3" />
            </div>
          </Link>
        ))}
      </div>

      {/* Event Pipeline Demo Section */}
      <div className="flex flex-col gap-3 rounded-panel border border-border bg-surface p-5">
        <div>
          <h2 className="text-sm font-semibold text-ink">Synthetic Event Pipeline Demo</h2>
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
    </div>
  );
}
