"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { hasValidSession } from "./auth";
import { isCompanyAdmin } from "./permissions";
import { useHasMounted } from "@/hooks/useHasMounted";

/**
 * Client-side route guards.
 *
 * ⚠️ THIS IS A UX GATE ONLY. It hides screens the user cannot use and sends
 * them somewhere sensible — it is NOT a security boundary. Anyone can edit
 * client state or call the API directly. Authorisation is enforced
 * independently by the gateway's JwtAuthenticationFilter on every protected
 * route; this file must never be the only thing standing between a user and
 * data they should not see.
 */

/** Redirects to /login when there is no usable session. */
export function useRequireAuth(): { isChecking: boolean; isAuthed: boolean } {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const hasMounted = useHasMounted();

  // Trust the store first; fall back to storage so a reload doesn't bounce the
  // user out before the session has rehydrated. The storage read is deferred
  // until mount — on the server it always answers "no session", and branching
  // the tree on it there breaks hydration.
  const isAuthed = isAuthenticated || (hasMounted && hasValidSession());

  useEffect(() => {
    // Never redirect on the pre-mount pass: `hasValidSession()` has not been
    // consulted yet, so a signed-in user would be bounced to /login.
    if (!hasMounted) return;
    if (!isAuthed) {
      const target = pathname ? `?callbackUrl=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${target}`);
    }
  }, [hasMounted, isAuthed, pathname, router]);

  return { isChecking: !hasMounted || !isAuthed, isAuthed };
}

/**
 * Gates /admin/** on a company-wide admin role. Non-admins are sent to the
 * workspace rather than the login page — they are signed in, just not for this.
 */
export function useRequireAdmin(): { isChecking: boolean; isAllowed: boolean } {
  const router = useRouter();
  const { isAuthed } = useRequireAuth();
  const user = useSelector((s: RootState) => s.auth.user);

  // On a hard refresh the token is available in localStorage before Redux has
  // rehydrated the stored user/profile. Do not interpret that temporary null
  // user as a non-admin and redirect away from /admin prematurely.
  const hasResolvedUser = user !== null;
  const isAllowed = isAuthed && hasResolvedUser && isCompanyAdmin(user);

  useEffect(() => {
    if (isAuthed && hasResolvedUser && !isCompanyAdmin(user)) {
      router.replace("/dashboard");
    }
  }, [hasResolvedUser, isAuthed, user, router]);

  return { isChecking: !isAuthed || !hasResolvedUser, isAllowed };
}
