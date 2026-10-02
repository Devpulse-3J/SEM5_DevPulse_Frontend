import { useQuery } from "@tanstack/react-query";
import { integrationsApiService, type JiraIssue } from "@/services/api/integrations";

export function useJiraIssues() {
  return useQuery({
    queryKey: ["jira", "issues"],
    queryFn: () => integrationsApiService.getJiraIssues(),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}

export function useMyAssignedJiraTasks(userId: number | undefined, projectId?: number | undefined) {
  const query = useJiraIssues();

  const assignedTasks = (query.data || []).filter((issue: JiraIssue) => {
    // If user has a valid userId, filter by assigneeId
    if (userId !== undefined && issue.assigneeId !== null && issue.assigneeId !== undefined) {
      return Number(issue.assigneeId) === Number(userId);
    }
    // If no assigneeId set on task or userId not provided, return false
    return false;
  });

  return {
    ...query,
    assignedTasks,
    allTasks: query.data || [],
  };
}
