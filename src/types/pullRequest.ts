export type PRStatus = "open" | "merged" | "closed" | "draft";
export type PRRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type PRReviewState =
  | "pending"
  | "approved"
  | "changes_requested"
  | "commented"
  | "dismissed";

export interface PRReview {
  id: string;
  reviewerName: string;
  reviewerAvatar: string | null;
  state: PRReviewState;
  submittedAt: string | null;
}

export interface PRCheck {
  id: string;
  name: string;
  status: "SUCCESS" | "FAILURE" | "IN_PROGRESS" | "QUEUED";
  url: string | null;
}

export interface PRRiskFactor {
  category: string;
  description: string;
  impactScore: number;
}

export interface PRRiskAnalysis {
  riskScore: number; // 0 to 100
  riskLevel: PRRiskLevel;
  summary: string;
  factors: PRRiskFactor[];
}

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  description: string | null;
  author: string;
  authorAvatar: string | null;
  repositoryId: string;
  repositoryName: string;
  status: PRStatus;
  headBranch: string | null;
  baseBranch: string;
  additions: number;
  deletions: number;
  changedFiles: number;
  url: string | null;
  createdAt: string;
  updatedAt: string;
  mergedAt: string | null;
  reviews: PRReview[];
  checks: PRCheck[];
  riskAnalysis: PRRiskAnalysis | null;
}

export interface PRFilterState {
  search: string;
  status: PRStatus | "all";
  repositoryId: string | "all";
}
