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

interface InviteMemberPayload {
  email: string;
  /**
   * Must be UPPERCASE. The gateway's enum binding is case-sensitive — sending
   * "manager" returns a 500, not a 400, so there is no useful error to surface.
   */
  role: "MANAGER" | "DEVELOPER";
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
  status?: "CONNECTED" | "DISCONNECTED" | "SYNCING" | "ERROR";
  lastSyncedAt?: string;
}

export interface GithubSyncTriggerResponse {
  status?: "CONNECTED" | "DISCONNECTED" | "SYNCING" | "ERROR";
  lastSyncedAt?: string;
  /** Id of the async job, if the backend returns one. */
  jobId?: string;
}

/**
 * A project member as the gateway returns it.
 *
 * Every field is optional because the only responses observed so far were
 * empty arrays — the key names below are the plausible ones, and the mapper in
 * `AdminProjectsProvider` falls back on all of them. Tighten this once a
 * populated response has actually been seen.
 */
export interface ProjectMemberApiResponse {
  id?: string | number;
  memberId?: string | number;
  userId?: string | number;
  email?: string;
  fullName?: string;
  name?: string;
  role?: string;
  status?: string;
  joinedAt?: string;
  createdAt?: string;
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

  /** GET /api/projects/{id}/members → 200, array */
  async getMembers(
    projectId: string | number
  ): Promise<ProjectMemberApiResponse[]> {
    const response = await apiClient.get<
      ProjectMemberApiResponse[] | { members: ProjectMemberApiResponse[] }
    >(`/api/projects/${encodeURIComponent(String(projectId))}/members`);
    return Array.isArray(response) ? response : (response.members ?? []);
  },

  /**
   * POST /api/projects/{id}/invite → 200/201
   *
   * Admin-only: a non-admin caller gets 403 "Only company admins can perform
   * this action", and an email already belonging to another company gets 409.
   */
  async inviteMember(
    projectId: string | number,
    data: InviteMemberPayload
  ): Promise<ProjectMemberApiResponse> {
    return apiClient.post<ProjectMemberApiResponse>(
      `/api/projects/${encodeURIComponent(String(projectId))}/invite`,
      data
    );
  },

  /** GET /api/integrations/projects/{id}/github/connect-url → 200 */
  async getConnectUrl(
    projectId: string | number
  ): Promise<{ connectUrl: string }> {
    return apiClient.get<{ connectUrl: string }>(
      `/api/integrations/projects/${encodeURIComponent(String(projectId))}/github/connect-url`
    );
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

  /**
   * POST /api/integrations/projects/{id}/github/sync → 202/200.
   *
   * Kicks off an async GitHub sync. The call resolves before the data is
   * fetched, so poll `githubStatus` until `status` leaves SYNCING.
   */
  async syncGithub(
    projectId: string | number
  ): Promise<GithubSyncTriggerResponse> {
    return apiClient.post<GithubSyncTriggerResponse>(
      `/api/integrations/projects/${encodeURIComponent(String(projectId))}/github/sync`
    );
  },

  /** GET /api/integrations/projects/{id}/github/status → 200 */
  async githubStatus(
    projectId: string | number
  ): Promise<LinkedRepoApiResponse> {
    return apiClient.get<LinkedRepoApiResponse>(
      `/api/integrations/projects/${encodeURIComponent(String(projectId))}/github/status`
    );
  },

  /** PUT /api/projects/{id} → 200 */
  async update(
    projectId: string | number,
    data: { projectName: string; description?: string; jiraProjectKey?: string }
  ): Promise<ProjectApiResponse> {
    return apiClient.put<ProjectApiResponse>(
      `/api/projects/${encodeURIComponent(String(projectId))}`,
      data
    );
  },

  /** DELETE /api/projects/{id} → 200/204 */
  async remove(projectId: string | number): Promise<void> {
    return apiClient.delete<void>(
      `/api/projects/${encodeURIComponent(String(projectId))}`
    );
  },

  /** PUT /api/projects/{id}/members/{memberId} → 200 */
  async updateMemberRole(
    projectId: string | number,
    memberId: string | number,
    role: "MANAGER" | "DEVELOPER"
  ): Promise<ProjectMemberApiResponse> {
    return apiClient.put<ProjectMemberApiResponse>(
      `/api/projects/${encodeURIComponent(String(projectId))}/members/${encodeURIComponent(String(memberId))}`,
      { role }
    );
  },

  /** DELETE /api/projects/{id}/members/{memberId} → 200/204 */
  async removeMember(
    projectId: string | number,
    memberId: string | number
  ): Promise<void> {
    return apiClient.delete<void>(
      `/api/projects/${encodeURIComponent(String(projectId))}/members/${encodeURIComponent(String(memberId))}`
    );
  },
};

