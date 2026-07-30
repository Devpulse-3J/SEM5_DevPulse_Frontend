"use client";

import React from "react";
import type { UserNotification } from "@/types/notification";
import { Badge } from "@/components/ui/Badge";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: UserNotification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllRead?: () => void;
}

export function NotificationDrawer({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllRead,
}: NotificationDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-canvas/60 backdrop-blur-xs">
      <div className="flex flex-col w-full max-w-sm h-full bg-surface border-l border-border shadow-2xl p-5 gap-4">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-ink">Notifications</h3>
            <Badge variant="info">
              {notifications.filter((n) => !n.read).length} Unread
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {onMarkAllRead && (
              <button
                onClick={onMarkAllRead}
                className="text-xs text-accent hover:underline"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="text-subtle hover:text-ink text-sm font-bold px-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Notification Stream */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-subtle">
              No notifications at this time.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onMarkAsRead && onMarkAsRead(n.id)}
                className={`p-3 rounded-panel border transition-all cursor-pointer ${
                  n.read
                    ? "border-border/40 bg-surface/30 opacity-70"
                    : "border-accent/40 bg-surface-raised/80 shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-subtle mb-1">
                  <span className="font-semibold text-accent">{n.type}</span>
                  <span>{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <h5 className="text-xs font-bold text-ink">{n.title}</h5>
                <p className="text-xs text-muted mt-0.5 leading-relaxed">{n.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationDrawer;
