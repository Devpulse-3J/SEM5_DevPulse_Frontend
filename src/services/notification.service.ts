import { NotImplementedError } from "@/lib/errors";
import { apiClient } from "@/services/api-client";
import type { UserNotification } from "@/types/notification";

export interface TeamMessageRecipient {
  userId: string;
  email: string;
  name: string;
}

export interface SendTeamMessageRequest {
  projectId: string;
  channel: "EMAIL" | "SLACK";
  recipients: TeamMessageRecipient[];
  subject?: string;
  message: string;
  slackChannel?: string;
}

export interface SendTeamMessageResponse {
  attempted: number;
  delivered: number;
  failed: number;
}

/**
 * User notifications — NO BACKEND.
 *
 * notification-service implements alert RULES only (see alert.service.ts). It
 * does not expose delivered notifications, read receipts, or history, so there
 * is nothing to list or mark read.
 */
const BLOCKED_ON = "a notification history endpoint";

export const notificationService = {
  async sendTeamMessage(
    data: SendTeamMessageRequest
  ): Promise<SendTeamMessageResponse> {
    return apiClient.post<SendTeamMessageResponse>(
      "/api/notifications/team-message",
      data
    );
  },

  async getNotifications(): Promise<UserNotification[]> {
    throw new NotImplementedError("Notifications", BLOCKED_ON);
  },

  async markAsRead(_id: string): Promise<void> {
    void _id;
    throw new NotImplementedError("Marking notifications read", BLOCKED_ON);
  },

  async markAllAsRead(): Promise<void> {
    throw new NotImplementedError("Marking notifications read", BLOCKED_ON);
  },
};
