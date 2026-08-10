"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { setActiveProject } from "@/store/dashboardSlice";
import { IconGitHub, IconEye, IconEyeOff } from "@/components/icons";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/services/api-client";
import type { SystemRole } from "@/types/auth";

type DemoRole = "DEVELOPER" | "MANAGER";

interface RoleConfig {
  id: DemoRole;
  label: string;
  badge: string;
  email: string;
  pass: string;
  description: string;
}

const DEMO_ROLES: RoleConfig[] = [
  {
    id: "DEVELOPER",
    label: "Developer",
    badge: "DEV",
    email: "sarah.chen@nimbuslabs.io",
    pass: "password123",
    description: "Code reviews, PR risk analysis & assigned repos",
  },
  {
    id: "MANAGER",
    label: "Manager",
    badge: "MGR",
    email: "marcus.webb@nimbuslabs.io",
    pass: "password123",
    description: "DORA metrics, team workload & delivery insights",
  },
];

function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const { login, isLoading, error: authError, fieldErrors: serverFieldErrors, clearErrors } =
    useAuth();

  const [selectedRole, setSelectedRole] = useState<DemoRole>("DEVELOPER");
  const [email, setEmail] = useState<string>(DEMO_ROLES[0].email);
  const [password, setPassword] = useState<string>(DEMO_ROLES[0].pass);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [clientErrors, setClientErrors] = useState<{ email?: string; password?: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Validate form before submission
  const validate = (): { email?: string; password?: string } | null => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = "Email is required";
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

  const getRedirectPathForRole = (role?: SystemRole | string): string => {
    if (callbackUrl) return callbackUrl;
    if (role === "ADMIN") return "/admin/overview";
    return "/dashboard";
  };

  const handleRoleSelect = (roleConfig: RoleConfig) => {
    setSelectedRole(roleConfig.id);
    setEmail(roleConfig.email);
    setPassword(roleConfig.pass);
    setClientErrors({});
    setGeneralError(null);
    clearErrors();
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

      // Default active project based on authenticated role
      const isManager = authResponse.systemRole === "MANAGER" || selectedRole === "MANAGER";
      dispatch(
        setActiveProject({
          id: "platform-core",
          name: "platform-core",
          role: isManager ? "MANAGER" : "DEVELOPER",
        })
      );

      // Redirect user according to systemRole
      const targetPath = getRedirectPathForRole(authResponse.systemRole);
      router.push(targetPath);
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

  // Resolve combined field errors
  const emailError = clientErrors.email || serverFieldErrors?.email;
  const passwordError = clientErrors.password || serverFieldErrors?.password;
  const activeError = generalError || authError;

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-xl font-bold mb-1 tracking-tight text-ink">
          Sign in to your workspace
        </h1>
        <p className="text-xs text-muted">
          Select your role or enter custom credentials to continue
        </p>
      </div>

      <div className="bg-surface border border-border rounded-panel p-7 flex flex-col gap-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]">
        {/* GitHub OAuth Button */}
        <button
          type="button"
          onClick={() => {
            setGeneralError("GitHub OAuth is configured via the API Gateway. Use email sign-in for direct access.");
          }}
          className="w-full h-10 rounded-lg bg-canvas border border-border text-ink font-semibold text-xs flex items-center justify-center gap-2 hover:border-accent/40 hover:bg-surface-raised transition-all cursor-pointer"
        >
          <IconGitHub />
          <span>Continue with GitHub</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 text-subtle text-[11px] font-mono my-0">
          <div className="flex-1 h-px bg-border-subtle" />
          <span>OR</span>
          <div className="flex-1 h-px bg-border-subtle" />
        </div>

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
              placeholder="sarah.chen@nimbuslabs.io"
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
              <label htmlFor="password" className="text-xs text-muted font-medium">
                Password
              </label>
              <a
                href="#forgot-password"
                onClick={(e) => {
                  e.preventDefault();
                  setGeneralError("Please contact your workspace administrator to reset your password.");
                }}
                className="text-xs text-accent hover:underline"
              >
                Forgot password?
              </a>
            </div>

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

          {/* Three Selectable Login Role Buttons under credentials */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted tracking-wide uppercase">
                Login as role:
              </span>
              <span className="text-[11px] font-mono text-accent">
                Selected: {selectedRole}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {DEMO_ROLES.map((roleConfig) => {
                const isSelected = selectedRole === roleConfig.id;
                return (
                  <button
                    key={roleConfig.id}
                    type="button"
                    onClick={() => handleRoleSelect(roleConfig)}
                    className={`h-10 px-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-accent/15 border-accent text-accent shadow-[0_0_12px_rgba(59,130,246,0.25)] font-bold ring-1 ring-accent/30"
                        : "bg-canvas border-border text-muted hover:text-ink hover:border-border/80 hover:bg-surface-raised"
                    }`}
                  >
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full ${
                        isSelected ? "bg-accent" : "bg-muted/40"
                      }`}
                    />
                    <span>{roleConfig.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 mt-1">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="w-3.5 h-3.5 rounded bg-canvas border-border text-accent focus:ring-accent/40 cursor-pointer"
            />
            <label
              htmlFor="remember-me"
              className="text-xs text-muted cursor-pointer select-none"
            >
              Remember this device for 30 days
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 mt-1 rounded-lg bg-accent text-canvas font-bold text-xs hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer border-none flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-canvas"
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
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In as {selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase()}</span>
            )}
          </button>
        </form>
      </div>

      <div className="text-center text-xs text-subtle">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-accent font-medium hover:underline">
          Request access
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
