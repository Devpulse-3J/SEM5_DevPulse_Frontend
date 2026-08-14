"use client";

import { FeatureUnavailable } from "@/components/ui/FeatureUnavailable";

/**
 * Developer overview.
 *
 * This screen was already hook-driven, but all three of its hooks
 * (useMyPullRequests, useAlerts, useRepositories) now resolve to the
 * unavailable state — there is no metrics-service, no integration-service, and
 * no alert-history endpoint. Rather than render three empty panels, the whole
 * screen states the reason once.
 */
export function DeveloperDashboard() {
  return (
    <FeatureUnavailable
      title="Your dashboard is not available yet"
      message="Pull requests, repositories, and triggered alerts require metrics-service, integration-service, and an alert history endpoint, none of which are implemented yet."
    />
  );
}

export default DeveloperDashboard;
