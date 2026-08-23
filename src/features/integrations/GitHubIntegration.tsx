"use client";

import { FeatureUnavailable } from "@/components/ui/FeatureUnavailable";

/**
 * GitHub integration — no backend.
 *
 * There is no /api/integrations/** route, and no connect URL to link to either:
 * the GitHub App identity lives server-side, so the client cannot build an
 * install link without hardcoding an app slug that may not be correct.
 */
export function GitHubIntegration() {
  return (
    <FeatureUnavailable
      title="GitHub integration is not available yet"
      message="Connecting GitHub requires integration-service, which is not yet implemented."
    />
  );
}

export default GitHubIntegration;
