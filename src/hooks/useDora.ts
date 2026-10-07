import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";
import { doraService, type DeploymentQuery } from "@/services/dora.service";

function validProject(projectId: number | undefined): projectId is number {
  return typeof projectId === "number" && Number.isInteger(projectId) && projectId > 0;
}

export function useDoraSummary(
  projectId: number | undefined,
  windowDays = 30,
  historyDays = 30,
) {
  return useQuery({
    queryKey: QUERY_KEYS.dora(projectId, windowDays, historyDays),
    queryFn: () =>
      doraService.getSummary({ projectId: projectId as number, windowDays, historyDays }),
    enabled: validProject(projectId),
    staleTime: 60_000,
  });
}

export function useWorkload(projectId: number | undefined, windowDays = 30) {
  return useQuery({
    queryKey: QUERY_KEYS.workload(projectId, windowDays),
    queryFn: () => doraService.getWorkload({ projectId: projectId as number, windowDays }),
    enabled: validProject(projectId),
    staleTime: 60_000,
  });
}

export function useDeployments(
  projectId: number | undefined,
  filters: Omit<DeploymentQuery, "projectId"> = {},
) {
  return useQuery({
    queryKey: QUERY_KEYS.deployments(projectId, filters),
    queryFn: () => doraService.getDeployments({ projectId: projectId as number, ...filters }),
    enabled: validProject(projectId),
    staleTime: 60_000,
  });
}

/** Recalculates the stored daily snapshots, then reloads every DORA query. */
export function useRebuildDoraHistory(projectId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (days: number = 30) => {
      if (!validProject(projectId)) {
        return Promise.reject(new Error("No project selected."));
      }
      return doraService.rebuildSnapshots(projectId, days);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["metrics", "dora"] }),
  });
}
