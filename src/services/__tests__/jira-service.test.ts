import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "../api-client";
import { jiraService } from "../jira.service";
import { integrationsApiService } from "../api/integrations";

vi.mock("../api-client", async () => {
  return {
    apiClient: {
      get: vi.fn(),
      post: vi.fn(),
    },
  };
});

const getMock = vi.mocked(apiClient.get);

describe("jiraService and integrationsApiService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches Jira issues correctly via integrationsApiService.getJiraIssues", async () => {
    const mockIssues = [
      {
        issueId: 101,
        companyId: 1,
        projectId: 1,
        jiraKey: "DEVP-101",
        summary: "Setup OAuth PKCE flow",
        issueType: "Task",
        priority: "High",
        status: "In Progress",
        storyPoints: 5,
        assigneeId: 12,
        createdAt: "2026-09-20T10:00:00Z",
      },
    ];

    getMock.mockResolvedValueOnce(mockIssues);

    const result = await integrationsApiService.getJiraIssues();
    expect(getMock).toHaveBeenCalledWith("/integrations/jira/issues");
    expect(result).toHaveLength(1);
    expect(result[0].jiraKey).toBe("DEVP-101");
    expect(result[0].assigneeId).toBe(12);
  });

  it("fetches issues and status via jiraService", async () => {
    const mockIssues = [
      {
        issueId: 102,
        companyId: 1,
        projectId: 1,
        jiraKey: "DEVP-102",
        summary: "Fix token expiration bug",
        status: "To Do",
        assigneeId: 12,
      },
    ];

    getMock
      .mockResolvedValueOnce({ connected: true, siteName: "devpulse.atlassian.net" })
      .mockResolvedValueOnce(mockIssues);

    const status = await jiraService.getStatus();
    expect(status.connected).toBe(true);
    expect(status.projectKeys).toContain("DEVP");
    expect(status.linkedIssuesCount).toBe(1);
  });
});
