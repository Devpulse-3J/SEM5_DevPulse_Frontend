"use client";

import React, { useEffect, useState, useCallback } from "react";
import { FaCheckCircle, FaExclamationCircle, FaUnlink } from "react-icons/fa";
import { Badge } from "@/components/ui/Badge";
import { integrationsApiService, JiraOAuthStatusResponse } from "@/services/api/integrations";

interface JiraOAuthButtonProps {
  onStatusChange?: (status: JiraOAuthStatusResponse) => void;
  className?: string;
}

export function JiraOAuthButton({ onStatusChange, className = "" }: JiraOAuthButtonProps) {
  const [status, setStatus] = useState<JiraOAuthStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const checkStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await integrationsApiService.getJiraOAuthStatus();
      setStatus(res);
      onStatusChange?.(res);
    } catch {
      const defaultState = { connected: false };
      setStatus(defaultState);
      onStatusChange?.(defaultState);
    } finally {
      setLoading(false);
    }
  }, [onStatusChange]);

  useEffect(() => {
    void checkStatus();
  }, [checkStatus]);

  const handleConnect = async () => {
    try {
      const installUrl = await integrationsApiService.getJiraOAuthInstallUrl();
      if (installUrl) {
        window.location.href = installUrl;
      }
    } catch (error) {
      console.error("Failed to initiate Jira OAuth:", error);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await integrationsApiService.disconnectJira();
      await checkStatus();
    } finally {
      setIsDisconnecting(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center gap-3 animate-pulse ${className}`}>
        <div className="h-9 w-44 rounded-lg bg-surface-raised border border-border" />
      </div>
    );
  }

  const isConnected = status?.connected ?? false;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {isConnected ? (
            <button
              type="button"
              onClick={handleDisconnect}
              disabled={isDisconnecting}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-raised px-3.5 py-2 text-xs font-semibold text-ink transition hover:border-danger/40 hover:text-danger cursor-pointer"
            >
              <FaUnlink className="h-3.5 w-3.5" />
              {isDisconnecting ? "Disconnecting…" : "Disconnect Workspace"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConnect}
              className="inline-flex items-center gap-2.5 rounded-lg bg-[#0052CC] hover:bg-[#0047B3] text-white px-4 py-2 text-xs font-semibold shadow-sm transition cursor-pointer"
            >
              {/* Atlassian Official Logo SVG */}
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M11.53 2c-.39 0-.74.22-.9.56L6.15 11.83a.47.47 0 0 0 .43.67h5.18c.28 0 .52-.16.63-.42l2.42-5.46a.47.47 0 0 0-.43-.66h-2.88zm.94 9.5a.47.47 0 0 0-.43.67l4.48 9.27c.16.34.51.56.9.56h5.43c.39 0 .74-.22.9-.56l-4.48-9.27a.47.47 0 0 0-.43-.67h-6.37z" />
              </svg>
              Connect Jira Workspace (3LO)
            </button>
          )}
        </div>

        {isConnected ? (
          <Badge variant="success" className="flex items-center gap-1">
            <FaCheckCircle className="h-3 w-3" /> Connected to Jira Cloud
          </Badge>
        ) : (
          <Badge variant="warning" className="flex items-center gap-1">
            <FaExclamationCircle className="h-3 w-3" /> Not Connected
          </Badge>
        )}
      </div>

      {isConnected && (status?.siteName || status?.cloudId) && (
        <div className="flex items-center gap-4 rounded-lg border border-border/80 bg-surface-raised px-3.5 py-2.5 text-xs text-subtle">
          {status.siteName && (
            <div>
              <span className="text-muted block text-[10px] uppercase tracking-wider font-semibold">Site Name</span>
              <span className="font-semibold text-ink">{status.siteName}</span>
            </div>
          )}
          {status.cloudId && (
            <div className="border-l border-border pl-4">
              <span className="text-muted block text-[10px] uppercase tracking-wider font-semibold">Cloud ID</span>
              <span className="font-mono text-ink text-[11px]">{status.cloudId}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default JiraOAuthButton;
