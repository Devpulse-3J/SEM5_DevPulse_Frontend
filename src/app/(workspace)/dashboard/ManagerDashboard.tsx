"use client";

import { FeatureUnavailable } from "@/components/ui/FeatureUnavailable";

/**
 * Manager overview.
 *
 * Everything this screen showed — DORA cards, lead-time trend, deploys by repo,
 * the high-risk PR table — came from hardcoded arrays, not from an API. They
 * have been removed rather than left in place: a dashboard that looks real but
 * reports invented numbers is worse than an honest empty one.
 */
export function ManagerDashboard() {
  return (
    <FeatureUnavailable
      title="Manager metrics are not available yet"
      message="DORA metrics, deployment stats, and PR risk scoring require metrics-service and analytics-service, which are not yet implemented."
    />
  );
}

export default ManagerDashboard;
