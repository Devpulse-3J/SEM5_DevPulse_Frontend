/**
 * Project types.
 *
 * Deliberately minimal: `GET /api/auth/me` returns only a project id and the
 * caller's role on it. There is no project list endpoint, so there are no
 * names, descriptions, repo counts, or statuses to declare — a field here that
 * the API cannot populate becomes a silent `undefined` in the UI.
 */
import type { ProjectRole, ProjectRoleName } from "./user";

export type { ProjectRole, ProjectRoleName };

/** A membership as returned inside the user profile. */
export type ProjectMembership = ProjectRole;

/** Display label for a project we only know by id. */
export function projectLabel(projectId: number): string {
  return `Project #${projectId}`;
}
