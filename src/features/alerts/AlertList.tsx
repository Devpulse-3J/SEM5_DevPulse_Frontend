"use client";

import React, { useState } from "react";
import type { SystemAlert, AlertRule, AlertSeverity } from "@/types/notification";
import { AlertCard } from "@/components/notifications/AlertCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AlertRuleModal } from "./AlertRuleModal";
import { exportToCSV } from "@/utils/exportCSV";

interface AlertListProps {
  alerts: SystemAlert[];
  rules: AlertRule[];
  onAcknowledgeAlert?: (id: string) => void;
  onCreateRule?: (rule: Omit<AlertRule, "id" | "createdAt">) => void;
}

export function AlertList({
  alerts,
  rules,
  onAcknowledgeAlert,
  onCreateRule,
}: AlertListProps) {
  const [activeTab, setActiveTab] = useState<"alerts" | "rules">("alerts");
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | "ALL">("ALL");
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(search.toLowerCase()) ||
      alert.message.toLowerCase().includes(search.toLowerCase()) ||
      (alert.repositoryName && alert.repositoryName.toLowerCase().includes(search.toLowerCase()));
    const matchesSeverity = severityFilter === "ALL" || alert.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const handleExport = () => {
    const rows = filteredAlerts.map((a) => ({
      ID: a.id,
      Title: a.title,
      Severity: a.severity,
      Repository: a.repositoryName || "N/A",
      Message: a.message,
      Timestamp: a.timestamp,
      IsAcknowledged: a.isAcknowledged,
    }));
    exportToCSV("system_alerts_export", rows);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header controls & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("alerts")}
            className={`px-4 py-2 text-xs font-bold rounded-[7px] transition-colors ${
              activeTab === "alerts"
                ? "bg-accent text-canvas"
                : "bg-surface text-muted hover:text-ink"
            }`}
          >
            Active Alerts ({alerts.filter((a) => !a.isAcknowledged).length})
          </button>
          <button
            onClick={() => setActiveTab("rules")}
            className={`px-4 py-2 text-xs font-bold rounded-[7px] transition-colors ${
              activeTab === "rules"
                ? "bg-accent text-canvas"
                : "bg-surface text-muted hover:text-ink"
            }`}
          >
            Configured Rules ({rules.length})
          </button>
        </div>

        {activeTab === "alerts" ? (
          <button
            onClick={handleExport}
            className="rounded-[7px] border border-border bg-surface px-3 py-[7px] text-xs text-muted hover:text-ink hover:border-accent transition-colors"
          >
            📥 Export CSV
          </button>
        ) : (
          <Button variant="primary" size="sm" onClick={() => setIsRuleModalOpen(true)}>
            + Add Threshold Rule
          </Button>
        )}
      </div>

      {activeTab === "alerts" ? (
        <div className="flex flex-col gap-4">
          {/* Search & Severity Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[240px]">
              <Input
                type="text"
                placeholder="Search alerts by title, repo, or message..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as AlertSeverity | "ALL")}
              className="rounded-[7px] border border-border bg-surface px-3 py-[7px] text-xs text-ink focus:outline-none focus:border-accent"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="WARNING">Warning</option>
              <option value="INFO">Info</option>
            </select>
          </div>

          {/* Alert Stream */}
          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-border rounded-panel text-muted text-sm">
              No alerts match your filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onAcknowledge={onAcknowledgeAlert}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Rules Table */
        <div className="flex flex-col gap-4">
          <div className="rounded-panel border border-border bg-surface overflow-hidden">
            <table className="w-full text-left text-xs text-ink border-collapse">
              <thead className="bg-surface-raised/60 text-subtle font-semibold border-b border-border">
                <tr>
                  <th className="py-3 px-4">Rule Name</th>
                  <th className="py-3 px-4">Metric</th>
                  <th className="py-3 px-4">Condition</th>
                  <th className="py-3 px-4">Threshold</th>
                  <th className="py-3 px-4">Channels</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {rules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-surface-raised/30 transition-colors">
                    <td className="py-3 px-4 font-bold">{rule.name}</td>
                    <td className="py-3 px-4 font-mono text-muted">{rule.metric}</td>
                    <td className="py-3 px-4">{rule.condition}</td>
                    <td className="py-3 px-4 font-bold text-accent">{rule.threshold}</td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      {rule.channels.join(", ")}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Badge variant={rule.enabled ? "success" : "default"}>
                        {rule.enabled ? "Active" : "Disabled"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {onCreateRule && (
        <AlertRuleModal
          isOpen={isRuleModalOpen}
          onClose={() => setIsRuleModalOpen(false)}
          onSubmitRule={onCreateRule}
        />
      )}
    </div>
  );
}

export default AlertList;
