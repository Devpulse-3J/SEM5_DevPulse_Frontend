"use client";

import React from "react";
import type { SystemAlert, AlertSeverity } from "@/types/notification";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface AlertCardProps {
  alert: SystemAlert;
  onAcknowledge?: (id: string) => void;
  onViewDetails?: (targetUrl?: string) => void;
}

const severityBadgeMap: Record<AlertSeverity, { variant: "danger" | "warning" | "info" | "success"; label: string }> = {
  CRITICAL: { variant: "danger", label: "Critical" },
  HIGH: { variant: "danger", label: "High Risk" },
  WARNING: { variant: "warning", label: "Warning" },
  INFO: { variant: "info", label: "Info" },
};

export function AlertCard({ alert, onAcknowledge, onViewDetails }: AlertCardProps) {
  const badgeConfig = severityBadgeMap[alert.severity] || severityBadgeMap.INFO;

  return (
    <div
      className={`relative flex flex-col gap-3 rounded-panel border p-4 transition-all ${
        alert.isAcknowledged
          ? "border-border/50 bg-surface/40 opacity-75"
          : "border-border bg-surface shadow-sm hover:border-accent/40"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge variant={badgeConfig.variant}>{badgeConfig.label}</Badge>
          {alert.repositoryName && (
            <span className="font-mono text-xs text-muted">
              {alert.repositoryName}
            </span>
          )}
        </div>
        <span className="text-xs text-subtle">
          {new Date(alert.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-ink">{alert.title}</h4>
        <p className="mt-1 text-xs text-muted leading-relaxed">{alert.message}</p>
      </div>

      <div className="flex items-center justify-between pt-1 text-xs">
        {alert.isAcknowledged ? (
          <span className="text-subtle italic">
            ✓ Acknowledged {alert.acknowledgedBy ? `by ${alert.acknowledgedBy}` : ""}
          </span>
        ) : (
          <div className="flex gap-2">
            {onAcknowledge && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onAcknowledge(alert.id)}
              >
                Acknowledge
              </Button>
            )}
            {onViewDetails && alert.targetUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetails(alert.targetUrl)}
              >
                Inspect
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AlertCard;
