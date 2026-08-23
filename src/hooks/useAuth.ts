"use client";

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import {
  setCredentials,
  setUserProfile,
  setAuthLoading,
  setAuthError,
  clearAuthError,
  logout as logoutAction,
} from "@/store/authSlice";
import { authService } from "@/services/auth.service";
import { ApiError } from "@/services/api-client";
import * as session from "@/lib/auth";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserProfileResponse,
} from "@/types/user";

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, systemRole, isAuthenticated, isLoading, error, fieldErrors } =
    useSelector((state: RootState) => state.auth);

  /**
   * Session bootstrap on mount.
   *
   * A stored token that is past its deadline is dropped immediately rather than
   * being sent — there is no refresh endpoint, so an expired token can only
   * produce a 401.
   */
  useEffect(() => {
    if (isAuthenticated) return;

    const storedToken = session.getToken();
    if (!storedToken) return;

    if (session.isTokenExpired()) {
      session.clearSession();
      dispatch(logoutAction());
      return;
    }

    const storedUser = session.getStoredUser();
    if (storedUser) {
      dispatch(setCredentials({ token: storedToken, user: storedUser }));
    }

    // Rehydrate the authoritative profile (companyId + projectRoles).
    authService
      .getMe(storedToken)
      .then((profile) => {
        dispatch(setUserProfile(profile));
        session.setStoredUser(profile);
      })
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 401) {
          // api-client already cleared storage and redirected.
          dispatch(logoutAction());
        }
      });
  }, [dispatch, isAuthenticated]);

  const persistSession = useCallback(
    (authResponse: AuthResponse) => {
      session.setToken(authResponse.accessToken, authResponse.expiresIn);
      session.setStoredUser(authResponse);
      dispatch(setCredentials({ token: authResponse.accessToken, user: authResponse }));
    },
    [dispatch]
  );

  const toAuthError = (err: unknown, fallback: string) => {
    let message = fallback;
    let errFields: Record<string, string> | undefined;
    if (err instanceof ApiError) {
      message = err.message?.trim() || fallback;
      errFields = err.fieldErrors;
    } else if (err instanceof Error) {
      message = err.message?.trim() || fallback;
    }
    return { message, fieldErrors: errFields };
  };

  const login = useCallback(
    async (credentials: LoginRequest): Promise<AuthResponse> => {
      dispatch(setAuthLoading(true));
      dispatch(clearAuthError());
      try {
        const authResponse = await authService.login(credentials);
        persistSession(authResponse);

        // Pull the full profile so companyId/projectRoles are available.
        try {
          const profile = await authService.getMe(authResponse.accessToken);
          dispatch(setUserProfile(profile));
          session.setStoredUser(profile);
        } catch {
          // Non-fatal: the user is signed in; screens needing the profile retry.
        }
        return authResponse;
      } catch (err: unknown) {
        dispatch(setAuthError(toAuthError(err, "Failed to sign in. Check your credentials.")));
        throw err;
      } finally {
        dispatch(setAuthLoading(false));
      }
    },
    [dispatch, persistSession]
  );

  const register = useCallback(
    async (data: RegisterRequest): Promise<AuthResponse> => {
      dispatch(setAuthLoading(true));
      dispatch(clearAuthError());
      try {
        const authResponse = await authService.register(data);
        persistSession(authResponse);
        try {
          const profile = await authService.getMe(authResponse.accessToken);
          dispatch(setUserProfile(profile));
          session.setStoredUser(profile);
        } catch {
          // Non-fatal.
        }
        return authResponse;
      } catch (err: unknown) {
        dispatch(setAuthError(toAuthError(err, "Failed to create account. Please try again.")));
        throw err;
      } finally {
        dispatch(setAuthLoading(false));
      }
    },
    [dispatch, persistSession]
  );

  const logout = useCallback(() => {
    session.clearSession();
    dispatch(logoutAction());
  }, [dispatch]);

  const fetchProfile = useCallback(async (): Promise<UserProfileResponse | null> => {
    const currentToken = token || session.getToken();
    if (!currentToken) return null;
    try {
      const profile = await authService.getMe(currentToken);
      dispatch(setUserProfile(profile));
      session.setStoredUser(profile);
      return profile;
    } catch {
      return null;
    }
  }, [dispatch, token]);

  const clearErrors = useCallback(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // companyId only exists on the profile response, never on the login response.
  const companyId =
    user && "companyId" in user ? (user.companyId as number | undefined) : undefined;
  const projectRoles = user && "projectRoles" in user ? user.projectRoles : undefined;

  return {
    user,
    token,
    systemRole,
    companyId,
    projectRoles,
    isAuthenticated,
    isLoading,
    error,
    fieldErrors,
    login,
    register,
    logout,
    fetchProfile,
    clearErrors,
  };
}
