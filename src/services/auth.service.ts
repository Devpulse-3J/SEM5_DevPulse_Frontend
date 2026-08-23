import { apiClient } from "./api-client";
import * as session from "@/lib/auth";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserProfileResponse,
} from "@/types/user";

/**
 * Auth calls against the real gateway routes.
 *
 * Note there is deliberately NO unprefixed retry (`/auth/login` after
 * `/api/auth/login` 404s). That pattern doubled every failed request and hid
 * misconfiguration behind a second failure — if `/api/auth/login` 404s, the
 * gateway route is wrong and that should be loud.
 *
 * There is also no refresh: `/api/auth/refresh` is declared public at the
 * gateway but has no handler behind it.
 */
export const authService = {
  /** POST /api/auth/login → 200 */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/api/auth/login", credentials, {
      requiresAuth: false,
    });
  },

  /**
   * POST /api/auth/register → 201
   * Branches on the optional fields:
   *   isCompany + companyName → new company, caller becomes admin
   *   companyId               → joins that company as member (404 if missing)
   *   neither                 → personal workspace, member
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/api/auth/register", data, {
      requiresAuth: false,
    });
  },

  /** GET /api/auth/me — the only source of companyId and projectRoles. */
  async getMe(token?: string): Promise<UserProfileResponse> {
    return apiClient.get<UserProfileResponse>("/api/auth/me", { token });
  },

  // ─── session helpers (delegate to lib/auth so storage lives in one place) ───
  getToken: session.getToken,
  setToken: session.setToken,
  getStoredUser: session.getStoredUser,
  setStoredUser: session.setStoredUser,
  clearSession: session.clearSession,
  isTokenExpired: session.isTokenExpired,
};
