import { apiClient, ApiError } from "./api-client";
import { NotImplementedError } from "@/lib/errors";
import type { PullRequest, PRRiskAnalysis } from "@/types/pullRequest";

export interface PullRequestQuery {
  projectId: number;
  limit?: number;
  offset?: number;
}

export const pullRequestService = {
  getPullRequests(query: PullRequestQuery): Promise<PullRequest[]> {
    return apiClient.get<PullRequest[]>("/api/metrics/prs", { params: { ...query } });
  },

  async getMyPullRequests(
    query: PullRequestQuery,
    authorName: string,
  ): Promise<PullRequest[]> {
    const pullRequests = await this.getPullRequests(query);
    return pullRequests.filter((pullRequest) => pullRequest.author === authorName);
  },

  async getPullRequestById(query: PullRequestQuery, id: string): Promise<PullRequest> {
    const pullRequests = await this.getPullRequests({ ...query, limit: 500, offset: 0 });
    const pullRequest = pullRequests.find((item) => item.id === id);
    if (!pullRequest) {
      throw new ApiError(404, `Pull request ${id} was not returned for this project.`);
    }
    return pullRequest;
  },

  async getRiskAnalysis(_id: string): Promise<PRRiskAnalysis> {
    void _id;
    throw new NotImplementedError("PR risk scoring", "analytics-service");
  },
};
