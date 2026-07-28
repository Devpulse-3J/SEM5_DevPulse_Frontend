"use client";

import React from "react";
import type { PullRequest, PRRiskLevel } from "@/types/pullRequest";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface PRRiskCardProps {
  pullRequest: PullRequest;
}

const riskVariantMap: Record<PRRiskLevel, "danger" | "warning" | "info" | "success"> = {
  CRITICAL: "danger",
  HIGH: "danger",
  MEDIUM: "warning",
  LOW: "success",
};

export function PRRiskCard({ pullRequest }: PRRiskCardProps) {
  const { riskAnalysis } = pullRequest;

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-ink">PR #{pullRequest.number} Risk Report</span>
          <Badge variant={riskVariantMap[riskAnalysis.riskLevel]}>
            {riskAnalysis.riskLevel} ({riskAnalysis.riskScore}/100)
          </Badge>
        </div>
        <span className="text-xs font-mono text-muted">{pullRequest.repositoryName}</span>
      </div>

      <p className="text-xs text-muted leading-relaxed">{riskAnalysis.summary}</p>

      {/* Risk Factors */}
      {riskAnalysis.factors && riskAnalysis.factors.length > 0 && (
        <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
          <span className="text-xs font-semibold text-ink">Identified Risk Factors</span>
          <div className="flex flex-col gap-2">
            {riskAnalysis.factors.map((factor, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-card bg-surface-raised/50 text-xs border border-border/40"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-ink">{factor.category}</span>
                  <span className="text-subtle text-[11px]">{factor.description}</span>
                </div>
                <span className="font-bold text-danger">+{factor.impactScore} pts</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

export default PRRiskCard;
