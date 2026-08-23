import { NotImplementedError } from "@/lib/errors";

/**
 * Jira integration — NO BACKEND.
 *
 * There is no /api/integrations/** route.
 */
const BLOCKED_ON = "integration-service";

export interface JiraIntegrationStatus {
  connected: boolean;
  domain?: string;
  projectKeys: string[];
  linkedIssuesCount: number;
  lastSyncedAt?: string;
}

export const jiraService = {
  async getStatus(): Promise<JiraIntegrationStatus> {
    throw new NotImplementedError("Jira integration", BLOCKED_ON);
  },

  async triggerSync(): Promise<void> {
    throw new NotImplementedError("Jira sync", BLOCKED_ON);
  },
};
