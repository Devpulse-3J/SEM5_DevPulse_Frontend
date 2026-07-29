// OWNER: Person B — DORA / Overview metric types (mirror gateway /api/metrics/dora).

export type DoraRating = "ELITE" | "HIGH" | "MEDIUM" | "LOW";
export type MetricSeverity = "good" | "warn" | "bad";
export type TrendDirection = "up" | "down";

export type DoraMetricKey =
  | "deploymentFrequency"
  | "leadTime"
  | "mttr"
  | "changeFailureRate";

export interface DoraTrend {
  direction: TrendDirection;
  /** e.g. "Elite · +0.8 vs prior period" */
  text: string;
}

/** One DORA metric card on the Overview dashboard. */
export interface DoraMetricCard {
  key: DoraMetricKey;
  label: string;
  value: number;
  unit: string; // "/day" | "hrs" | "%"
  rating: DoraRating;
  ratingLabel: string; // "Elite" | "High" | "Needs Attention"
  severity: MetricSeverity; // drives left-border + trend color
  trend: DoraTrend;
  /** 7 recent points, 0–100, for the mini sparkline bars. */
  sparkline: number[];
}

export interface DoraSummary {
  project: string;
  repoCount: number;
  updatedAgo: string;
  metrics: DoraMetricCard[];
}

/** "Lead Time Trend — 12 Weeks" line chart. */
export interface LeadTimePoint {
  week: string; // "W1"
  hours: number;
}
export interface LeadTimeTrend {
  unit: string; // "median, hrs"
  points: LeadTimePoint[];
}

/** "Deploys by Repo (7d)" bar list. */
export interface RepoDeploy {
  repo: string;
  deploys: number;
  pct: number; // 0–100 bar fill
}
