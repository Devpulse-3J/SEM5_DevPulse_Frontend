import { apiClient } from "./api-client";
import { authService } from "./auth.service";
import type { ProjectMembership } from "@/types/project";
interface CreateProjectPayload {
  projectName: string;
  description?: string;
  githubRepoUrl?: string;
  jiraProjectKey?: string;
}

interface LinkGithubPayload {
  repoUrl: string;
  webhookSecret?: string;
}

export interface ProjectApiResponse {
  projectId: string | number;
  projectName: string;
  description?: string;
  githubRepoUrl?: string;
  jiraProjectKey?: string;
  memberCount?: number;
  createdAt?: string;
}

export interface LinkedRepoApiResponse {
  id?: string | number;
  repositoryId?: string | number;
  projectId?: string | number;
  url?: string;
  repoUrl?: string;
  owner?: string;
  name?: string;
  repositoryName?: string;
  webhookSecret?: string;
  status?: "CONNECTED" | "DISCONNECTED" | "SYNCING";
  lastSyncedAt?: string;
}

type ProjectListApiResponse =
  | ProjectApiResponse[]
  | { projects: ProjectApiResponse[] }
  | { content: ProjectApiResponse[] }
  | { data: ProjectApiResponse[] };

function unwrapProjects(response: ProjectListApiResponse): ProjectApiResponse[] {
  if (Array.isArray(response)) return response;
  if ("projects" in response) return response.projects;
  if ("content" in response) return response.content;
  return response.data;
}

/**
 * Projects.
 *
 * Project membership for the workspace picker still comes from GET
 * /api/auth/me. Admin project creation uses the project-management endpoints.
 */
export const projectService = {
  /** Derived from GET /api/auth/me — not a project endpoint. */
  async getMyMemberships(): Promise<ProjectMembership[]> {
    const profile = await authService.getMe();
    return profile.projectRoles ?? [];
  },

  /** GET /api/projects → projects visible to the authenticated user. */
  async getAll(): Promise<ProjectApiResponse[]> {
    const response = await apiClient.get<ProjectListApiResponse>("/api/projects");
    return unwrapProjects(response);
  },

  /** POST /api/projects → 201 */
  async create(data: CreateProjectPayload): Promise<ProjectApiResponse> {
    return apiClient.post<ProjectApiResponse>("/api/projects", data);
  },

  /** POST /api/integrations/projects/{id}/github/link → 200/201 */
  async linkGithub(
    projectId: string | number,
    data: LinkGithubPayload
  ): Promise<LinkedRepoApiResponse> {
    return apiClient.post<LinkedRepoApiResponse>(
      `/api/integrations/projects/${encodeURIComponent(String(projectId))}/github/link`,
      data
    );
  },
};
