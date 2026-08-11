import { apiClient, ApiError, getApiBaseUrl } from "./api-client";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserProfileResponse,
} from "@/types/auth";

const TOKEN_KEY = "devpulse_token";
const USER_KEY = "devpulse_user";

export const authService = {
  /**
   * Log in an existing user
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const baseUrl = getApiBaseUrl();
    console.groupCollapsed(
      `%c[AuthService:Login] Initiating login for: ${credentials.email}`,
      "color: #3b82f6; font-weight: bold; font-size: 11px;"
    );
    console.log("🌐 Target Base URL:", baseUrl);
    console.log("🎯 Primary Route:", `${baseUrl}/api/auth/login`);
    console.log("🔄 Fallback Route:", `${baseUrl}/auth/login`);
    console.log("📧 Email:", credentials.email);
    console.log("🔒 Password Length:", credentials.password ? credentials.password.length : 0);
    console.log("🕒 Timestamp:", new Date().toISOString());
    console.groupEnd();

    try {
      const response = await apiClient.post<AuthResponse>("/api/auth/login", credentials);
      console.log(
        `%c[AuthService:Login:SUCCESS]%c Logged in via /api/auth/login:`,
        "color: #10b981; font-weight: bold;",
        "color: inherit;",
        {
          userId: response.userId,
          email: response.email,
          fullName: response.fullName,
          systemRole: response.systemRole,
          expiresIn: response.expiresIn,
          tokenPreview: response.accessToken ? `${response.accessToken.slice(0, 15)}...` : undefined,
        }
      );
      return response;
    } catch (err: unknown) {
      if (err instanceof ApiError && (err.status === 404 || err.status === 403)) {
        console.warn(
          `%c[AuthService:Login:FALLBACK]%c /api/auth/login returned HTTP ${err.status}. Attempting fallback endpoint /auth/login...`,
          "color: #f59e0b; font-weight: bold;",
          "color: inherit;"
        );
        try {
          const fallbackResponse = await apiClient.post<AuthResponse>("/auth/login", credentials);
          console.log(
            `%c[AuthService:Login:SUCCESS (Fallback)]%c Logged in via /auth/login:`,
            "color: #10b981; font-weight: bold;",
            "color: inherit;",
            {
              userId: fallbackResponse.userId,
              email: fallbackResponse.email,
              fullName: fallbackResponse.fullName,
              systemRole: fallbackResponse.systemRole,
              expiresIn: fallbackResponse.expiresIn,
              tokenPreview: fallbackResponse.accessToken ? `${fallbackResponse.accessToken.slice(0, 15)}...` : undefined,
            }
          );
          return fallbackResponse;
        } catch (fallbackErr: unknown) {
          console.warn(
            `%c[AuthService:Login:FALLBACK-ERROR]%c Fallback /auth/login also failed:`,
            "color: #ef4444; font-weight: bold;",
            "color: inherit;",
            fallbackErr
          );
          throw fallbackErr;
        }
      }

      console.warn(
        `%c[AuthService:Login:ERROR]%c Login failed for ${credentials.email}:`,
        "color: #ef4444; font-weight: bold;",
        "color: inherit;",
        {
          status: err instanceof ApiError ? err.status : 0,
          message: err instanceof Error ? err.message : String(err),
          fieldErrors: err instanceof ApiError ? err.fieldErrors : undefined,
          error: err instanceof ApiError ? err.error : undefined,
        }
      );
      throw err;
    }
  },

  /**
   * Register a new user (Signup)
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const baseUrl = getApiBaseUrl();
    console.groupCollapsed(
      `%c[AuthService:Signup] Initiating signup for: ${data.email}`,
      "color: #8b5cf6; font-weight: bold; font-size: 11px;"
    );
    console.log("🌐 Target Base URL:", baseUrl);
    console.log("🎯 Primary Route:", `${baseUrl}/api/auth/register`);
    console.log("🔄 Fallback Route:", `${baseUrl}/auth/register`);
    console.log("👤 Full Name:", data.fullName);
    console.log("📧 Email:", data.email);
    console.log("🏢 Company ID:", data.companyId);
    console.log("🔒 Password Length:", data.password ? data.password.length : 0);
    console.log("🕒 Timestamp:", new Date().toISOString());
    console.groupEnd();

    try {
      const response = await apiClient.post<AuthResponse>("/api/auth/register", data);
      console.log(
        `%c[AuthService:Signup:SUCCESS]%c User registered via /api/auth/register:`,
        "color: #10b981; font-weight: bold;",
        "color: inherit;",
        {
          userId: response.userId,
          email: response.email,
          fullName: response.fullName,
          systemRole: response.systemRole,
          expiresIn: response.expiresIn,
          tokenPreview: response.accessToken ? `${response.accessToken.slice(0, 15)}...` : undefined,
        }
      );
      return response;
    } catch (err: unknown) {
      if (err instanceof ApiError && (err.status === 404 || err.status === 403)) {
        console.warn(
          `%c[AuthService:Signup:FALLBACK]%c /api/auth/register returned HTTP ${err.status}. Attempting fallback endpoint /auth/register...`,
          "color: #f59e0b; font-weight: bold;",
          "color: inherit;"
        );
        try {
          const fallbackResponse = await apiClient.post<AuthResponse>("/auth/register", data);
          console.log(
            `%c[AuthService:Signup:SUCCESS (Fallback)]%c User registered via /auth/register:`,
            "color: #10b981; font-weight: bold;",
            "color: inherit;",
            {
              userId: fallbackResponse.userId,
              email: fallbackResponse.email,
              fullName: fallbackResponse.fullName,
              systemRole: fallbackResponse.systemRole,
              expiresIn: fallbackResponse.expiresIn,
              tokenPreview: fallbackResponse.accessToken ? `${fallbackResponse.accessToken.slice(0, 15)}...` : undefined,
            }
          );
          return fallbackResponse;
        } catch (fallbackErr: unknown) {
          console.warn(
            `%c[AuthService:Signup:FALLBACK-ERROR]%c Fallback /auth/register also failed:`,
            "color: #ef4444; font-weight: bold;",
            "color: inherit;",
            fallbackErr
          );
          throw fallbackErr;
        }
      }

      console.warn(
        `%c[AuthService:Signup:ERROR]%c Signup failed for ${data.email}:`,
        "color: #ef4444; font-weight: bold;",
        "color: inherit;",
        {
          status: err instanceof ApiError ? err.status : 0,
          message: err instanceof Error ? err.message : String(err),
          fieldErrors: err instanceof ApiError ? err.fieldErrors : undefined,
          error: err instanceof ApiError ? err.error : undefined,
        }
      );
      throw err;
    }
  },

  /**
   * Fetch authenticated user's profile and project memberships
   */
  async getMe(token?: string): Promise<UserProfileResponse> {
    try {
      const profile = await apiClient.get<UserProfileResponse>("/api/auth/me", { token });
      return profile;
    } catch (err: unknown) {
      if (err instanceof ApiError && (err.status === 404 || err.status === 403)) {
        const fallbackProfile = await apiClient.get<UserProfileResponse>("/auth/me", { token });
        return fallbackProfile;
      }
      throw err;
    }
  },

  /**
   * Check Auth service health
   */
  async checkHealth(): Promise<{ status: string }> {
    try {
      const res = await apiClient.get<{ status: string }>("/actuator/health");
      return res;
    } catch (err) {
      throw err;
    }
  },

  // ─── Local Storage & Session Helpers ───

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
  },

  getStoredUser(): AuthResponse | UserProfileResponse | null {
    if (typeof window === "undefined") return null;
    const item = localStorage.getItem(USER_KEY);
    if (!item) return null;
    try {
      return JSON.parse(item);
    } catch {
      return null;
    }
  },

  setStoredUser(user: AuthResponse | UserProfileResponse): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeStoredUser(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(USER_KEY);
  },

  clearSession(): void {
    this.removeToken();
    this.removeStoredUser();
  },
};
