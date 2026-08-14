/**
 * Admin → Projects UI types.
 *
 * These describe the shapes the admin Projects screen works with locally. No
 * endpoint serves them yet, so nothing is seeded — the list starts empty and
 * only ever contains what you create in the session. Any data you see here is
 * data you typed.
 *
 * Kept separate from `src/types/project.ts`, which mirrors what
 * `GET /api/auth/me` actually returns (a project id and role, nothing more).
 * Mixing these fields into that file would make an unbuilt contract look real.
 */

/** Per-project role, uppercase for display. The API sends these lowercase. */
export type ProjectRoleLabel = "MANAGER" | "DEVELOPER";

export interface Project {
  id: string;
  name: string;
  description?: string;
  jiraProjectKey?: string;
  memberCount: number;
  /** ISO-8601 */
  createdAt: string;
}

export interface ProjectMember {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  role: ProjectRoleLabel;
  /** ISO-8601 */
  joinedAt: string;
  /** Invited but not yet accepted — there is no invitation backend yet. */
  pending?: boolean;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  jiraProjectKey?: string;
}

export interface InviteMemberRequest {
  email: string;
  role: ProjectRoleLabel;
}
