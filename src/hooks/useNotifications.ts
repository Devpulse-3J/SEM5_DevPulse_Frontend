import { unavailable } from "@/lib/errors";

/**
 * Notification hooks — notification-service exposes alert RULES only
 * (see useAlerts), not delivered notifications.
 */
const BLOCKED_ON = "a notification history endpoint";

export function useNotifications() {
  return unavailable("Notifications", BLOCKED_ON);
}

export function useMarkNotificationRead() {
  return {
    ...unavailable("Marking notifications read", BLOCKED_ON),
    mutate: () => undefined,
    isPending: false as const,
  };
}

export function useMarkAllNotificationsRead() {
  return {
    ...unavailable("Marking notifications read", BLOCKED_ON),
    mutate: () => undefined,
    isPending: false as const,
  };
}
