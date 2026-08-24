import { apiClient } from "./api-client";
import type {
  Deployment,
  DeploymentEnvironment,
  DeploymentStatus,
  DoraSummary,
  DoraMetric,
  DoraRating,
  DoraMetricKey,
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

function normalizeKey(key: string): DoraMetricKey {
  const clean = String(key || "").toLowerCase().replace(/_/g, "");
  if (clean === "deploymentfrequency" || clean === "deployfrequency") return "deploymentFrequency";
  if (clean === "leadtime" || clean === "leadtimeforchanges") return "leadTime";
  if (clean === "mttr" || clean === "meantimetorecovery") return "mttr";
  if (clean === "changefailurerate" || clean === "failurerate") return "changeFailureRate";
  return key as DoraMetricKey;
}

function normalizeRating(rating?: string, value?: number | null): DoraRating {
  if (!rating || rating === "NOT_AVAILABLE") {
    if (value !== null && value !== undefined) return "MEDIUM";
    return "NOT_AVAILABLE";
  }
  const r = String(rating).toUpperCase().replace(/\s+/g, "_");
  if (["ELITE", "HIGH", "MEDIUM", "LOW", "NOT_AVAILABLE"].includes(r)) {
    return r as DoraRating;
  }
  return "NOT_AVAILABLE";
}

interface RawHistoryPoint {
  date?: string;
  timestamp?: string;
  value?: number | null;
  val?: number | null;
}

interface RawMetric {
  key?: string;
  metricKey?: string;
  name?: string;
  value?: number | null;
  metricValue?: number | null;
  currentValue?: number | null;
  val?: number | null;
  history?: RawHistoryPoint[];
  rating?: string;
  sampleSize?: number;
  samples?: number;
  previousValue?: number | null;
  prevValue?: number | null;
  unit?: string;
}

function normalizeMetric(raw: RawMetric): DoraMetric {
  const key = normalizeKey(raw.key || raw.metricKey || raw.name || "");
  
  let val: number | null = raw.value ?? raw.metricValue ?? raw.currentValue ?? raw.val ?? null;
  
  const history = Array.isArray(raw.history)
    ? raw.history.map((pt: RawHistoryPoint) => ({
        date: pt.date || pt.timestamp || "",
        value: pt.value ?? pt.val ?? null,
      }))
    : [];

  // Fallback: If summary value is null/undefined or 0, but history contains positive data points
  if ((val === null || val === 0) && history.length > 0) {
    const validPoints = history.filter((pt) => pt.value !== null && !isNaN(Number(pt.value)));
    const total = validPoints.reduce((acc: number, pt) => acc + Number(pt.value), 0);
    if (total > 0) {
      if (key === "deploymentFrequency") {
        val = total / Math.max(1, history.length);
      } else {
        val = total / validPoints.length;
      }
    }
  }

  let rating = normalizeRating(raw.rating, val);
  if (key === "deploymentFrequency" && val !== null && val > 0 && (raw.rating === "LOW" || !raw.rating)) {
    rating = val >= 1 ? "HIGH" : val >= 0.2 ? "MEDIUM" : "LOW";
  }

  const sampleSize = raw.sampleSize ?? raw.samples ?? (history.length > 0 ? history.length : 0);
  const previousValue = raw.previousValue ?? raw.prevValue ?? null;
  const unit = raw.unit || (key === "leadTime" || key === "mttr" ? "hours" : key === "changeFailureRate" ? "%" : "deployments/day");

  return {
    key: key as DoraMetricKey,
    value: val,
    unit,
    rating,
    previousValue,
    sampleSize,
    history,
  };
}

export function normalizeDoraSummary(data: DoraSummary): DoraSummary {
  if (!data) return data;
  const rawMetrics = Array.isArray(data.metrics) ? data.metrics : ([] as DoraMetric[]);
  const metrics = rawMetrics.map((metric) => normalizeMetric(metric as RawMetric));
  return {
    ...data,
    metrics,
  };
}

export const doraService = {
  async getSummary(query: DoraQuery): Promise<DoraSummary> {
    const res = await apiClient.get<DoraSummary>("/api/metrics/dora", { params: { ...query } });
    return normalizeDoraSummary(res);
  },

  getWorkload(query: WorkloadQuery): Promise<WorkloadEntry[]> {
    return apiClient.get<WorkloadEntry[]>("/api/metrics/workload", { params: { ...query } });
  },

  getDeployments(query: DeploymentQuery): Promise<Deployment[]> {
    return apiClient.get<Deployment[]>("/api/metrics/deployments", { params: { ...query } });
  },
};
