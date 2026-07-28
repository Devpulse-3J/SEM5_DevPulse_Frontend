import type { UserNotification } from "@/types/notification";

const MOCK_NOTIFICATIONS: UserNotification[] = [
  {
    id: "notif-1",
    title: "New Review Requested",
    message: "Sarah requested your review on PR #145: 'feat: add rate limiting'",
    type: "PR_REVIEW_REQUESTED",
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    link: "/my-prs",
  },
  {
    id: "notif-2",
    title: "PR Approved",
    message: "Michael approved your PR #142: 'refactor JWT token parsing'",
    type: "PR_ASSIGNED",
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    link: "/my-prs",
  },
  {
    id: "notif-3",
    title: "CI Pipeline Alert",
    message: "Build #891 failed on metrics-pipeline branch feature/dora-calc",
    type: "BUILD_FAILED",
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    link: "/repositories/repo-2",
  },
];

export const notificationService = {
  async getNotifications(): Promise<UserNotification[]> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!baseUrl) return MOCK_NOTIFICATIONS;

      const res = await fetch(`${baseUrl}/api/notifications`);
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return await res.json();
    } catch {
      return MOCK_NOTIFICATIONS;
    }
  },

  async markAsRead(id: string): Promise<boolean> {
    const item = MOCK_NOTIFICATIONS.find((n) => n.id === id);
    if (item) item.read = true;
    return true;
  },

  async markAllAsRead(): Promise<boolean> {
    MOCK_NOTIFICATIONS.forEach((n) => (n.read = true));
    return true;
  },
};
