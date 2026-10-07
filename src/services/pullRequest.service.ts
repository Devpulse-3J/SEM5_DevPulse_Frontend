import { apiClient, ApiError } from "./api-client";
import { NotImplementedError } from "@/lib/errors";
import type { PullRequest, PRRiskAnalysis } from "@/types/pullRequest";

export interface PullRequestQuery {
  projectId?: number;
  limit?: number;
  offset?: number;
}

export type AuthorIdentifier =
  | string
  | { fullName?: string; email?: string }
  | undefined;

export const pullRequestService = {
  getPullRequests(query: PullRequestQuery): Promise<PullRequest[]> {
    const params: Record<string, string | number | boolean | undefined> = {};
    if (query.projectId !== undefined && query.projectId > 0) {
      params.projectId = query.projectId;
    }
    if (query.limit !== undefined) params.limit = query.limit;
    if (query.offset !== undefined) params.offset = query.offset;

    return apiClient.get<PullRequest[]>("/metrics/prs", { params });
  },

  /**
   * The signed-in user's own PRs, filtered by the server (`myPrs=true` matches
   * pr.author_id to the caller's user id).
   *
   * This used to match on name/email in the browser and fall back to returning
   * every PR in the project when nothing matched, so anyone whose PRs were not
   * linked to their account saw the whole team's. Now an empty result means
   * exactly that: none of the PRs are attributed to you.
   */
  async getMyPullRequests(query: PullRequestQuery): Promise<PullRequest[]> {
    const params: Record<string, string | number | boolean | undefined> = {
      myPrs: true,
    };
    if (query.projectId !== undefined && query.projectId > 0) {
      params.projectId = query.projectId;
    }
    if (query.limit !== undefined) params.limit = query.limit;
    if (query.offset !== undefined) params.offset = query.offset;

    const pullRequests = await apiClient.get<PullRequest[]>("/metrics/prs", { params });
    return Array.isArray(pullRequests) ? pullRequests : [];
  },

  /**
   * POST /api/metrics/authors/relink. Attributes the caller's earlier PRs (those
   * that arrived before their GitHub account was linked, or before they joined
   * the company) to them. Safe to repeat; only fills PRs that have no author.
   */
  async relinkMyAuthored(): Promise<{ linkedPullRequests: number }> {
    return apiClient.post<{ linkedPullRequests: number }>("/metrics/authors/relink");
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
