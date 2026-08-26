/** A company-scoped GitHub repository returned by integration-service. */
export interface Repository {
  id: number;
  githubRepoId: number;
  fullName: string;
  ownerName: string;
  repoName: string;
  projectId: number | null;
  lastSyncedAt: string;
  isPrivate: boolean;
  language: string;
  status: string;
  description: string;
  url: string;
  metrics: {
    healthScore: number;
    codeCoverage: number | null;
    openPullRequests: number;
    openIssues: number;
    lastSyncAt: string;
  };
  branches: {
    name: string;
    isDefault: boolean;
    lastCommitHash: string;
  }[];
  recentCommits: {
    hash: string;
    timestamp: string;
    message: string;
    author: string;
  }[];
  /** Resolved from the existing projects data on the client. */
  projectName?: string;
}
