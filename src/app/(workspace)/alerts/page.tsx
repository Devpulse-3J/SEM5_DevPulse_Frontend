"use client";

import React from "react";
import { SharedDashboard } from "../dashboard/SharedDashboard";
import { AlertList } from "@/features/alerts/AlertList";
import { FeatureUnavailable } from "@/components/ui/FeatureUnavailable";
import { useAuth } from "@/hooks/useAuth";
import {
  useAlertRules,
  useCreateAlertRule,
  useDeleteAlertRule,
} from "@/hooks/useAlerts";

export default function AlertsPage() {
  // companyId comes from GET /api/auth/me — never hardcoded.
  const { companyId, user } = useAuth();
  const currentUserId = user?.userId ?? null;

  const { data: rules = [], isLoading, error } = useAlertRules(companyId);
  const createRule = useCreateAlertRule(companyId);
  const deleteRule = useDeleteAlertRule(companyId);

  return (
    <SharedDashboard
      title="Alert rules"
      subtitle="Conditions that trigger Slack notifications"
    >
      {companyId === undefined ? (
        <FeatureUnavailable
          title="No company on your account"
          message="Alert rules are scoped to a company, and your profile does not report one. Register a company account or ask an admin to add you to one."
        />
      ) : (
        <AlertList
          rules={rules}
          companyId={companyId}
          currentUserId={currentUserId}
          isLoading={isLoading}
          error={error as Error | null}
          onCreateRule={(rule) => createRule.mutate(rule)}
          onDeleteRule={(ruleId) => deleteRule.mutate(ruleId)}
          isMutating={createRule.isPending || deleteRule.isPending}
        />
      )}
    </SharedDashboard>
  );
}
