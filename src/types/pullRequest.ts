export type PRStatus = "open" | "merged" | "closed" | "draft";
export type PRRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface PRReview {
  id: string;
  reviewerName: string;
  reviewerAvatar?: string;
  state: "APPROVED" | "CHANGES_REQUESTED" | "COMMENTED" | "PENDING";
  submittedAt?: string;
}

export interface PRCheck {
  id: string;
  name: string;
  status: "SUCCESS" | "FAILURE" | "IN_PROGRESS" | "QUEUED";
  url?: string;
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
  description: string;
  author: string;
  authorAvatar?: string;
  repositoryId: string;
  repositoryName: string;
  status: PRStatus;
  headBranch: string;
  baseBranch: string;
  additions: number;
  deletions: number;
  changedFiles: number;
  url: string;
  createdAt: string;
  updatedAt: string;
  mergedAt?: string;
  reviews: PRReview[];
  checks: PRCheck[];
  riskAnalysis: PRRiskAnalysis;
}

export interface PRFilterState {
  search: string;
  status: PRStatus | "all";
  riskLevel: PRRiskLevel | "all";
  repositoryId: string | "all";
}
