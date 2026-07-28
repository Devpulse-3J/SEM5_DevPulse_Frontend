export type RepositoryStatus = "active" | "archived" | "syncing" | "error";

export interface RepositoryBranch {
  name: string;
  isDefault: boolean;
  lastCommitHash: string;
  lastCommitMessage: string;
  updatedAt: string;
}

export interface RepositoryCommit {
  hash: string;
  message: string;
  author: string;
  authorEmail: string;
  timestamp: string;
  branch: string;
}

export interface RepositoryMetrics {
  openPullRequests: number;
  openIssues: number;
  codeCoverage?: number;
  healthScore: number;
  lastSyncAt: string;
}

export interface Repository {
  id: string;
  name: string;
  owner: string;
  fullName: string;
  description: string;
  url: string;
  defaultBranch: string;
  language: string;
  isPrivate: boolean;
  status: RepositoryStatus;
  starsCount: number;
  forksCount: number;
  metrics: RepositoryMetrics;
  branches?: RepositoryBranch[];
  recentCommits?: RepositoryCommit[];
  updatedAt: string;
  createdAt: string;
}
