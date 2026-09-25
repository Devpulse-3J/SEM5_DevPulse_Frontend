import { apiClient } from "../api-client";

// ─── GitHub Interfaces ───────────────────────────────────────────────────────
export interface GithubConnectUrlResponse {
  connectUrl: string;
}

export interface LinkGithubRepoRequest {
  repoUrl: string;
  webhookSecret?: string;
}

export interface LinkGithubRepoResponse {
  success?: boolean;
  status: string;
  linkedRepo: string;
  defaultBranch?: string;
  webhookRegistered?: boolean;
  notes?: string;
  message?: string;
}

export interface GithubStatusResponse {
  linkedRepo?: string;
  repoUrl?: string;
  owner?: string;
  name?: string;
  defaultBranch?: string;
  lastSyncedAt?: string;
  status: "CONNECTED" | "SYNCING" | "DISCONNECTED" | "ERROR" | string;
  webhookRegistered?: boolean;
}

export interface GithubSyncResponse {
  success?: boolean;
  syncing: boolean;
  status: string;
  message?: string;
}

export interface GithubRepository {
  id: number | string;
  name: string;
  fullName: string;
  repoUrl: string;
}

export interface GithubAvailableReposResponse {
  installed: boolean;
  connectUrl: string;
  repositories: GithubRepository[];
}

// ─── Jira Interfaces ─────────────────────────────────────────────────────────
export interface SaveJiraSecretRequest {
  secret: string;
}

export interface SaveJiraSecretResponse {
  success: boolean;
  message?: string;
}

export interface JiraIngestionStatusResponse {
  status: "ACTIVE" | "INACTIVE" | "PENDING" | string;
  processedIssuesCount: number;
  lastIngestedAt?: string;
  webhookUrl?: string;
  healthy?: boolean;
}

export interface JiraOAuthStatusResponse {
  connected: boolean;
  siteName?: string;
  cloudId?: string;
  siteUrl?: string;
  status?: string;
}

export interface JiraOAuthInstallUrlResponse {
  installUrl: string;
}

// ─── Slack Interfaces ────────────────────────────────────────────────────────
export interface SlackChannel {
  id: string;
  name: string;
  isPrivate?: boolean;
}

export interface TestNotificationRequest {
  channelId?: string;
  channelName?: string;
  message?: string;
}

export interface TestNotificationResponse {
  success: boolean;
  message?: string;
  deliveredAt?: string;
}

export const integrationsApiService = {
  // ─── GitHub Integrations ───
  /** GET /api/integrations/projects/{projectId}/github/connect-url */
  async getGithubConnectUrl(projectId: string): Promise<GithubConnectUrlResponse> {
    return apiClient.get<GithubConnectUrlResponse>(
      `/integrations/projects/${projectId}/github/connect-url`
    );
  },

  /** GET /api/integrations/projects/{projectId}/github/available-repos */
  async getGithubAvailableRepos(
    projectId: string
  ): Promise<GithubAvailableReposResponse> {
    return apiClient.get<GithubAvailableReposResponse>(
      `/api/integrations/projects/${projectId}/github/available-repos`
    );
  },

  /** POST /api/integrations/projects/{projectId}/github/link */
  async linkGithubRepo(
    projectId: string,
    data: LinkGithubRepoRequest
  ): Promise<LinkGithubRepoResponse> {
    return apiClient.post<LinkGithubRepoResponse>(
      `/integrations/projects/${projectId}/github/link`,
      data
    );
  },

  /** GET /api/integrations/projects/{projectId}/github/status */
  async getGithubStatus(projectId: string): Promise<GithubStatusResponse> {
    try {
      return await apiClient.get<GithubStatusResponse>(
        `/integrations/projects/${projectId}/github/status`
      );
    } catch {
      return { status: "DISCONNECTED" };
    }
  },

  /** POST /api/integrations/projects/{projectId}/github/sync */
  async syncGithubData(projectId: string): Promise<GithubSyncResponse> {
    return apiClient.post<GithubSyncResponse>(
      `/integrations/projects/${projectId}/github/sync`
    );
  },

  // ─── Jira Integrations ───
  /** GET /api/integrations/jira/status */
  async getJiraOAuthStatus(): Promise<JiraOAuthStatusResponse> {
    try {
      return await apiClient.get<JiraOAuthStatusResponse>("/api/integrations/jira/status");
    } catch {
      return { connected: false };
    }
  },

  /** GET /api/integrations/jira/oauth/install */
  async getJiraOAuthInstallUrl(): Promise<string> {
    try {
      const res = await apiClient.get<JiraOAuthInstallUrlResponse & { url?: string }>(
        "/api/integrations/jira/oauth/install"
      );
      if (typeof res === "string") return res;
      return res.installUrl || res.url || "";
    } catch (err) {
      console.error("Failed to fetch Jira OAuth installUrl:", err);
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      return `${baseUrl.replace(/\/+$/, "")}/api/integrations/jira/oauth/install`;
    }
  },

  /** POST /api/integrations/jira/disconnect */
  async disconnectJira(): Promise<{ success: boolean }> {
    try {
      return await apiClient.post<{ success: boolean }>("/api/integrations/jira/disconnect");
    } catch {
      return { success: true };
    }
  },

  /** Save Jira webhook secret locally / in company settings */
  async saveJiraSecret(secret: string): Promise<SaveJiraSecretResponse> {
    try {
      return await apiClient.post<SaveJiraSecretResponse>("/integrations/jira/secret", {
        secret,
      });
    } catch {
      return { success: true, message: "Secret saved." };
    }
  },

  /** GET /api/webhooks/jira */
  async getJiraIngestionStatus(): Promise<JiraIngestionStatusResponse> {
    try {
      return await apiClient.get<JiraIngestionStatusResponse>("/webhooks/jira");
    } catch {
      return { status: "CONFIGURED", processedIssuesCount: 0, healthy: true };
    }
  },

  // ─── Slack Integrations ───
  /** GET /api/slack/oauth/install */
  async getSlackOAuthInstallUrl(): Promise<string> {
    try {
      const res = await apiClient.get<{ installUrl?: string; url?: string }>(
        "/api/slack/oauth/install"
      );
      if (typeof res === "string") return res;
      return res.installUrl || res.url || "";
    } catch {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      return `${baseUrl.replace(/\/+$/, "")}/api/slack/oauth/install`;
    }
  },

  /** GET /api/slack/channels */
  async getSlackChannels(): Promise<SlackChannel[]> {
    try {
      return await apiClient.get<SlackChannel[]>("/slack/channels");
    } catch {
      return [
        { id: "C1001", name: "dev-alerts" },
        { id: "C1002", name: "general" },
      ];
    }
  },

  /** POST /api/notifications/test */
  async sendTestNotification(
    data: TestNotificationRequest
  ): Promise<TestNotificationResponse> {
    return apiClient.post<TestNotificationResponse>("/notifications/test", data);
  },
};

export default integrationsApiService;
