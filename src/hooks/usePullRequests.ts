import { unavailable } from "@/lib/errors";

/**
 * Pull-request hooks — no metrics-service, so no data.
 * Returns the unavailable state rather than hanging on a request that 404s.
 */
const BLOCKED_ON = "metrics-service";

export function usePullRequests() {
  return unavailable("Pull requests", BLOCKED_ON);
}

export function useMyPullRequests() {
  return unavailable("Pull requests", BLOCKED_ON);
}

export function usePRRiskDetail(_id?: string) {
  void _id;
  return unavailable("PR risk detail", BLOCKED_ON);
}
