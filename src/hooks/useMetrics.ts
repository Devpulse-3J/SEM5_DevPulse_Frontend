import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api-client";
import type { DevExSummary, ReviewVelocitySummary, WorkloadEntry } from "@/types/metrics";

export const useReviewVelocity = (projectId: number | undefined, windowDays: number = 30) => {
  return useQuery({
    queryKey: ["review-velocity", projectId, windowDays],
    queryFn: () =>
      api.get<ReviewVelocitySummary>(
        `/api/metrics/review-velocity?projectId=${projectId}&windowDays=${windowDays}`,
      ),
    enabled: Boolean(projectId),
    staleTime: 60_000,
  });
};

export const useDevExSummary = (projectId: number | undefined, windowDays: number = 30) => {
  return useQuery({
    queryKey: ["devex-summary", projectId, windowDays],
    queryFn: () =>
      api.get<DevExSummary>(
        `/api/metrics/devex?projectId=${projectId}&windowDays=${windowDays}`,
      ),
    enabled: Boolean(projectId),
    staleTime: 60_000,
  });
};

export const useWorkloadMetrics = (projectId: number | undefined, windowDays: number = 30) => {
  return useQuery({
    queryKey: ["workload-metrics", projectId, windowDays],
    queryFn: () =>
      api.get<WorkloadEntry[]>(
        `/api/metrics/workload?projectId=${projectId}&windowDays=${windowDays}`,
      ),
    enabled: Boolean(projectId),
    staleTime: 60_000,
  });
};
