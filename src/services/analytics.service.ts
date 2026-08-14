import { NotImplementedError } from "@/lib/errors";
import type {
  WorkloadEntry,
  EffortSlice,
  CycleStage,
  ReviewBottleneck,
} from "@/types/analytics";

/**
 * Team analytics — NO BACKEND.
 *
 * analytics-service serves only /health. Signatures preserved so the switch to
 * real data is a body-only change.
 */
const BLOCKED_ON = "analytics-service";

export interface AnalyticsQuery {
  projectId?: number;
  days?: number;
  team?: string;
}

export const analyticsService = {
  async getWorkload(_query: AnalyticsQuery = {}): Promise<WorkloadEntry[]> {
    void _query;
    throw new NotImplementedError("Developer workload", BLOCKED_ON);
  },

  async getEffortDistribution(_query: AnalyticsQuery = {}): Promise<EffortSlice[]> {
    void _query;
    throw new NotImplementedError("Effort distribution", BLOCKED_ON);
  },

  async getCycleTime(_query: AnalyticsQuery = {}): Promise<CycleStage[]> {
    void _query;
    throw new NotImplementedError("Cycle time breakdown", BLOCKED_ON);
  },

  async getReviewBottlenecks(_query: AnalyticsQuery = {}): Promise<ReviewBottleneck[]> {
    void _query;
    throw new NotImplementedError("Review bottlenecks", BLOCKED_ON);
  },
};
