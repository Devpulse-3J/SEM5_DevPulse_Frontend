"use client";

import { useQuery } from "@tanstack/react-query";
import { projectService } from "@/services/project.service";
import { QUERY_KEYS } from "@/lib/constants";
import { unavailable } from "@/lib/errors";
import { hasValidSession } from "@/lib/auth";
import { useHasMounted } from "./useHasMounted";

/**
 * The user's project memberships, derived from GET /api/auth/me.
 * This is what the project picker and every permission check read.
 *
 * `enabled` is held false until mount: `hasValidSession()` reads localStorage,
 * so evaluating it during the server render disables the query there while the
 * client enables it, and the two renders disagree about whether the caller is
 * loading. See `useHasMounted`.
 */
export function useMyMemberships() {
  const hasMounted = useHasMounted();

  return useQuery({
    queryKey: QUERY_KEYS.myMemberships,
    queryFn: () => projectService.getMyMemberships(),
    enabled: hasMounted && hasValidSession(),
    staleTime: 1000 * 60 * 5,
  });
}

/** No project directory endpoint exists. */
export function useProjects() {
  return unavailable("The project directory", "a project service");
}
