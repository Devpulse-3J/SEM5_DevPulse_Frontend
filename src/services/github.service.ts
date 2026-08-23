import { NotImplementedError } from "@/lib/errors";

/**
 * GitHub integration — NO BACKEND.
 *
 * There is no /api/integrations/** route. Note there is also no connect URL to
 * offer: the GitHub App identity lives server-side, so the client cannot build
 * an install link on its own without hardcoding an app slug.
 */
const BLOCKED_ON = "integration-service";

export interface GitHubIntegrationStatus {
  connected: boolean;
  accountName?: string;
  installationId?: string;
  connectedReposCount: number;
  lastSyncedAt?: string;
  scopes: string[];
}

export const githubService = {
  async getStatus(): Promise<GitHubIntegrationStatus> {
    throw new NotImplementedError("GitHub integration", BLOCKED_ON);
  },

  async triggerSync(): Promise<void> {
    throw new NotImplementedError("GitHub sync", BLOCKED_ON);
  },
};
