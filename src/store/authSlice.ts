import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponse, UserProfileResponse, SystemRole } from "@/types/auth";

interface AuthState {
  user: AuthResponse | UserProfileResponse | null;
  token: string | null;
  systemRole: SystemRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  fieldErrors: Record<string, string> | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  systemRole: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  fieldErrors: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        token: string;
        user: AuthResponse | UserProfileResponse;
      }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.systemRole = action.payload.user.systemRole;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      state.fieldErrors = null;
    },
    setUserProfile: (state, action: PayloadAction<UserProfileResponse>) => {
      state.user = action.payload;
      state.systemRole = action.payload.systemRole;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuthError: (
      state,
      action: PayloadAction<{
        message: string;
        fieldErrors?: Record<string, string>;
      }>
    ) => {
      state.error = action.payload.message;
      state.fieldErrors = action.payload.fieldErrors || null;
      state.isLoading = false;
    },
    clearAuthError: (state) => {
      state.error = null;
      state.fieldErrors = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.systemRole = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.fieldErrors = null;
    },
  },
});

export const {
  setCredentials,
  setUserProfile,
  setAuthLoading,
  setAuthError,
  clearAuthError,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
