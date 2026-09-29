import { apiClient } from "./api-client";
import type { JiraIssue } from "./api/integrations";

export interface JiraIntegrationStatus {
  connected: boolean;
  domain?: string;
  projectKeys: string[];
  linkedIssuesCount: number;
  lastSyncedAt?: string;
}

export const jiraService = {
  async getIssues(): Promise<JiraIssue[]> {
    try {
      return await apiClient.get<JiraIssue[]>("/integrations/jira/issues");
    } catch {
      return [];
    }
  },

  async getStatus(): Promise<JiraIntegrationStatus> {
    try {
      const statusRes = await apiClient.get<{ connected: boolean; siteName?: string; siteUrl?: string }>("/integrations/jira/status");
      const issues = await this.getIssues();
      const keys = Array.from(new Set(issues.map((i) => i.jiraKey.split("-")[0])));
      return {
        connected: statusRes.connected ?? (issues.length > 0),
        domain: statusRes.siteUrl ?? statusRes.siteName,
        projectKeys: keys,
        linkedIssuesCount: issues.length,
      };
    } catch {
      return {
        connected: false,
        projectKeys: [],
        linkedIssuesCount: 0,
      };
    }
  },

  async triggerSync(): Promise<void> {
    // Ingestion sync placeholder
  },
};

export default jiraService;
