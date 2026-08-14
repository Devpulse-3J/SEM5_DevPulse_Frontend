import { NotImplementedError } from "@/lib/errors";
import type { UserNotification } from "@/types/notification";

/**
 * User notifications — NO BACKEND.
 *
 * notification-service implements alert RULES only (see alert.service.ts). It
 * does not expose delivered notifications, read receipts, or history, so there
 * is nothing to list or mark read.
 */
const BLOCKED_ON = "a notification history endpoint";

export const notificationService = {
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
