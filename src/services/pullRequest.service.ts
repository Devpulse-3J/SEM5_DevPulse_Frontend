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

  async getMyPullRequests(
    query: PullRequestQuery,
    authorIdentifier?: AuthorIdentifier,
  ): Promise<PullRequest[]> {
    const pullRequests = await this.getPullRequests(query);
    if (!pullRequests || !Array.isArray(pullRequests)) return [];

    let fullName = "";
    let email = "";
    let emailPrefix = "";

    if (typeof authorIdentifier === "string") {
      fullName = authorIdentifier;
      if (authorIdentifier.includes("@")) {
        email = authorIdentifier.trim().toLowerCase();
        emailPrefix = authorIdentifier.split("@")[0].trim().toLowerCase();
      }
    } else if (authorIdentifier && typeof authorIdentifier === "object") {
      fullName = authorIdentifier.fullName || "";
      if (authorIdentifier.email) {
        email = authorIdentifier.email.trim().toLowerCase();
        emailPrefix = authorIdentifier.email.split("@")[0].trim().toLowerCase();
      }
    }

    fullName = fullName.trim().toLowerCase();

    if (!fullName && !email && !emailPrefix) {
      return pullRequests;
    }

    const filtered = pullRequests.filter((pr) => {
      // 1. Direct authorEmail match from GitHub payload
      if (email && pr.authorEmail && pr.authorEmail.trim().toLowerCase() === email) {
        return true;
      }

      if (!pr.author) return false;
      const author = pr.author.trim().toLowerCase();

      // 2. Case-insensitive exact matches (email, full name, or username prefix)
      if (email && author === email) return true;
      if (fullName && author === fullName) return true;
      if (emailPrefix && author === emailPrefix) return true;

      // 3. Substring / partial matches (e.g. "Umaya" in "Umaya Jayasuriya")
      if (fullName && (author.includes(fullName) || fullName.includes(author))) return true;
      if (emailPrefix && (author.includes(emailPrefix) || emailPrefix.includes(author))) return true;

      return false;
    });

    // Fall back to returning all project PRs if author matching finds nothing
    return filtered.length > 0 ? filtered : pullRequests;
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
