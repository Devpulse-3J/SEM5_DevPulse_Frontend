import { apiClient } from "./api-client";

/**
 * POST /api/webhooks/test-high-risk-alert → 200, no body, no token.
 *
 * Publishes a synthetic high-risk-PR event through RabbitMQ into the
 * notification pipeline. This is the only way to demonstrate the event
 * pipeline end to end, since nothing else produces events yet.
 */
export const webhookService = {
  async triggerHighRiskAlertDemo(): Promise<void> {
    await apiClient.post<void>("/api/webhooks/test-high-risk-alert", undefined, {
      requiresAuth: false,
    });
  },
};
