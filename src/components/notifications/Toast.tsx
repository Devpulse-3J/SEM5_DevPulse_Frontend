"use client";

import React, { useEffect } from "react";
import type { ToastMessage } from "@/store/notificationSlice";

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.durationMs || 4000);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const borderColors = {
    success: "border-success bg-surface-raised text-ink",
    error: "border-danger bg-surface-raised text-ink",
    warning: "border-warning bg-surface-raised text-ink",
    info: "border-accent bg-surface-raised text-ink",
  };

  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-card border-l-4 p-3 shadow-lg backdrop-blur-md transition-all ${
        borderColors[toast.type]
      }`}
    >
      <div>
        <h5 className="text-xs font-bold text-ink">{toast.title}</h5>
        <p className="mt-0.5 text-xs text-muted">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-subtle hover:text-ink text-xs font-bold px-1"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;
