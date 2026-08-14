import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { alertService } from "@/services/alert.service";
import { QUERY_KEYS } from "@/lib/constants";
import { unavailable } from "@/lib/errors";
import type { CreateAlertRuleRequest } from "@/types/notification";

/**
 * Alert rules — fully wired.
 *
 * `companyId` is never hardcoded: it comes from GET /api/auth/me via the auth
 * store. The query stays disabled until it is known, otherwise the first render
 * would fire a request with `companyId=undefined`.
 */
export function useAlertRules(companyId: number | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.alertRules(companyId),
    queryFn: () => alertService.getAlertRules(companyId as number),
    enabled: typeof companyId === "number",
    staleTime: 1000 * 60,
  });
}

export function useAlertRule(ruleId: number | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.alertRule(ruleId as number),
    queryFn: () => alertService.getAlertRule(ruleId as number),
    enabled: typeof ruleId === "number",
  });
}

export function useCreateAlertRule(companyId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rule: CreateAlertRuleRequest) => alertService.createAlertRule(rule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.alertRules(companyId) });
    },
  });
}

/** Soft delete — the rule comes back with active=false and drops off the list. */
export function useDeleteAlertRule(companyId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ruleId: number) => alertService.deleteAlertRule(ruleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.alertRules(companyId) });
    },
  });
}

/**
 * Triggered alert HISTORY has no endpoint — notification-service stores rules,
 * not deliveries. Kept so the alerts page can show an honest empty tab.
 */
export function useAlerts() {
  return unavailable("Alert history", "an alert history endpoint");
}
