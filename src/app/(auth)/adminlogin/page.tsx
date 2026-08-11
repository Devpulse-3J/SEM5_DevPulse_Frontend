"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { IconEye, IconEyeOff, IconShield } from "@/components/icons";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/services/api-client";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const { login, isLoading, error: authError, fieldErrors: serverFieldErrors, clearErrors } =
    useAuth();

  const [email, setEmail] = useState<string>("admin@devpulse.io");
  const [password, setPassword] = useState<string>("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [clientErrors, setClientErrors] = useState<{ email?: string; password?: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Validate form before submission
  const validate = (): { email?: string; password?: string } | null => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = "Admin email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 4) {
      errors.password = "Password must be at least 4 characters";
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0 ? null : errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    clearErrors();

    const validationErrors = validate();
    if (validationErrors) {
      return;
    }

    try {
      const authResponse = await login({
        email: email.trim(),
        password,
      });

      // Redirect admin to admin overview or specified callback URL
      const targetPath = callbackUrl || "/admin/overview";
      router.push(targetPath);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setGeneralError(err.message);
      } else if (err instanceof Error) {
        setGeneralError(err.message);
      } else {
        setGeneralError("An unexpected error occurred during admin sign in. Please try again.");
      }
    }
  };

  // Resolve combined field errors
  const emailError = clientErrors.email || serverFieldErrors?.email;
  const passwordError = clientErrors.password || serverFieldErrors?.password;
  const activeError = generalError || authError;

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-wider text-warning bg-warning/10 border border-warning/20 rounded-full px-3 py-1 mb-3">
          <IconShield />
          <span>ADMIN CONSOLE ACCESS</span>
        </div>
        <h1 className="text-xl font-bold mb-1 tracking-tight text-ink">
          Admin Sign In
        </h1>
        <p className="text-xs text-muted">
          Authenticate with system administrator credentials
        </p>
      </div>

      <div className="bg-surface border border-border rounded-panel p-7 flex flex-col gap-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]">
        {/* Error Notification Banner */}
        {activeError && (
          <div
            role="alert"
            className="p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-xs flex items-start gap-2.5 animate-fadeIn"
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

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-email" className="text-xs text-muted font-medium">
              Administrator Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (clientErrors.email) {
                  setClientErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              placeholder="admin@devpulse.io"
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

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="admin-password" className="text-xs text-muted font-medium">
                Password
              </label>
              <a
                href="#forgot-password"
                onClick={(e) => {
                  e.preventDefault();
                  setGeneralError("Please contact your organization's root security administrator.");
                }}
                className="text-xs text-accent hover:underline"
              >
                Need help?
              </a>
            </div>

            <div className="relative flex items-center">
              <input
                id="admin-password"
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

          {/* Remember Me */}
          <div className="flex items-center gap-2 mt-1">
            <input
              id="admin-remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="w-3.5 h-3.5 rounded bg-canvas border-border text-accent focus:ring-accent/40 cursor-pointer"
            />
            <label
              htmlFor="admin-remember-me"
              className="text-xs text-muted cursor-pointer select-none"
            >
              Remember this device for 30 days
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 mt-2 rounded-lg bg-white text-black font-bold text-xs hover:bg-neutral-200 active:scale-[0.99] transition-all cursor-pointer border-none flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                <span>Authenticating Admin...</span>
              </>
            ) : (
              <span>Sign In to Admin Console</span>
            )}
          </button>
        </form>
      </div>

      <div className="text-center text-xs text-subtle">
        Looking for standard user login?{" "}
        <Link href="/login" className="text-accent font-medium hover:underline">
          Workspace Sign In
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
