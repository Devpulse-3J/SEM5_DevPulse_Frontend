"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { IconGitHub, IconEye, IconEyeOff } from "@/components/icons";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/services/api-client";
import { validateLoginForm, type LoginFormErrors } from "@/lib/validators";
import type { SystemRole } from "@/types/user";

// NOTE: this page previously shipped a DEMO_ROLES array with real-looking
// prefilled credentials (emails + "password123"). That was a credential leak in
// source control and has been removed — sign in with a real account.
//
// The "Remember this device for 30 days" checkbox is also gone: there is no
// refresh endpoint, so the session cannot outlive the token's expiresIn and the
// promise could not be honoured.

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const {
    login,
    isLoading,
    error: authError,
    fieldErrors: serverFieldErrors,
    clearErrors,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [clientErrors, setClientErrors] = useState<LoginFormErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  /** Company admins land in the console; everyone else picks a project first. */
  const getRedirectPath = (role: SystemRole): string => {
    if (callbackUrl) return callbackUrl;
    return role === "admin" ? "/admin/overview" : "/select-project";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    clearErrors();

    const errors = validateLoginForm({ email, password });
    if (errors) {
      setClientErrors(errors);
      return;
    }
    setClientErrors({});

    try {
      const authResponse = await login({ email: email.trim(), password });
      router.push(getRedirectPath(authResponse.systemRole));
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setGeneralError(err.message);
      } else if (err instanceof Error) {
        setGeneralError(err.message);
      } else {
        setGeneralError("An unexpected error occurred during sign in. Please try again.");
      }
    }
  };

  // Server-side field errors win — they are authoritative.
  const emailError = serverFieldErrors?.email || clientErrors.email;
  const passwordError = serverFieldErrors?.password || clientErrors.password;
  const activeError = generalError || authError;

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-xl font-bold mb-1 tracking-tight text-ink">
          Sign in to your workspace
        </h1>
        <p className="text-xs text-muted">Enter your credentials to continue</p>
      </div>

      <div className="bg-surface border border-border rounded-panel p-7 flex flex-col gap-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]">
        <button
          type="button"
          onClick={() => {
            setGeneralError("GitHub sign-in is not implemented. Use email sign-in.");
          }}
          className="w-full h-10 rounded-lg bg-canvas border border-border text-ink font-semibold text-xs flex items-center justify-center gap-2 hover:border-accent/40 hover:bg-surface-raised transition-all cursor-pointer"
        >
          <IconGitHub />
          <span>Continue with GitHub</span>
        </button>

        <div className="flex items-center gap-3 text-subtle text-[11px] font-mono my-0">
          <div className="flex-1 h-px bg-border-subtle" />
          <span>OR</span>
          <div className="flex-1 h-px bg-border-subtle" />
        </div>

        {activeError && (
          <div
            role="alert"
            className="p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-xs flex items-start gap-2.5"
          >
            <span className="text-base leading-none select-none">⚠</span>
            <div className="flex-1">
              <p className="font-semibold">{activeError}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setGeneralError(null);
                clearErrors();
              }}
              className="text-danger/60 hover:text-danger text-xs font-bold leading-none cursor-pointer"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs text-muted font-medium">
              Work email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (clientErrors.email) {
                  setClientErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              placeholder="you@company.com"
              disabled={isLoading}
              className={`h-10 px-3 rounded-lg bg-canvas border text-ink text-xs transition-colors placeholder:text-subtle focus:outline-none ${
                emailError
                  ? "border-danger focus:border-danger focus:ring-1 focus:ring-danger/30"
                  : "border-border focus:border-accent focus:ring-1 focus:ring-accent/40"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            {emailError && (
              <p className="text-[11px] text-danger font-medium mt-0.5">{emailError}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs text-muted font-medium">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (clientErrors.password) {
                    setClientErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                placeholder="••••••••••••"
                disabled={isLoading}
                className={`h-10 w-full pl-3 pr-10 rounded-lg bg-canvas border text-ink text-xs transition-colors placeholder:text-subtle focus:outline-none ${
                  passwordError
                    ? "border-danger focus:border-danger focus:ring-1 focus:ring-danger/30"
                    : "border-border focus:border-accent focus:ring-1 focus:ring-accent/40"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3 text-subtle hover:text-ink transition-colors cursor-pointer flex items-center justify-center p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
            {passwordError && (
              <p className="text-[11px] text-danger font-medium mt-0.5">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 mt-1 rounded-lg bg-accent text-canvas font-bold text-xs hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer border-none flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? <span>Signing in…</span> : <span>Sign In</span>}
          </button>
        </form>
      </div>

      <div className="text-center text-xs text-subtle">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-accent font-medium hover:underline">
          Create one
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
