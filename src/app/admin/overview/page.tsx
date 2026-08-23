"use client";

import { FeatureUnavailable } from "@/components/ui/FeatureUnavailable";
import { useAuth } from "@/hooks/useAuth";

export default function AdminOverviewPage() {
  const { user, companyId } = useAuth();
  const companyName =
    user && "companyName" in user ? (user.companyName as string | undefined) : undefined;

  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="mb-0.5 text-xl font-bold">Admin Overview</h1>
        <p className="text-xs text-subtle">
          {companyName ? `${companyName} · company #${companyId}` : "Organisation summary"}
        </p>
      </div>

      {/* Org stats and the activity feed were hardcoded arrays. There is no
          endpoint that counts projects, members, or integrations. */}
      <FeatureUnavailable
        title="Organisation statistics are not available yet"
        message="Project, member, and integration counts require endpoints that are not implemented. Your own profile is available from /api/auth/me."
      />
    </div>
  );
}
