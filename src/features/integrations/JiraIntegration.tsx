"use client";

import React, { useState } from "react";
import { IntegrationCard } from "./IntegrationCard";
import { jiraService } from "@/services/jira.service";

export function JiraIntegration() {
  const [status, setStatus] = useState({
    connected: true,
    domain: "odineye.atlassian.net",
    linkedIssuesCount: 48,
    lastSyncedAt: new Date().toISOString(),
  });

  const handleSync = async () => {
    await jiraService.triggerSync();
    setStatus((prev) => ({ ...prev, lastSyncedAt: new Date().toISOString() }));
  };

  return (
    <IntegrationCard
      name="Jira Software"
      icon="🔹"
      description="Link Jira ticket IDs with pull requests to track cycle time, ticket scope creep, and bug resolution velocity."
      connected={status.connected}
      accountOrDomain={status.domain}
      connectedCountText={`${status.linkedIssuesCount} Tickets Synced`}
      lastSyncedAt={status.lastSyncedAt}
      onSync={handleSync}
    />
  );
}

export default JiraIntegration;
