// Mirrors the implemented metrics-service responses exactly.

export type DoraRating = "ELITE" | "HIGH" | "MEDIUM" | "LOW" | "NOT_AVAILABLE";

export type DoraMetricKey =
  | "deploymentFrequency"
  | "leadTime"
  | "mttr"
  | "changeFailureRate";

export interface DoraHistoryPoint {
  date: string;
  value: number | null;
}

export interface DoraMetric {
  key: DoraMetricKey;
  value: number | null;
  unit: string;
  rating: DoraRating;
  previousValue: number | null;
  sampleSize: number;
  history: DoraHistoryPoint[];
}

export interface DoraSummary {
  projectId: string;
  projectName: string;
  repoCount: number;
  calculatedAt: string;
  windowDays: number;
  metrics: DoraMetric[];
}

export type DeploymentEnvironment = "development" | "staging" | "production";
export type DeploymentStatus = "pending" | "success" | "failed" | "rolled_back";

export interface Deployment {
  id: string;
  externalId: string | null;
  commitSha: string | null;
  environment: DeploymentEnvironment;
  status: DeploymentStatus;
  deployedAt: string;
  failureRecoveredAt: string | null;
  triggeredByUserId: string | null;
  triggeredByName: string | null;
  leadTimeHours: number | null;
}

export interface WorkloadEntry {
  userId: string;
  name: string;
  activePrs: number;
  loadPct: number;
  cycleTimeHours: number | null;
}
