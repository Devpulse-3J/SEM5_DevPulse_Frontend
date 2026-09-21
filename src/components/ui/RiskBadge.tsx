"use client";

import * as React from "react";
import type { PRRiskAnalysis } from "@/types/pullRequest";
import { riskPresentation } from "@/lib/risk";
import { Badge } from "./Badge";

export interface RiskBadgeProps {
  /** The pull request's latest prediction, or null if it has not been scored. */
  risk: PRRiskAnalysis | null | undefined;
}

/** "High risk · 79%", "Medium risk · 43%", "Low risk · 12%" or "Not scored". */
export function RiskBadge({ risk }: RiskBadgeProps) {
  const view = riskPresentation(risk);
  return (
    <Badge variant={view.variant} title={view.tooltip} className="whitespace-nowrap">
      {view.label}
    </Badge>
  );
}

export default RiskBadge;
