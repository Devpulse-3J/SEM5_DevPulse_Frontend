"use client";

import { FeatureUnavailable } from "@/components/ui/FeatureUnavailable";

/** Jira integration — no /api/integrations/** route exists. */
export function JiraIntegration() {
  return (
    <FeatureUnavailable
      title="Jira integration is not available yet"
      message="Connecting Jira requires integration-service, which is not yet implemented."
    />
  );
}

export default JiraIntegration;
