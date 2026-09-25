"use client";

import React, { useState, useEffect } from "react";
import { FaPlus, FaSlack, FaBell, FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AlertRuleModal } from "@/features/alerts/AlertRuleModal";
import { integrationsApiService, SlackChannel } from "@/services/api/integrations";
import type { AlertRule } from "@/types/notification";

interface AlertRulesTabProps {
  companyId: number;
  createdByUserId: number | null;
  projectId?: number | null;
}

export function AlertRulesTab({
  companyId,
  createdByUserId,
  projectId = null,
}: AlertRulesTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [channels, setChannels] = useState<SlackChannel[]>([]);
  const [rules, setRules] = useState<AlertRule[]>([
    {
      ruleId: 1,
      companyId,
      projectId,
      ruleType: "HIGH_RISK_PR",
      thresholdHours: 24,
      slackChannel: "#dev-alerts",
      createdByUserId,
      createdAt: new Date().toISOString(),
      active: true,
    },
    {
      ruleId: 2,
      companyId,
      projectId,
      ruleType: "DEPLOYMENT_FAILED",
      thresholdHours: null,
      slackChannel: "#general",
      createdByUserId,
      createdAt: new Date().toISOString(),
      active: true,
    },
  ]);

  useEffect(() => {
    async function loadChannels() {
      try {
        const list = await integrationsApiService.getSlackChannels();
        setChannels(list);
      } catch {
        setChannels([
          { id: "C1001", name: "dev-alerts" },
          { id: "C1002", name: "general" },
        ]);
      }
    }
    void loadChannels();
  }, []);

  const handleDeleteRule = (ruleId: number) => {
    setRules((prev) => prev.filter((r) => r.ruleId !== ruleId));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-ink flex items-center gap-2">
            <FaBell className="h-4 w-4 text-accent" /> Notification Alert Rules
          </h2>
          <p className="mt-0.5 text-xs text-subtle">
            Configure automated alerts for high-risk pull requests and DORA metrics, routed directly to your Slack channels.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5"
        >
          <FaPlus className="h-3 w-3" /> Add Alert Rule
        </Button>
      </div>

      {/* Rules Table / Cards */}
      <div className="flex flex-col gap-3">
        {rules.map((rule) => (
          <div
            key={rule.ruleId}
            className="flex items-center justify-between rounded-panel border border-border bg-surface p-4 text-xs"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-border bg-surface-raised p-2 text-accent">
                <FaBell className="h-4 w-4" />
              </div>
              <div>
                <span className="font-semibold text-ink block text-sm">
                  {rule.ruleType.replace(/_/g, " ")}
                </span>
                <span className="text-subtle text-[11px] block mt-0.5">
                  Threshold: {rule.thresholdHours ? `${rule.thresholdHours} hours` : "None"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="default" className="flex items-center gap-1">
                <FaSlack className="h-3 w-3 text-emerald-400" />
                {rule.slackChannel || "Not configured"}
              </Badge>

              <button
                type="button"
                onClick={() => handleDeleteRule(rule.ruleId)}
                className="text-subtle hover:text-danger p-1 transition cursor-pointer"
                title="Delete rule"
              >
                <FaTrash className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Available Slack Channels Summary */}
      <div className="rounded-panel border border-border bg-surface-raised p-4">
        <h3 className="text-xs font-semibold text-ink flex items-center gap-1.5 mb-2">
          <FaSlack className="h-3.5 w-3.5 text-emerald-400" /> Available Connected Slack Channels
        </h3>
        <div className="flex flex-wrap gap-2">
          {channels.map((ch) => (
            <span
              key={ch.id}
              className="rounded-md border border-border/80 bg-surface px-2.5 py-1 text-[11px] font-mono text-muted"
            >
              #{ch.name}
            </span>
          ))}
        </div>
      </div>

      {/* Alert Rule Creation Modal */}
      <AlertRuleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitRule={(newRule) => {
          setRules((prev) => [
            ...prev,
            {
              ...newRule,
              ruleId: Date.now(),
              createdAt: new Date().toISOString(),
              active: true,
            },
          ]);
        }}
        companyId={companyId}
        createdByUserId={createdByUserId}
        projectId={projectId}
      />
    </div>
  );
}

export default AlertRulesTab;
