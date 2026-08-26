/**
 * Notification / alert types.
 *
 * `AlertRule` mirrors the real notification-service entity. It looks nothing
 * like the old design-spec shape (name/metric/condition/threshold/channels/
 * enabled) — that was written before the backend existed and none of those
 * fields are real.
 */

/** GET /api/alerts/rules — note `active`, NOT `isActive`. */
export interface AlertRule {
  ruleId: number;
  companyId: number;
  projectId: number | null;
  ruleType: string;
  thresholdHours: number | null;
  slackChannel: string | null;
  createdByUserId: number | null;
  /** ISO-8601 */
  createdAt: string;
  /** Soft-delete flag. DELETE sets this false rather than removing the row. */
  active: boolean;
}

/**
 * POST /api/alerts/rules body.
 *
 * The endpoint takes the raw entity, so it would happily accept `ruleId` and
 * `createdAt` too — we deliberately do not send them and let the server own
 * identity and timestamps.
 */
export interface CreateAlertRuleRequest {
  companyId: number;
  projectId: number | null;
  ruleType: string;
  thresholdHours: number | null;
  slackChannel: string | null;
  createdByUserId: number | null;
}

/**
 * Rule types the UI offers. The backend column is a free-form string, so this
 * is a frontend convention rather than a server-enforced enum — adding one here
 * does not make the backend act on it.
 */
export const ALERT_RULE_TYPES = [
  "STALE_PR",
  "HIGH_RISK_PR",
  "BUILD_FAILURE",
  "REVIEW_BOTTLENECK",
] as const;

export type AlertRuleType = (typeof ALERT_RULE_TYPES)[number];

// ─────────────────────────────────────────────────────────────────────────────
// Below: shapes with NO backing endpoint.
//
// There is no alert-history, acknowledge, or delivered-notification API. These
// remain declared only so the components that render them keep typechecking
// while they show their unavailable state. Do not add a service that "fetches"
// them — nothing serves these.
// ─────────────────────────────────────────────────────────────────────────────

export type AlertSeverity = "INFO" | "WARNING" | "HIGH" | "CRITICAL";

/** NOT SERVED by any endpoint. */
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

/** NOT SERVED by any endpoint. */
export interface UserNotification {
  id: string;
  title: string;
  message: string;
  type: "ALERT" | "PR_ASSIGNED" | "PR_REVIEW_REQUESTED" | "BUILD_FAILED" | "SYSTEM";
  read: boolean;
  timestamp: string;
  link?: string;
}
