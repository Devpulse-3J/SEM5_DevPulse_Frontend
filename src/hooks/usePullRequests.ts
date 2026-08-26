import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";
import { pullRequestService } from "@/services/pullRequest.service";

function validProject(projectId: number | undefined): projectId is number {
  return typeof projectId === "number" && Number.isInteger(projectId) && projectId > 0;
}

export function usePullRequests(projectId: number | undefined, limit = 100, offset = 0) {
  return useQuery({
    queryKey: QUERY_KEYS.pullRequests(projectId, limit, offset),
    queryFn: () =>
      pullRequestService.getPullRequests({ projectId: projectId as number, limit, offset }),
    enabled: validProject(projectId),
    staleTime: 60_000,
  });
}

export function useMyPullRequests(
  projectId: number | undefined,
  authorName: string | undefined,
  limit = 100,
) {
  return useQuery({
    queryKey: QUERY_KEYS.myPullRequests(projectId, authorName, limit),
    queryFn: () =>
      pullRequestService.getMyPullRequests(
        { projectId: projectId as number, limit, offset: 0 },
        authorName as string,
      ),
    enabled: validProject(projectId) && Boolean(authorName),
    staleTime: 60_000,
  });
}

export function usePullRequest(projectId: number | undefined, id: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.pullRequest(projectId, id),
    queryFn: () =>
      pullRequestService.getPullRequestById({ projectId: projectId as number }, id as string),
    enabled: validProject(projectId) && Boolean(id),
  });
}
