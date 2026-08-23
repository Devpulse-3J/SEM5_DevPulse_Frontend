"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FeatureUnavailable } from "@/components/ui/FeatureUnavailable";
import { AlertRuleModal } from "./AlertRuleModal";
import { exportToCSV } from "@/utils/exportCSV";
import type { AlertRule, CreateAlertRuleRequest } from "@/types/notification";

interface AlertListProps {
  rules: AlertRule[];
  companyId: number;
  currentUserId: number | null;
  isLoading?: boolean;
  error?: Error | null;
  onCreateRule: (rule: CreateAlertRuleRequest) => void;
  onDeleteRule: (ruleId: number) => void;
  isMutating?: boolean;
}

/**
 * Alert rules table.
 *
 * The old "Active Alerts" tab is gone: notification-service stores rules, not
 * deliveries, so there is no history to list and no alert to acknowledge.
 */
export function AlertList({
  rules,
  companyId,
  currentUserId,
  isLoading = false,
  error = null,
  onCreateRule,
  onDeleteRule,
  isMutating = false,
}: AlertListProps) {
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);

  const handleExport = () => {
    exportToCSV(
      "alert_rules_export",
      rules.map((r) => ({
        RuleId: r.ruleId,
        Type: r.ruleType,
        ProjectId: r.projectId ?? "all projects",
        ThresholdHours: r.thresholdHours ?? "",
        SlackChannel: r.slackChannel ?? "",
        CreatedAt: r.createdAt,
        Active: r.active,
      }))
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-sm font-semibold text-ink">
            Alert rules {rules.length > 0 && `(${rules.length})`}
          </h2>
          <p className="mt-0.5 text-[11px] text-subtle">
            Conditions notification-service watches for. Only active rules are listed.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {rules.length > 0 && (
            <button
              onClick={handleExport}
              className="rounded-[7px] border border-border bg-surface px-3 py-[7px] text-xs text-muted transition-colors hover:border-accent hover:text-ink"
            >
              Export CSV
            </button>
          )}
          <Button variant="primary" size="sm" onClick={() => setIsRuleModalOpen(true)}>
            + Add rule
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-panel border border-danger/30 bg-danger/10 p-4 text-xs text-danger"
        >
          <p className="font-semibold">Could not load alert rules</p>
          <p className="mt-1 text-danger/80">{error.message}</p>
        </div>
      )}

      {!isLoading && !error && rules.length === 0 && (
        <div className="rounded-panel border border-dashed border-border p-8 text-center text-sm text-muted">
          No alert rules yet. Create one to start watching for stale PRs, high-risk
          changes, or build failures.
        </div>
      )}

      {!isLoading && !error && rules.length > 0 && (
        <div className="overflow-x-auto rounded-panel border border-border bg-surface">
          <table className="w-full border-collapse text-left text-xs text-ink">
            <thead className="border-b border-border bg-surface-raised/60 font-semibold text-subtle">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Scope</th>
                <th className="px-4 py-3">Threshold</th>
                <th className="px-4 py-3">Slack channel</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {rules.map((rule) => (
                <tr key={rule.ruleId} className="transition-colors hover:bg-surface-raised/30">
                  <td className="px-4 py-3 font-bold">{rule.ruleType.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3 text-muted">
                    {rule.projectId === null ? "All projects" : `Project #${rule.projectId}`}
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {rule.thresholdHours === null ? "—" : `${rule.thresholdHours}h`}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px]">{rule.slackChannel ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={rule.active ? "success" : "default"}>
                      {rule.active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      disabled={isMutating}
                      onClick={() => onDeleteRule(rule.ruleId)}
                      className="cursor-pointer border-none bg-transparent text-xs font-medium text-danger hover:underline disabled:opacity-50"
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <FeatureUnavailable
        title="Triggered alert history is not available yet"
        message="notification-service stores rules but does not expose delivered alerts, so there is no history to show and nothing to acknowledge."
      />

      <AlertRuleModal
        isOpen={isRuleModalOpen}
        onClose={() => setIsRuleModalOpen(false)}
        onSubmitRule={onCreateRule}
        companyId={companyId}
        createdByUserId={currentUserId}
        isSubmitting={isMutating}
      />
    </div>
  );
}

export default AlertList;
