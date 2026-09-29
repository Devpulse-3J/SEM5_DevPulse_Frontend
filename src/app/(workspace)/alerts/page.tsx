"use client";

import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
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
  const activeProject = useSelector((s: RootState) => s.dashboard.activeProject);

  const rawRole = String(activeProject?.role || "").toUpperCase();
  const isManagerOrAdmin =
    rawRole === "MANAGER" || rawRole === "ADMIN" || user?.systemRole === "admin";

  const { data: rules = [], isLoading, error } = useAlertRules(companyId);
  const createRule = useCreateAlertRule(companyId);
  const deleteRule = useDeleteAlertRule(companyId);

  if (!isManagerOrAdmin) {
    return (
      <SharedDashboard
        title="Alert rules"
        subtitle="Conditions that trigger Slack notifications"
      >
        <FeatureUnavailable
          title="Alert Configuration Restricted"
          message="Alert rules are managed by team managers and system administrators. Developers do not configure or manage alert rules."
        />
      </SharedDashboard>
    );
  }

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
