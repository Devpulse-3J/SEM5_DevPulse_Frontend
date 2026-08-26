"use client";

import { STORAGE_KEYS } from "./constants";
import type { AuthResponse, UserProfileResponse } from "@/types/user";

/**
 * Token storage and expiry.
 *
 * There is NO refresh endpoint — /api/auth/refresh is declared public at the
 * gateway but has no handler, so it 404s. When a token expires the only
 * correct move is to clear it and send the user back to login. Nothing here
 * should ever attempt a silent renewal.
 */

const isBrowser = () => typeof window !== "undefined";

export function getToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(STORAGE_KEYS.token);
}

/**
 * Stores the token and converts `expiresIn` (SECONDS from now) into an absolute
 * unix-ms deadline, so a page reload can tell whether it is still valid without
 * decoding the JWT.
 */
export function setToken(token: string, expiresInSeconds?: number): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.token, token);
  if (typeof expiresInSeconds === "number" && Number.isFinite(expiresInSeconds)) {
    const expiresAt = Date.now() + expiresInSeconds * 1000;
    localStorage.setItem(STORAGE_KEYS.tokenExpiresAt, String(expiresAt));
  }
}

export function getTokenExpiresAt(): number | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(STORAGE_KEYS.tokenExpiresAt);
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * True when the token is past its deadline. An unknown deadline is treated as
 * NOT expired — the server is the authority and will 401 if it disagrees;
 * guessing "expired" here would log out a user holding a perfectly good token.
 */
export function isTokenExpired(): boolean {
  const expiresAt = getTokenExpiresAt();
  if (expiresAt === null) return false;
  return Date.now() >= expiresAt;
}

export function getStoredUser(): AuthResponse | UserProfileResponse | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(STORAGE_KEYS.user);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthResponse | UserProfileResponse;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthResponse | UserProfileResponse): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

/** Wipes every trace of the session. Called on logout and on any 401. */
export function clearSession(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.tokenExpiresAt);
  localStorage.removeItem(STORAGE_KEYS.user);
}

/**
 * True when there is a stored token that has not passed its deadline.
 * This is a client-side hint only — it does not prove the token is valid.
 */
export function hasValidSession(): boolean {
  return Boolean(getToken()) && !isTokenExpired();
}
