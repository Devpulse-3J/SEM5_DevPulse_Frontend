import { apiClient } from "./api-client";
import type { Repository } from "@/types/repository";

const REPOSITORIES_ENDPOINT = "/api/integrations/repositories";

export const repositoryService = {
  getRepositories(): Promise<Repository[]> {
    return apiClient.get<Repository[]>(REPOSITORIES_ENDPOINT);
  },

  getRepositoryById(id: number): Promise<Repository> {
    return apiClient.get<Repository>(
      `${REPOSITORIES_ENDPOINT}/${encodeURIComponent(String(id))}`
    );
  },
};
