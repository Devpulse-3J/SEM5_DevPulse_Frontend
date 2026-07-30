"use client";

import React from "react";
import { SharedDashboard } from "../dashboard/SharedDashboard";
import { AlertList } from "@/features/alerts/AlertList";
import {
  useAlerts,
  useAlertRules,
  useAcknowledgeAlert,
  useCreateAlertRule,
} from "@/hooks/useAlerts";

export default function AlertsPage() {
  const { data: alerts = [], isLoading: isLoadingAlerts } = useAlerts();
  const { data: rules = [], isLoading: isLoadingRules } = useAlertRules();
  const ackMutation = useAcknowledgeAlert();
  const createRuleMutation = useCreateAlertRule();

  const handleAcknowledge = (id: string) => {
    ackMutation.mutate(id);
  };

  const handleCreateRule = (ruleData: Parameters<typeof createRuleMutation.mutate>[0]) => {
    createRuleMutation.mutate(ruleData);
  };

  return (
    <SharedDashboard
      title="Alerts & Notification Rules"
      subtitle="Real-time productivity thresholds, risk alerts, and automated notifications"
    >
      {isLoadingAlerts || isLoadingRules ? (
        <div className="p-8 text-center text-xs text-subtle">Loading alerts & rules...</div>
      ) : (
        <AlertList
          alerts={alerts}
          rules={rules}
          onAcknowledgeAlert={handleAcknowledge}
          onCreateRule={handleCreateRule}
        />
      )}
    </SharedDashboard>
  );
}
