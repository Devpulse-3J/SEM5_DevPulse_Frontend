/**
 * Auth + user types, mirrored from the real backend responses.
 *
 * Field names and casing are taken from the implemented API, not from the
 * design spec. Two traps worth calling out:
 *   - the token field is `accessToken`, not `token`
 *   - `userId` is a NUMBER, and roles are LOWERCASE
 */

/** Company-wide role. Lowercase — this is what the backend sends. */
export type SystemRole = "admin" | "member";

/** Per-project role. There is no "viewer" in this API. */
export type ProjectRoleName = "manager" | "developer";

/** One entry of `projectRoles` on the user profile. */
export interface ProjectRole {
  projectId: number;
  role: ProjectRoleName;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  /** Join an existing company. 404 if it does not exist. */
  companyId?: number;
  /** With isCompany, creates a new company and makes this user its admin. */
  companyName?: string;
  isCompany?: boolean;
}

/** Identical body from POST /api/auth/login and POST /api/auth/register. */
export interface AuthResponse {
  accessToken: string;
  tokenType: "Bearer";
  /** Lifetime in SECONDS (default 3600). There is no refresh endpoint. */
  expiresIn: number;
  userId: number;
  email: string;
  fullName: string;
  systemRole: SystemRole;
}

/**
 * GET /api/auth/me — the only source of company id and project membership in
 * the entire API. Every permission check resolves from `projectRoles`.
 */
export interface UserProfileResponse {
  userId: number;
  email: string;
  fullName: string;
  systemRole: SystemRole;
  companyId: number;
  companyName: string;
  projectRoles: ProjectRole[];
}
