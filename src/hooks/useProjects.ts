import { useQuery } from "@tanstack/react-query";
import { projectService } from "@/services/project.service";
import { QUERY_KEYS } from "@/lib/constants";
import { unavailable } from "@/lib/errors";
import { hasValidSession } from "@/lib/auth";

/**
 * The user's project memberships, derived from GET /api/auth/me.
 * This is what the project picker and every permission check read.
 */
export function useMyMemberships() {
  return useQuery({
    queryKey: QUERY_KEYS.myMemberships,
    queryFn: () => projectService.getMyMemberships(),
    enabled: hasValidSession(),
    staleTime: 1000 * 60 * 5,
  });
}

/** No project directory endpoint exists. */
export function useProjects() {
  return unavailable("The project directory", "a project service");
}
