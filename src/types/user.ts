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
  /**
   * The company the project lives in. A user can hold project roles in several
   * companies but a token is scoped to one, so this is what tells the picker it
   * must switch company before opening the project. Absent on older backends.
   */
  companyId?: number;
  companyName?: string;
  projectName?: string;
}

/** A company the user belongs to and their role there ("admin" or "member"). */
export interface CompanyMembership {
  companyId: number;
  companyName?: string;
  role: SystemRole;
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
  /**
   * One-time token from a project invitation email. The server checks it
   * against `email`, joins the inviting company as a member and attaches the
   * invited project role. Overrides companyId / companyName / isCompany.
   */
  inviteToken?: string;
}

/** Body of POST /api/auth/invitations/project/accept. */
export interface AcceptProjectInvitationResponse {
  status: string;
  projectId: number;
  /** Lowercase project role: "manager" | "developer". */
  role: string;
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
  /** The company this token is scoped to. Absent on older backends. */
  companyId?: number | null;
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
  /** The company the current token is scoped to (not always the home company). */
  companyId: number;
  companyName: string;
  projectRoles: ProjectRole[];
  /** Every company the user belongs to. Absent on older backends. */
  companies?: CompanyMembership[];
  /** Numeric id of the linked GitHub account; null/absent when none is linked. */
  githubId?: number | null;
}

/** Who a GitHub username resolves to, shown for confirmation before it is linked. */
export interface GithubPreview {
  githubId: number;
  githubLogin: string;
  name?: string | null;
  avatarUrl?: string | null;
  profileUrl?: string | null;
  /** True when a different DevPulse user already has this account linked. */
  linkedToAnotherUser: boolean;
}

/** Body of PUT /api/auth/me/github: the GitHub account now linked. */
export interface LinkGithubResponse {
  githubId: number;
  githubLogin: string;
}
