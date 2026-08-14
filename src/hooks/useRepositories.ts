import { unavailable } from "@/lib/errors";

/** Repository hooks — no integration-service, so no data. */
const BLOCKED_ON = "integration-service";

export function useRepositories() {
  return unavailable("Repositories", BLOCKED_ON);
}

export function useRepositoryDetail(_id?: string) {
  void _id;
  return unavailable("Repository detail", BLOCKED_ON);
}

export function useSyncRepository() {
  return {
    ...unavailable("Repository sync", BLOCKED_ON),
    mutate: () => undefined,
    isPending: false as const,
  };
}
