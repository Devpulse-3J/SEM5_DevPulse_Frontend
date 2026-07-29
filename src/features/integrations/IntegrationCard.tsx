"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface IntegrationCardProps {
  name: string;
  icon: string;
  description: string;
  connected: boolean;
  accountOrDomain?: string;
  connectedCountText?: string;
  lastSyncedAt?: string;
  onSync?: () => void;
  onConfigure?: () => void;
}

export function IntegrationCard({
  name,
  icon,
  description,
  connected,
  accountOrDomain,
  connectedCountText,
  lastSyncedAt,
  onSync,
  onConfigure,
}: IntegrationCardProps) {
  return (
    <Card className="flex flex-col justify-between gap-4 p-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <h3 className="text-base font-bold text-ink font-sans">{name}</h3>
          </div>
          <Badge variant={connected ? "success" : "default"}>
            {connected ? "Connected" : "Disconnected"}
          </Badge>
        </div>

        <p className="text-xs text-muted leading-relaxed">{description}</p>

        {connected && accountOrDomain && (
          <div className="flex flex-col gap-1 mt-1 p-2.5 rounded-card bg-surface-raised/40 border border-border/40 text-xs">
            <div className="flex justify-between">
              <span className="text-subtle">Account / Domain:</span>
              <span className="font-mono text-ink font-semibold">{accountOrDomain}</span>
            </div>
            {connectedCountText && (
              <div className="flex justify-between">
                <span className="text-subtle">Synced Entities:</span>
                <span className="font-mono text-ink font-semibold">{connectedCountText}</span>
              </div>
            )}
            {lastSyncedAt && (
              <div className="flex justify-between text-[11px] text-subtle">
                <span>Last Sync:</span>
                <span>{new Date(lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/40">
        {onConfigure && (
          <Button variant="secondary" size="sm" onClick={onConfigure}>
            Configure
          </Button>
        )}
        {connected && onSync && (
          <Button variant="ghost" size="sm" onClick={onSync}>
            Sync Now
          </Button>
        )}
      </div>
    </Card>
  );
}

export default IntegrationCard;
