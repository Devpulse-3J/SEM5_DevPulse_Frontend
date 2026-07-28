export type AlertSeverity = "INFO" | "WARNING" | "HIGH" | "CRITICAL";

export interface AlertRule {
  id: string;
  name: string;
  metric: "lead_time" | "failed_deployments" | "pr_risk" | "stale_pr" | "coverage_drop";
  threshold: number;
  condition: "ABOVE" | "BELOW" | "EQUALS";
  channels: ("slack" | "email" | "in_app")[];
  enabled: boolean;
  createdAt: string;
}

export interface SystemAlert {
  id: string;
  ruleId?: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  repositoryName?: string;
  targetUrl?: string;
  timestamp: string;
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  type: "ALERT" | "PR_ASSIGNED" | "PR_REVIEW_REQUESTED" | "BUILD_FAILED" | "SYSTEM";
  read: boolean;
  timestamp: string;
  link?: string;
}
