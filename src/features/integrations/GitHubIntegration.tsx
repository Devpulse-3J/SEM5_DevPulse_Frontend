"use client";

import React, { useState } from "react";
import { IntegrationCard } from "./IntegrationCard";
import { githubService } from "@/services/github.service";

export function GitHubIntegration() {
  const [status, setStatus] = useState({
    connected: true,
    accountName: "OdinEyeOrg",
    connectedReposCount: 12,
    lastSyncedAt: new Date().toISOString(),
  });

  const handleSync = async () => {
    await githubService.triggerSync();
    setStatus((prev) => ({ ...prev, lastSyncedAt: new Date().toISOString() }));
  };

  const handleConfigure = () => {
    window.open(githubService.getConnectUrl(), "_blank");
  };

  return (
    <IntegrationCard
      name="GitHub Integration"
      icon="🐙"
      description="Connect GitHub repositories to track PR risks, reviewer velocity, and automated CI check status."
      connected={status.connected}
      accountOrDomain={status.accountName}
      connectedCountText={`${status.connectedReposCount} Repositories`}
      lastSyncedAt={status.lastSyncedAt}
      onSync={handleSync}
      onConfigure={handleConfigure}
    />
  );
}

export default GitHubIntegration;
