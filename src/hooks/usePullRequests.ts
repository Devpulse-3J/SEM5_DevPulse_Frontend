import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";
import { pullRequestService, type AuthorIdentifier } from "@/services/pullRequest.service";

function isValidProjectId(projectId: number | undefined): boolean {
  if (projectId === undefined) return true;
  return typeof projectId === "number" && !isNaN(projectId) && projectId > 0;
}

export function usePullRequests(projectId: number | undefined, limit = 100, offset = 0) {
  return useQuery({
    queryKey: QUERY_KEYS.pullRequests(projectId, limit, offset),
    queryFn: () =>
      pullRequestService.getPullRequests({ projectId, limit, offset }),
    enabled: isValidProjectId(projectId),
    staleTime: 60_000,
  });
}

/**
 * `authorIdentifier` no longer affects the request (the server filters by the
 * caller's id); it stays in the cache key so two users on one tab never share
 * a cached list.
 */
export function useMyPullRequests(
  projectId: number | undefined,
  authorIdentifier?: AuthorIdentifier,
  limit = 100,
) {
  const keyIdentifier =
    typeof authorIdentifier === "string"
      ? authorIdentifier
      : authorIdentifier?.fullName || authorIdentifier?.email;

  return useQuery({
    queryKey: QUERY_KEYS.myPullRequests(projectId, keyIdentifier, limit),
    queryFn: () =>
      pullRequestService.getMyPullRequests({ projectId, limit, offset: 0 }),
    enabled: isValidProjectId(projectId),
    staleTime: 60_000,
  });
}

export function usePullRequest(projectId: number | undefined, id: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.pullRequest(projectId, id),
    queryFn: () =>
      pullRequestService.getPullRequestById({ projectId: projectId as number }, id as string),
    enabled: Boolean(id),
  });
}
