import { apiClient } from "./api-client";
import type { AlertRule, CreateAlertRuleRequest } from "@/types/notification";

/**
 * Alert rules — one of the few fully implemented resources.
 *
 * What does NOT exist, and so is absent here: alert *history*, acknowledging an
 * alert, and delivered-notification listing. Those were in the design spec but
 * have no handler.
 */
export const alertService = {
  /** GET /api/alerts/rules?companyId=<n> — active rules only. */
  async getAlertRules(companyId: number): Promise<AlertRule[]> {
    return apiClient.get<AlertRule[]>("/api/alerts/rules", {
      params: { companyId },
    });
  },

  /** GET /api/alerts/rules/{id} → 200 | 404 */
  async getAlertRule(ruleId: number): Promise<AlertRule> {
    return apiClient.get<AlertRule>(`/api/alerts/rules/${ruleId}`);
  },

  /** POST /api/alerts/rules → 201 */
  async createAlertRule(rule: CreateAlertRuleRequest): Promise<AlertRule> {
    return apiClient.post<AlertRule>("/api/alerts/rules", rule);
  },

  /** DELETE /api/alerts/rules/{id} → 204 | 404. Soft delete: sets active=false. */
  async deleteAlertRule(ruleId: number): Promise<void> {
    await apiClient.delete<void>(`/api/alerts/rules/${ruleId}`);
  },
};
