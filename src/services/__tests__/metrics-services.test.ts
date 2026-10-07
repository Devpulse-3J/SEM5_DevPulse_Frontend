import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "../api-client";
import { doraService } from "../dora.service";
import { pullRequestService } from "../pullRequest.service";
import type { DoraSummary } from "@/types/dora";
import type { PullRequest } from "@/types/pullRequest";

vi.mock("../api-client", async () => {
  class ApiError extends Error {
    constructor(public status: number, message: string) {
      super(message);
    }
  }
  return {
    ApiError,
    apiClient: { get: vi.fn(), post: vi.fn() },
  };
});

const getMock = vi.mocked(apiClient.get);
const postMock = vi.mocked(apiClient.post);

const summary: DoraSummary = {
  projectId: "7",
  projectName: "payments",
  repoCount: 2,
  calculatedAt: "2026-08-21T00:00:00Z",
  windowDays: 30,
  metrics: [],
};

const pullRequest = (id: string, author: string): PullRequest => ({
  id,
  number: Number(id),
  title: `PR ${id}`,
  description: null,
  author,
  authorAvatar: null,
  repositoryId: "2",
  repositoryName: "payments",
  status: "open",
  headBranch: null,
  baseBranch: "main",
  additions: 2,
  deletions: 1,
  changedFiles: 1,
  url: null,
  createdAt: "2026-08-20T00:00:00Z",
  updatedAt: "2026-08-20T00:00:00Z",
  mergedAt: null,
  reviews: [],
  checks: [],
  riskAnalysis: null,
});

describe("metrics API services", () => {
  beforeEach(() => getMock.mockReset());

  it("calls the DORA endpoint with backend query names", async () => {
    getMock.mockResolvedValue(summary);

    await expect(
      doraService.getSummary({ projectId: 7, windowDays: 30, historyDays: 14 }),
    ).resolves.toEqual(summary);
    expect(getMock).toHaveBeenCalledWith("/metrics/dora", {
      params: { projectId: 7, windowDays: 30, historyDays: 14 },
    });
  });

  it("asks the server to rebuild the stored daily snapshots, without the /api prefix", async () => {
    postMock.mockResolvedValue({ snapshotsRebuilt: 30 });

    const result = await doraService.rebuildSnapshots(8, 30);

    expect(postMock).toHaveBeenCalledWith("/metrics/dora/snapshots/rebuild", undefined, {
      params: { projectId: 8, days: 30 },
    });
    expect(result.snapshotsRebuilt).toBe(30);
  });

  it("passes only supported deployment filters", async () => {
    getMock.mockResolvedValue([]);

    await doraService.getDeployments({
      projectId: 7,
      environment: "production",
      status: "success",
      limit: 8,
      offset: 0,
    });

    expect(getMock).toHaveBeenCalledWith("/metrics/deployments", {
      params: {
        projectId: 7,
        environment: "production",
        status: "success",
        limit: 8,
        offset: 0,
      },
    });
  });

  it("asks the server for My PRs instead of guessing by name", async () => {
    getMock.mockResolvedValue([pullRequest("1", "Kalhara Jayathissa")]);

    const result = await pullRequestService.getMyPullRequests({
      projectId: 7,
      limit: 100,
      offset: 0,
    });

    expect(result.map((item) => item.id)).toEqual(["1"]);
    expect(getMock).toHaveBeenCalledWith("/metrics/prs", {
      params: { myPrs: true, projectId: 7, limit: 100, offset: 0 },
    });
  });

  it("returns nothing, not the whole team's PRs, when none are attributed to the user", async () => {
    getMock.mockResolvedValue([]);

    const result = await pullRequestService.getMyPullRequests({ projectId: 7 });

    expect(result).toEqual([]);
  });

  it("asks the server to attribute the caller's earlier PRs", async () => {
    postMock.mockResolvedValue({ linkedPullRequests: 5 });

    const result = await pullRequestService.relinkMyAuthored();

    expect(postMock).toHaveBeenCalledWith("/metrics/authors/relink");
    expect(result.linkedPullRequests).toBe(5);
  });

  it("calls the review velocity endpoint with query params", async () => {
    const mockSummary = {
      projectId: "7",
      windowDays: 30,
      calculatedAt: "2026-09-22T00:00:00Z",
      totalPullRequests: 12,
      reviewedPullRequests: 10,
      reviewCoveragePct: 83.3,
      averageTtfrHours: 3.5,
      medianTtfrHours: 2.1,
      averageReviewIterations: 2,
      averageTurnaroundHours: 14.2,
      pullRequests: [],
    };
    getMock.mockResolvedValue(mockSummary);

    const result = await doraService.getReviewVelocity({ projectId: 7, windowDays: 30 });

    expect(getMock).toHaveBeenCalledWith("/metrics/review-velocity", {
      params: { projectId: 7, windowDays: 30 },
    });
    expect(result).toEqual(mockSummary);
  });

  it("calls the devex endpoint with query params", async () => {
    const mockDevEx = {
      projectId: "7",
      windowDays: 30,
      calculatedAt: "2026-09-22T00:00:00Z",
      overallDevExScore: 82,
      overallTeamHealth: "HEALTHY",
      averageContextSwitchingIndex: 2.4,
      teamReviewBurdenRatio: 1.1,
      optimalCount: 4,
      overloadedCount: 1,
      underutilizedCount: 0,
      members: [],
    };
    getMock.mockResolvedValue(mockDevEx);

    const result = await doraService.getDevExSummary({ projectId: 7, windowDays: 30 });

    expect(getMock).toHaveBeenCalledWith("/metrics/devex", {
      params: { projectId: 7, windowDays: 30 },
    });
    expect(result).toEqual(mockDevEx);
  });
});

