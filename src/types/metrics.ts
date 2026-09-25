import type { PRRiskAnalysis, PRStatus, PRReview, PRCheck } from "./pullRequest";

export type WorkloadStatus = "OPTIMAL" | "OVERLOADED" | "UNDERUTILIZED";
export type TeamHealthStatus = "HEALTHY" | "MODERATE" | "BURNOUT_RISK";

export interface ReviewVelocityPR {
  prId: number;
  prNumber: number;
  title: string;
  state: string;
  createdAt: string;
  firstReviewAt: string | null;
  reviewCount: number;
  ttfrHours: number | null;
  turnaroundHours: number | null;
}

export interface ReviewVelocitySummary {
  projectId: string;
  windowDays: number;
  calculatedAt: string;
  totalPullRequests: number;
  reviewedPullRequests: number;
  reviewCoveragePct: number; // e.g. 85.5 (%)
  averageTtfrHours: number | null; // Average Time to First Review
  medianTtfrHours: number | null; // Median Time to First Review
  averageReviewIterations: number;
  averageTurnaroundHours: number | null;
  pullRequests: ReviewVelocityPR[];
}

export interface WorkloadEntry {
  userId: string;
  name: string;
  activePrs: number;
  loadPct: number; // activePrs / target (100% = target)
  cycleTimeHours: number | null;
  // DevEx & Workload fields
  completedReviews: number; // Reviews completed by developer in window
  activeRepositories: number; // Distinct repositories touched
  contextSwitchingIndex: number; // 0.0 to 10.0 scale (higher = more fragmented)
  reviewBurdenRatio: number; // reviews / authored PRs ratio
  workloadStatus: WorkloadStatus;
  devexScore: number; // 0 to 100 flow score (higher = healthier flow)
}

export interface DevExSummary {
  projectId: string;
  windowDays: number;
  calculatedAt: string;
  overallDevExScore: number; // 0 to 100
  overallTeamHealth: TeamHealthStatus;
  averageContextSwitchingIndex: number;
  teamReviewBurdenRatio: number;
  optimalCount: number;
  overloadedCount: number;
  underutilizedCount: number;
  members: WorkloadEntry[];
}
