import { apiClient } from "./api-client";
import type {
  Deployment,
  DeploymentEnvironment,
  DeploymentStatus,
  DoraSummary,
  WorkloadEntry,
} from "@/types/dora";

export interface DoraQuery {
  projectId: number;
  windowDays?: number;
  historyDays?: number;
}

export interface WorkloadQuery {
  projectId: number;
  windowDays?: number;
}

export interface DeploymentQuery {
  projectId: number;
  environment?: DeploymentEnvironment;
  status?: DeploymentStatus;
  limit?: number;
  offset?: number;
}

export const doraService = {
  getSummary(query: DoraQuery): Promise<DoraSummary> {
    return apiClient.get<DoraSummary>("/api/metrics/dora", { params: { ...query } });
  },

  getWorkload(query: WorkloadQuery): Promise<WorkloadEntry[]> {
    return apiClient.get<WorkloadEntry[]>("/api/metrics/workload", { params: { ...query } });
  },

  getDeployments(query: DeploymentQuery): Promise<Deployment[]> {
    return apiClient.get<Deployment[]>("/api/metrics/deployments", { params: { ...query } });
  },
};
