import { apiClient } from "./api-client";
import type { DevExSummary, ReviewVelocitySummary, WorkloadEntry } from "@/types/metrics";

export interface ReviewVelocityQuery {
  projectId: number;
  windowDays?: number;
}

export interface DevExQuery {
  projectId: number;
  windowDays?: number;
}

export interface WorkloadMetricsQuery {
  projectId: number;
  windowDays?: number;
}

export const metricsService = {
  getReviewVelocity(query: ReviewVelocityQuery): Promise<ReviewVelocitySummary> {
    return apiClient.get<ReviewVelocitySummary>("/metrics/review-velocity", {
      params: {
        projectId: query.projectId,
        windowDays: query.windowDays ?? 30,
      },
    });
  },

  getDevExSummary(query: DevExQuery): Promise<DevExSummary> {
    return apiClient.get<DevExSummary>("/metrics/devex", {
      params: {
        projectId: query.projectId,
        windowDays: query.windowDays ?? 30,
      },
    });
  },

  getWorkload(query: WorkloadMetricsQuery): Promise<WorkloadEntry[]> {
    return apiClient.get<WorkloadEntry[]>("/metrics/workload", {
      params: {
        projectId: query.projectId,
        windowDays: query.windowDays ?? 30,
      },
    });
  },
};

export default metricsService;
