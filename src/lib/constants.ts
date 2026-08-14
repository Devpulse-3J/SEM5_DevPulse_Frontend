import type { SystemRole, ProjectRoleName } from "@/types/user";

/** localStorage keys. Kept here so nothing else hardcodes the string. */
export const STORAGE_KEYS = {
  token: "odineye_token",
  /** Unix ms at which the access token expires (derived from expiresIn). */
  tokenExpiresAt: "odineye_token_expires_at",
  user: "odineye_user",
} as const;

/** Company-wide roles, as sent by the backend (lowercase). */
export const SYSTEM_ROLES: Record<string, SystemRole> = {
  ADMIN: "admin",
  MEMBER: "member",
} as const;

/** Per-project roles. There is no "viewer". */
export const PROJECT_ROLES: Record<string, ProjectRoleName> = {
  MANAGER: "manager",
  DEVELOPER: "developer",
} as const;

/**
 * React Query keys. Centralised so invalidation can't drift from the query that
 * produced the data.
 */
export const QUERY_KEYS = {
  me: ["auth", "me"] as const,
  myMemberships: ["auth", "me", "memberships"] as const,
  alertRules: (companyId?: number) => ["alerts", "rules", companyId ?? null] as const,
  alertRule: (id: number) => ["alerts", "rules", id] as const,
} as const;

export const PAGE_SIZES = {
  default: 25,
  table: 25,
  compact: 10,
} as const;

/** Gateway rate limit is 10 req/s sustained, 20 burst. */
export const RATE_LIMIT_MESSAGE = "Too many attempts, please wait";

/** Server-enforced minimum. Mirrored in validators.ts — keep them in step. */
export const PASSWORD_MIN_LENGTH = 8;
