/**
 * Compatibility re-export. The canonical definitions live in `./user`, which is
 * mirrored from the real backend responses.
 *
 * This file previously declared its own `SystemRole` as
 * "ADMIN" | "MANAGER" | "DEVELOPER" | "MEMBER". That was wrong on both counts:
 * the backend sends lowercase, and MANAGER/DEVELOPER are per-project roles that
 * never appear in `systemRole`. Keeping this shim so existing
 * `from "@/types/auth"` imports resolve to the corrected types.
 */
export type {
  SystemRole,
  ProjectRole,
  ProjectRoleName,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserProfileResponse,
} from "./user";

/**
 * Union of every error body the stack can produce. The gateway, auth-service,
 * and Spring's default handler all differ; `api-client` normalises them into
 * `ApiError` so callers never see this shape directly.
 */
export interface AuthErrorResponse {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
  fieldErrors?: Record<string, string>;
}
