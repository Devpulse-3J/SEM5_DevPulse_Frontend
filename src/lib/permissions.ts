import type {
  ProjectRole,
  ProjectRoleName,
  SystemRole,
  UserProfileResponse,
} from "@/types/user";

/**
 * Permission checks.
 *
 * Roles are per (user, project): the same person can be manager on one project
 * and developer on another, so a check MUST name the project it is about.
 * Resolving from a single global role is the bug this module exists to prevent.
 *
 * `systemRole: "admin"` is company-wide and overrides per-project roles.
 */

export type Action =
  | "project:view"
  | "project:manage"
  | "metrics:viewTeam"
  | "alerts:view"
  | "alerts:manage"
  | "admin:access";

/** Minimal shape a check needs — anything carrying systemRole + projectRoles. */
export interface PermissionSubject {
  systemRole: SystemRole;
  projectRoles?: ProjectRole[];
}

export function isCompanyAdmin(user: PermissionSubject | null | undefined): boolean {
  return user?.systemRole === "admin";
}

/** The caller's role on one project, or null if they are not a member. */
export function roleOnProject(
  user: PermissionSubject | null | undefined,
  projectId: number
): ProjectRoleName | null {
  if (!user?.projectRoles) return null;
  const found = user.projectRoles.find((p) => p.projectId === projectId);
  return found ? found.role : null;
}

export function isManagerOf(
  user: PermissionSubject | null | undefined,
  projectId: number
): boolean {
  return roleOnProject(user, projectId) === "manager";
}

/**
 * Central check. `projectId` is required for every project-scoped action;
 * pass null only for company-wide ones (currently just "admin:access").
 */
export function can(
  user: PermissionSubject | null | undefined,
  projectId: number | null,
  action: Action
): boolean {
  if (!user) return false;

  // Company admins override per-project roles.
  if (isCompanyAdmin(user)) return true;

  if (action === "admin:access") return false;

  if (projectId === null) return false;
  const role = roleOnProject(user, projectId);
  if (!role) return false;

  switch (action) {
    // Any member of the project.
    case "project:view":
    case "alerts:view":
      return true;
    // Managers only.
    case "project:manage":
    case "metrics:viewTeam":
    case "alerts:manage":
      return role === "manager";
    default:
      return false;
  }
}

/** Convenience for the profile response, which carries both fields already. */
export function canWithProfile(
  profile: UserProfileResponse | null | undefined,
  projectId: number | null,
  action: Action
): boolean {
  return can(profile, projectId, action);
}
