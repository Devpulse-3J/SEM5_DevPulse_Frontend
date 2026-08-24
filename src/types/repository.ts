/** A company-scoped GitHub repository returned by integration-service. */
export interface Repository {
  id: number;
  githubRepoId: number;
  fullName: string;
  ownerName: string;
  repoName: string;
  projectId: number | null;
  lastSyncedAt: string;
  /** Resolved from the existing projects data on the client. */
  projectName?: string;
}
