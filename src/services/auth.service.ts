import { apiClient } from "./api-client";
import * as session from "@/lib/auth";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  AcceptProjectInvitationResponse,
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
    return apiClient.post<AuthResponse>("/auth/login", credentials, {
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
    return apiClient.post<AuthResponse>("/auth/register", data, {
      requiresAuth: false,
    });
  },

  /**
   * POST /api/auth/invitations/project/accept?token= → 200
   * A signed-in user accepts the project invitation emailed to them. The
   * account's email must match the invited address (403 otherwise); 400 if the
   * invitation expired or was already used; 409 if it belongs to another company.
   * The account's company may change, so sign in again afterwards: the existing
   * JWT still carries the old companyId.
   */
  async acceptProjectInvitation(token: string): Promise<AcceptProjectInvitationResponse> {
    return apiClient.post<AcceptProjectInvitationResponse>(
      `/auth/invitations/project/accept?token=${encodeURIComponent(token)}`,
    );
  },

  /**
   * POST /api/auth/companies/{id}/switch → 200, a NEW token scoped to that
   * company. Needed to open a project that belongs to a company other than the
   * one the current token names: every downstream service scopes by the token's
   * companyId, so the old token gets a 404 for it. 403 if the caller does not
   * belong to that company.
   */
  async switchCompany(companyId: number): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(
      `/auth/companies/${encodeURIComponent(String(companyId))}/switch`,
    );
  },

  /** GET /api/auth/me — the only source of companyId and projectRoles. */
  async getMe(token?: string): Promise<UserProfileResponse> {
    return apiClient.get<UserProfileResponse>("/auth/me", { token });
  },

  // ─── session helpers (delegate to lib/auth so storage lives in one place) ───
  getToken: session.getToken,
  setToken: session.setToken,
  getStoredUser: session.getStoredUser,
  setStoredUser: session.setStoredUser,
  clearSession: session.clearSession,
  isTokenExpired: session.isTokenExpired,
};
