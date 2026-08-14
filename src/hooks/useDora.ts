import { unavailable } from "@/lib/errors";

/**
 * DORA hooks — every one returns the unavailable state.
 *
 * These do NOT call React Query: there is no endpoint, so issuing a request
 * would just produce a 404 and a retry storm. When metrics-service ships,
 * swap each body for a useQuery over `doraService`; the call sites already
 * handle `isUnavailable`.
 */
const BLOCKED_ON = "metrics-service";

export function useDoraSummary() {
  return unavailable("DORA metrics", BLOCKED_ON);
}

export function useLeadTimeTrend() {
  return unavailable("Lead time trend", BLOCKED_ON);
}

export function useDeploysByRepo() {
  return unavailable("Deployment frequency", BLOCKED_ON);
}
