import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "../api-client";
import { projectService } from "../project.service";

vi.mock("../api-client", () => ({
  apiClient: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

vi.mock("../auth.service", () => ({
  authService: { getMe: vi.fn() },
}));

const postMock = vi.mocked(apiClient.post);
const getMock = vi.mocked(apiClient.get);
const putMock = vi.mocked(apiClient.put);
const deleteMock = vi.mocked(apiClient.delete);

describe("project API service", () => {
  beforeEach(() => {
    getMock.mockReset();
    postMock.mockReset();
    putMock.mockReset();
    deleteMock.mockReset();
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

  it("fetches GitHub App connect URL via GET /api/integrations/projects/:id/github/connect-url", async () => {
    const connectUrl = "https://github.com/apps/devpulse/installations/new?state=12";
    getMock.mockResolvedValue({ connectUrl });

    await expect(projectService.getConnectUrl(12)).resolves.toEqual({ connectUrl });
    expect(getMock).toHaveBeenCalledWith("/api/integrations/projects/12/github/connect-url");
  });

  it("links GitHub using the integration endpoint", async () => {
    postMock.mockResolvedValue({ repositoryId: 34 });

    await projectService.linkGithub(12, {
      repoUrl: "https://github.com/owner/repository",
    });

    expect(postMock).toHaveBeenCalledWith(
      "/api/integrations/projects/12/github/link",
      {
        repoUrl: "https://github.com/owner/repository",
      },
    );
  });

  it("updates a project using PUT /api/projects/:id", async () => {
    const response = { projectId: 12, projectName: "Updated Project" };
    putMock.mockResolvedValue(response);

    await expect(
      projectService.update(12, {
        projectName: "Updated Project",
        description: "New description",
      })
    ).resolves.toBe(response);

    expect(putMock).toHaveBeenCalledWith("/api/projects/12", {
      projectName: "Updated Project",
      description: "New description",
    });
  });

  it("removes a project using DELETE /api/projects/:id", async () => {
    deleteMock.mockResolvedValue(undefined);

    await projectService.remove(12);
    expect(deleteMock).toHaveBeenCalledWith("/api/projects/12");
  });

  it("updates member role using PUT /api/projects/:id/members/:memberId", async () => {
    putMock.mockResolvedValue({ memberId: 5, role: "MANAGER" });

    await projectService.updateMemberRole(12, 5, "MANAGER");
    expect(putMock).toHaveBeenCalledWith("/api/projects/12/members/5", {
      role: "MANAGER",
    });
  });

  it("removes a member using DELETE /api/projects/:id/members/:memberId", async () => {
    deleteMock.mockResolvedValue(undefined);

    await projectService.removeMember(12, 5);
    expect(deleteMock).toHaveBeenCalledWith("/api/projects/12/members/5");
  });
});

