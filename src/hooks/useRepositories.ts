import { useQuery } from "@tanstack/react-query";
import { projectService, type ProjectApiResponse } from "@/services/project.service";
import { repositoryService } from "@/services/repository.service";
import type { Repository } from "@/types/repository";

const REPOSITORIES_QUERY_KEY = ["integrations", "repositories"] as const;
const PROJECTS_QUERY_KEY = ["projects", "all"] as const;

function withProjectNames(
  repositories: Repository[] | undefined,
  projects: ProjectApiResponse[] | undefined
): Repository[] | undefined {
  if (!repositories) return repositories;

  const namesById = new Map(
    (projects ?? []).map((project) => [String(project.projectId), project.projectName])
  );

  return repositories.map((repository) => ({
    ...repository,
    projectName:
      repository.projectId === null
        ? undefined
        : namesById.get(String(repository.projectId)),
  }));
}

function validRepositoryId(id: number | undefined): id is number {
  return typeof id === "number" && Number.isInteger(id) && id > 0;
}

export function useRepositories() {
  const repositoriesQuery = useQuery({
    queryKey: REPOSITORIES_QUERY_KEY,
    queryFn: () => repositoryService.getRepositories(),
    staleTime: 60_000,
  });
  const projectsQuery = useQuery({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: () => projectService.getAll(),
    staleTime: 60_000,
  });

  return {
    ...repositoriesQuery,
    data: withProjectNames(repositoriesQuery.data, projectsQuery.data),
  };
}

export function useRepositoryDetail(id: number | undefined) {
  const repositoryQuery = useQuery({
    queryKey: [...REPOSITORIES_QUERY_KEY, id ?? null],
    queryFn: () => repositoryService.getRepositoryById(id as number),
    enabled: validRepositoryId(id),
    staleTime: 60_000,
  });
  const projectsQuery = useQuery({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: () => projectService.getAll(),
    staleTime: 60_000,
  });

  return {
    ...repositoryQuery,
    data: withProjectNames(
      repositoryQuery.data ? [repositoryQuery.data] : undefined,
      projectsQuery.data
    )?.[0],
  };
}
