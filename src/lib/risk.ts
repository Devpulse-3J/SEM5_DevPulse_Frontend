import type { PRRiskAnalysis } from "@/types/pullRequest";

export type RiskBadgeVariant = "default" | "success" | "warning" | "danger";

export interface RiskPresentation {
  /** Short text for the badge, e.g. "High risk · 79%". */
  label: string;
  variant: RiskBadgeVariant;
  /** True for high and critical: the PRs worth a second look. */
  risky: boolean;
  /** Hover text with the model's own summary and when it was scored. */
  tooltip: string;
}

/**
 * How a pull request's prediction is shown next to it in a list. A PR the
 * model has not scored yet reads "Not scored" rather than a guessed value.
 *
 * The score is the model's estimated chance the PR goes stale, as a
 * percentage; the level is the bucket it fell into.
 */
export function riskPresentation(
  risk: PRRiskAnalysis | null | undefined,
): RiskPresentation {
  if (!risk) {
    return {
      label: "Not scored",
      variant: "default",
      risky: false,
      tooltip: "This pull request has not been scored yet.",
    };
  }

  const percent = `${Math.round(risk.riskScore)}%`;
  let name: string;
  let variant: RiskBadgeVariant;
  let risky = false;

  switch (risk.riskLevel) {
    case "CRITICAL":
    case "HIGH":
      name = risk.riskLevel === "CRITICAL" ? "Critical risk" : "High risk";
      variant = "danger";
      risky = true;
      break;
    case "MEDIUM":
      name = "Medium risk";
      variant = "warning";
      break;
    default:
      name = "Low risk";
      variant = "success";
  }

  const details: string[] = [risk.summary];
  if (risk.algorithm) {
    details.push(`Model: ${risk.algorithm}${risk.modelVersion ? ` v${risk.modelVersion}` : ""}`);
  }
  if (risk.predictedAt) {
    details.push(`Scored: ${new Date(risk.predictedAt).toLocaleString()}`);
  }

  return {
    label: `${name} · ${percent}`,
    variant,
    risky,
    tooltip: details.filter(Boolean).join("\n"),
  };
}
