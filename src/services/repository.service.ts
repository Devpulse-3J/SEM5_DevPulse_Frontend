import { NotImplementedError } from "@/lib/errors";
import type { Repository } from "@/types/repository";

/**
 * Repositories — NO BACKEND.
 *
 * There is no /api/repositories route. Repository data would come from
 * integration-service once it ingests GitHub.
 */
const BLOCKED_ON = "integration-service";

export const repositoryService = {
  async getRepositories(): Promise<Repository[]> {
    throw new NotImplementedError("Repositories", BLOCKED_ON);
  },

  async getRepositoryById(_id: string): Promise<Repository> {
    void _id;
    throw new NotImplementedError("Repository detail", BLOCKED_ON);
  },

  async syncRepository(_id: string): Promise<void> {
    void _id;
    throw new NotImplementedError("Repository sync", BLOCKED_ON);
  },
};
