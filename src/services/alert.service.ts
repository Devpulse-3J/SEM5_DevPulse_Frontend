import type { AlertRule, SystemAlert } from "@/types/notification";

const MOCK_RULES: AlertRule[] = [
  {
    id: "rule-1",
    name: "High PR Risk Threshold",
    metric: "pr_risk",
    threshold: 75,
    condition: "ABOVE",
    channels: ["slack", "in_app"],
    enabled: true,
    createdAt: "2025-01-15T08:00:00Z",
  },
  {
    id: "rule-2",
    name: "Stale PR Detection (>3 Days)",
    metric: "stale_pr",
    threshold: 72, // hours
    condition: "ABOVE",
    channels: ["email", "in_app"],
    enabled: true,
    createdAt: "2025-01-20T10:30:00Z",
  },
  {
    id: "rule-3",
    name: "Code Coverage Drop Alert",
    metric: "coverage_drop",
    threshold: 5, // percentage points
    condition: "ABOVE",
    channels: ["slack"],
    enabled: false,
    createdAt: "2025-02-01T14:00:00Z",
  },
];

const MOCK_ALERTS: SystemAlert[] = [
  {
    id: "alt-101",
    ruleId: "rule-1",
    title: "High Risk Score Detected on PR #142",
    message: "PR #142 (auth-service) scored a risk factor of 84/100 due to extensive changes in token verification security logic.",
    severity: "HIGH",
    repositoryName: "auth-service",
    targetUrl: "/my-prs",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    isAcknowledged: false,
  },
  {
    id: "alt-102",
    ruleId: "rule-2",
    title: "Stale Review Pending on PR #88",
    message: "PR #88 (metrics-pipeline) has been awaiting approval for over 72 hours.",
    severity: "WARNING",
    repositoryName: "metrics-pipeline",
    targetUrl: "/my-prs",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    isAcknowledged: false,
  },
  {
    id: "alt-103",
    title: "CI Pipeline Failure in main branch",
    message: "Integration tests failed on commit a1b2c3d in auth-service.",
    severity: "CRITICAL",
    repositoryName: "auth-service",
    targetUrl: "/repositories/repo-1",
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    isAcknowledged: true,
    acknowledgedBy: "Alex Developer",
    acknowledgedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
  },
];

export const alertService = {
  async getAlerts(): Promise<SystemAlert[]> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!baseUrl) return MOCK_ALERTS;

      const res = await fetch(`${baseUrl}/api/notifications/history`);
      if (!res.ok) throw new Error("Failed to fetch alert history");
      return await res.json();
    } catch {
      return MOCK_ALERTS;
    }
  },

  async getAlertRules(): Promise<AlertRule[]> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!baseUrl) return MOCK_RULES;

      const res = await fetch(`${baseUrl}/api/notifications/rules`);
      if (!res.ok) throw new Error("Failed to fetch alert rules");
      return await res.json();
    } catch {
      return MOCK_RULES;
    }
  },

  async acknowledgeAlert(alertId: string): Promise<SystemAlert> {
    const alert = MOCK_ALERTS.find((a) => a.id === alertId);
    if (alert) {
      alert.isAcknowledged = true;
      alert.acknowledgedBy = "You";
      alert.acknowledgedAt = new Date().toISOString();
      return alert;
    }
    return {
      id: alertId,
      title: "Alert Acknowledged",
      message: "Alert marked as acknowledged.",
      severity: "INFO",
      timestamp: new Date().toISOString(),
      isAcknowledged: true,
    };
  },

  async createAlertRule(rule: Omit<AlertRule, "id" | "createdAt">): Promise<AlertRule> {
    const newRule: AlertRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    MOCK_RULES.unshift(newRule);
    return newRule;
  },
};
