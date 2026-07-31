// OWNER: Person B — maps domain values to color tokens / Tailwind classes.
import { chart } from "@/styles/theme";

export type Severity = "good" | "warn" | "bad";

/** Chart.js / inline-style color strings. */
export const severityColor: Record<Severity, string> = {
  good: chart.success,
  warn: chart.warning,
  bad: chart.danger,
};

/** Tailwind text classes (for JSX className). */
export const severityText: Record<Severity, string> = {
  good: "text-success",
  warn: "text-warning",
  bad: "text-danger",
};

/** Tailwind background classes (bars, dots). */
export const severityBg: Record<Severity, string> = {
  good: "bg-success",
  warn: "bg-warning",
  bad: "bg-danger",
};

/** ML risk score (0–1) → severity bucket. */
export function riskToSeverity(score: number): Severity {
  if (score >= 0.7) return "bad";
  if (score >= 0.4) return "warn";
  return "good";
}
