import { authService } from "./auth.service";
import { NotImplementedError } from "@/lib/errors";
import type { ProjectMembership } from "@/types/project";

/**
 * Projects.
 *
 * There is no /api/projects endpoint. The ONLY place project membership exists
 * in this API is `projectRoles` on GET /api/auth/me, so that is what the
 * picker and every permission check read from.
 */
export const projectService = {
  /** Derived from GET /api/auth/me — not a project endpoint. */
  async getMyMemberships(): Promise<ProjectMembership[]> {
    const profile = await authService.getMe();
    return profile.projectRoles ?? [];
  },

  async getProjects(): Promise<never> {
    throw new NotImplementedError("Project directory", "a project service");
  },

  async createProject(): Promise<never> {
    throw new NotImplementedError("Creating projects", "a project service");
  },
};
