import { NotImplementedError } from "@/lib/errors";
import type { PullRequest, PRRiskAnalysis } from "@/types/pullRequest";

/**
 * Pull requests and ML risk scoring — NO BACKEND.
 *
 * /api/metrics/prs does not exist (metrics-service is an empty entrypoint) and
 * neither does /api/analytics/prs/{id}/risk.
 */
const BLOCKED_ON = "metrics-service";

export interface PullRequestQuery {
  projectId?: number;
  repositoryId?: string;
  status?: string;
  riskLevel?: string;
}

export const pullRequestService = {
  async getPullRequests(_query: PullRequestQuery = {}): Promise<PullRequest[]> {
    void _query;
    throw new NotImplementedError("Pull requests", BLOCKED_ON);
  },

  async getMyPullRequests(): Promise<PullRequest[]> {
    throw new NotImplementedError("Pull requests", BLOCKED_ON);
  },

  async getPullRequestById(_id: string): Promise<PullRequest> {
    void _id;
    throw new NotImplementedError("Pull request detail", BLOCKED_ON);
  },

  async getRiskAnalysis(_id: string): Promise<PRRiskAnalysis> {
    void _id;
    throw new NotImplementedError("PR risk scoring", "analytics-service");
  },
};
