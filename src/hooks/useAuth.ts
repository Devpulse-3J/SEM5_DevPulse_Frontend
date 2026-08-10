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
import type { LoginRequest, RegisterRequest, AuthResponse, UserProfileResponse } from "@/types/auth";

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, systemRole, isAuthenticated, isLoading, error, fieldErrors } =
    useSelector((state: RootState) => state.auth);

  // Initialize auth state from local storage on mount
  useEffect(() => {
    if (!isAuthenticated) {
      const storedToken = authService.getToken();
      const storedUser = authService.getStoredUser();

      if (storedToken && storedUser) {
        dispatch(
          setCredentials({
            token: storedToken,
            user: storedUser,
          })
        );

        // Refresh user profile from backend in background
        authService
          .getMe(storedToken)
          .then((profile) => {
            dispatch(setUserProfile(profile));
            authService.setStoredUser(profile);
          })
          .catch((err) => {
            console.warn("Stored token may have expired or failed refresh:", err);
          });
      }
    }
  }, [dispatch, isAuthenticated]);

  const login = useCallback(
    async (credentials: LoginRequest): Promise<AuthResponse> => {
      dispatch(setAuthLoading(true));
      dispatch(clearAuthError());

      try {
        const authResponse = await authService.login(credentials);

        // Store token & user locally
        authService.setToken(authResponse.accessToken);
        authService.setStoredUser(authResponse);

        // Update Redux state
        dispatch(
          setCredentials({
            token: authResponse.accessToken,
            user: authResponse,
          })
        );

        // Fetch detailed profile in the background
        try {
          const profile = await authService.getMe(authResponse.accessToken);
          dispatch(setUserProfile(profile));
          authService.setStoredUser(profile);
        } catch {
          // Ignore background fetch error
        }

        return authResponse;
      } catch (err: unknown) {
        let message = "Failed to sign in. Please check your credentials.";
        let errFields: Record<string, string> | undefined;

        if (err instanceof ApiError) {
          message = (err.message && err.message.trim()) || message;
          errFields = err.fieldErrors;
        } else if (err instanceof Error) {
          message = (err.message && err.message.trim()) || message;
        }

        console.warn("Login rejected:", { message, fieldErrors: errFields, err });
        dispatch(setAuthError({ message, fieldErrors: errFields }));
        throw err;
      } finally {
        dispatch(setAuthLoading(false));
      }
    },
    [dispatch]
  );

  const register = useCallback(
    async (data: RegisterRequest): Promise<AuthResponse> => {
      dispatch(setAuthLoading(true));
      dispatch(clearAuthError());

      try {
        const authResponse = await authService.register(data);

        // Store token & user locally
        authService.setToken(authResponse.accessToken);
        authService.setStoredUser(authResponse);

        // Update Redux state
        dispatch(
          setCredentials({
            token: authResponse.accessToken,
            user: authResponse,
          })
        );

        // Fetch detailed profile in background
        try {
          const profile = await authService.getMe(authResponse.accessToken);
          dispatch(setUserProfile(profile));
          authService.setStoredUser(profile);
        } catch {
          // Ignore background fetch error
        }

        return authResponse;
      } catch (err: unknown) {
        let message = "Failed to create account. Please try again.";
        let errFields: Record<string, string> | undefined;

        if (err instanceof ApiError) {
          message = (err.message && err.message.trim()) || message;
          errFields = err.fieldErrors;
        } else if (err instanceof Error) {
          message = (err.message && err.message.trim()) || message;
        }

        console.warn("Registration rejected:", { message, fieldErrors: errFields, err });
        dispatch(setAuthError({ message, fieldErrors: errFields }));
        throw err;
      } finally {
        dispatch(setAuthLoading(false));
      }
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    authService.clearSession();
    dispatch(logoutAction());
  }, [dispatch]);

  const fetchProfile = useCallback(async (): Promise<UserProfileResponse | null> => {
    const currentToken = token || authService.getToken();
    if (!currentToken) return null;

    try {
      const profile = await authService.getMe(currentToken);
      dispatch(setUserProfile(profile));
      authService.setStoredUser(profile);
      return profile;
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
      }
      return null;
    }
  }, [dispatch, logout, token]);

  const clearErrors = useCallback(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  return {
    user,
    token,
    systemRole,
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
