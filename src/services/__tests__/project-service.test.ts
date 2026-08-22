import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "../api-client";
import { projectService } from "../project.service";

vi.mock("../api-client", () => ({
  apiClient: { get: vi.fn(), post: vi.fn() },
}));

vi.mock("../auth.service", () => ({
  authService: { getMe: vi.fn() },
}));

const postMock = vi.mocked(apiClient.post);
const getMock = vi.mocked(apiClient.get);

describe("project API service", () => {
  beforeEach(() => {
    getMock.mockReset();
    postMock.mockReset();
  });

  it("fetches projects from the collection endpoint", async () => {
    const projects = [{ projectId: 12, projectName: "Example Project" }];
    getMock.mockResolvedValue({ projects });

    await expect(projectService.getAll()).resolves.toEqual(projects);
    expect(getMock).toHaveBeenCalledWith("/api/projects");
  });

  it("creates a project using the backend field names", async () => {
    const response = { projectId: 12, projectName: "Example Project" };
    postMock.mockResolvedValue(response);

    await expect(
      projectService.create({
        projectName: "Example Project",
        description: "Project description",
        githubRepoUrl: "https://github.com/owner/repository",
        jiraProjectKey: "EX",
      }),
    ).resolves.toBe(response);

    expect(postMock).toHaveBeenCalledWith("/api/projects", {
      projectName: "Example Project",
      description: "Project description",
      githubRepoUrl: "https://github.com/owner/repository",
      jiraProjectKey: "EX",
    });
  });

  it("links GitHub using the integration endpoint and backend field names", async () => {
    postMock.mockResolvedValue({ repositoryId: 34 });

    await projectService.linkGithub(12, {
      repoUrl: "https://github.com/owner/repository",
      webhookSecret: "at-least-16-characters",
    });

    expect(postMock).toHaveBeenCalledWith(
      "/api/integrations/projects/12/github/link",
      {
        repoUrl: "https://github.com/owner/repository",
        webhookSecret: "at-least-16-characters",
      },
    );
  });
});
