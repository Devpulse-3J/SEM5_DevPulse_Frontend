/**
 * Admin → Projects UI types.
 *
 * These describe the admin Projects screens and the project/GitHub-link API
 * responses. Existing demo rows are still seeded from `lib/mock/projects.ts`.
 *
 * Kept separate from `src/types/project.ts`, which mirrors what
 * `GET /api/auth/me` actually returns (a project id and role, nothing more).
 * Mixing these fields into that file would make an unbuilt contract look real.
 */

/** Per-project role, uppercase for display. The API sends these lowercase. */
export type ProjectRoleLabel = "MANAGER" | "DEVELOPER";

/**
 * Whether the person has accepted. There is no invitation backend yet, so an
 * invited member sits at PENDING forever.
 */
export type MemberStatus = "ACTIVE" | "PENDING";

/**
 * Mocked GitHub link health. SYNCING is a transient state the "Trigger sync"
 * button drops into before returning to CONNECTED.
 */
export type GithubConnectionStatus =
  | "CONNECTED"
  | "DISCONNECTED"
  | "SYNCING"
  | "ERROR";

export interface Project {
  id: string;
  name: string;
  description?: string;
  jiraProjectKey?: string;
  /** Canonical `https://github.com/{owner}/{repo}` form. */
  githubRepoUrl?: string;
  memberCount: number;
  /** ISO-8601 */
  createdAt: string;
}

/**
 * The repo linked to a project. Separate from `Project` because the backend
 * keeps these in two tables (`projects` and `repos`) and one project may
 * eventually hold several repos.
 */
export interface LinkedRepo {
  id: string;
  projectId: string;
  /** Canonical `https://github.com/{owner}/{repo}` form. */
  url: string;
  owner: string;
  name: string;
  /**
   * Per-repo HMAC secret. The backend today uses one global
   * GITHUB_WEBHOOK_SECRET; this field anticipates the per-repo one.
   */
  webhookSecret?: string;
  status: GithubConnectionStatus;
  /** ISO-8601, absent until a sync has run. */
  lastSyncedAt?: string;
}

export interface ProjectMember {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  role: ProjectRoleLabel;
  /** ISO-8601 */
  joinedAt: string;
  status: MemberStatus;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  jiraProjectKey?: string;
  githubRepoUrl?: string;
}

export interface UpdateProjectRequest {
  name: string;
  description?: string;
  jiraProjectKey?: string;
}

export interface InviteMemberRequest {
  email: string;
  role: ProjectRoleLabel;
}
