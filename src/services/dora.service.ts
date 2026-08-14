import { NotImplementedError } from "@/lib/errors";
import type { DoraSummary, LeadTimeTrend, RepoDeploy } from "@/types/dora";

/**
 * DORA metrics — NO BACKEND.
 *
 * metrics-service is a single empty entrypoint class; there is no
 * /api/metrics/** route serving anything. These signatures and return types are
 * kept exactly as the real ones will be, so that when metrics-service ships
 * only the function bodies change and no caller has to be rewritten.
 */
const BLOCKED_ON = "metrics-service";

export interface DoraQuery {
  projectId?: number;
  days?: number;
  team?: string;
}

export const doraService = {
  async getSummary(_query: DoraQuery = {}): Promise<DoraSummary> {
    void _query;
    throw new NotImplementedError("DORA metrics", BLOCKED_ON);
  },

  async getLeadTimeTrend(_query: DoraQuery = {}): Promise<LeadTimeTrend> {
    void _query;
    throw new NotImplementedError("Lead time trend", BLOCKED_ON);
  },

  async getDeploysByRepo(_query: DoraQuery = {}): Promise<RepoDeploy[]> {
    void _query;
    throw new NotImplementedError("Deployment frequency", BLOCKED_ON);
  },
};
