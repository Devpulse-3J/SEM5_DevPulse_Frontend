import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { alertService } from "@/services/alert.service";
import type { AlertRule } from "@/types/notification";

export function useAlerts() {
  return useQuery({
    queryKey: ["alerts"],
    queryFn: () => alertService.getAlerts(),
    staleTime: 1000 * 30, // 30s
  });
}

export function useAlertRules() {
  return useQuery({
    queryKey: ["alert-rules"],
    queryFn: () => alertService.getAlertRules(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useAcknowledgeAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (alertId: string) => alertService.acknowledgeAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
}

export function useCreateAlertRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rule: Omit<AlertRule, "id" | "createdAt">) =>
      alertService.createAlertRule(rule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alert-rules"] });
    },
  });
}
