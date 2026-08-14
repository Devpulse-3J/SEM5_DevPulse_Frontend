import { NotImplementedError } from "@/lib/errors";

/**
 * Dashboard aggregates — NO BACKEND.
 *
 * There is no endpoint that returns a dashboard summary. The dashboard is
 * assembled client-side from whatever individual resources exist, which today
 * is alert rules and the user profile.
 */
export const dashboardService = {
  async getSummary(): Promise<never> {
    throw new NotImplementedError("Dashboard summary", "metrics-service");
  },
};
