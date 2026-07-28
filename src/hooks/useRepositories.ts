import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { repositoryService } from "@/services/repository.service";

export function useRepositories() {
  return useQuery({
    queryKey: ["repositories"],
    queryFn: () => repositoryService.getRepositories(),
    staleTime: 1000 * 60 * 5, // 5 mins
  });
}

export function useRepositoryDetail(id: string) {
  return useQuery({
    queryKey: ["repository", id],
    queryFn: () => repositoryService.getRepositoryById(id),
    enabled: Boolean(id),
  });
}

export function useSyncRepository() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => repositoryService.syncRepository(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["repositories"] });
      queryClient.invalidateQueries({ queryKey: ["repository", id] });
    },
  });
}
