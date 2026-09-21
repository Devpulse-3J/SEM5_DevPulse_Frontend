"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { IconGitHub, IconEye, IconEyeOff } from "@/components/icons";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/services/api-client";
import { inviteHref, readInviteParams } from "@/lib/invite";
import { validateRegisterForm, type RegisterFormErrors } from "@/lib/validators";

type RegisterMode = "INDIVIDUAL" | "COMPANY";

function RegisterForm() {
  const router = useRouter();
  const { register: registerUser, isLoading, error: authError, fieldErrors: serverFieldErrors, clearErrors } =
    useAuth();

  // Arriving from a project invitation email: /register?invite=<token>&email=<address>.
  // The token joins the inviting company and project, so the company options are
  // hidden and the address is fixed to the one that was invited.
  const invite = readInviteParams(useSearchParams());
  const isInvited = invite.token !== undefined;
  const emailLocked = isInvited && invite.email !== "";

  const [mode, setMode] = useState<RegisterMode>("INDIVIDUAL");

  // Individual / Admin fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(invite.email);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Company specific fields
  const [companyName, setCompanyName] = useState("");

  const [clientErrors, setClientErrors] = useState<RegisterFormErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Rules live in lib/validators so login and register cannot drift apart, and
  // so they stay an exact mirror of the server's checks.
  const validate = () => {
    const errors = validateRegisterForm({
      email,
      password,
      fullName,
      companyName,
      isCompany: mode === "COMPANY",
    });
    setClientErrors(errors ?? {});
    return errors;
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
      const isCompany = mode === "COMPANY";
      const authResponse = await registerUser({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        companyName: isCompany ? companyName.trim() : undefined,
        isCompany,
        inviteToken: invite.token,
      });

      // systemRole is lowercase: "admin" for a company creator, else "member".
      if (authResponse.systemRole === "admin") {
        router.push("/admin/overview");
      } else {
        router.push("/select-project");
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setGeneralError(err.message);
      } else if (err instanceof Error) {
        setGeneralError(err.message);
      } else {
        setGeneralError("An unexpected error occurred during registration. Please try again.");
      }
    }
  };

  const fullNameError = clientErrors.fullName || serverFieldErrors?.fullName;
  const emailError = clientErrors.email || serverFieldErrors?.email;
  const passwordError = clientErrors.password || serverFieldErrors?.password;
  const companyNameError = clientErrors.companyName || serverFieldErrors?.companyName;
  const activeError = generalError || authError;

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-xl font-bold mb-1 tracking-tight text-ink">
          {isInvited
            ? "Join your team on Odin Eye"
            : mode === "COMPANY"
              ? "Register your Company"
              : "Get started with Odin Eye"}
        </h1>
        <p className="text-xs text-muted">
          {isInvited
            ? "Create your account to join the project you were invited to"
            : mode === "COMPANY"
              ? "Create an organization workspace and provision an Admin account"
              : "Create your personal account to collaborate across Developer & Manager workspaces"}
        </p>
      </div>

      <div className="bg-surface border border-border rounded-panel p-7 flex flex-col gap-4 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]">
        {/* Account Mode Switcher Tabs (not for an invitation: it always joins the inviting company) */}
        {!isInvited && (
        <div className="grid grid-cols-2 p-1 bg-canvas border border-border rounded-lg gap-1">
          <button
            type="button"
            onClick={() => {
              setMode("INDIVIDUAL");
              setClientErrors({});
              setGeneralError(null);
            }}
            className={`py-2 px-3 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              mode === "INDIVIDUAL"
                ? "bg-surface text-ink border border-border/80 shadow-sm"
                : "text-muted hover:text-ink hover:bg-surface/50"
            }`}
          >
            Individual Account
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("COMPANY");
              setClientErrors({});
              setGeneralError(null);
            }}
            className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === "COMPANY"
                ? "bg-accent/15 text-accent border border-accent/40 shadow-sm"
                : "text-muted hover:text-ink hover:bg-surface/50"
            }`}
          >
            <span>Register as a Company</span>
          </button>
        </div>
        )}

        {/* Invitation Info Banner */}
        {isInvited && (
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/25 text-xs text-ink flex items-start gap-2.5">
            <span className="text-base text-accent leading-none select-none">ℹ</span>
            <div className="flex-1 text-[11px] text-muted">
              You were invited by your company admin. Register with the email address the invitation was sent to and you
              will be added to the project automatically.
            </div>
          </div>
        )}

        {/* GitHub OAuth Button (Individual only, and not for an invitation: it would drop the token) */}
        {mode === "INDIVIDUAL" && !isInvited && (
          <>
            <button
              type="button"
              onClick={() => {
                setGeneralError("GitHub OAuth registration is configured via the API Gateway. Use direct form below.");
              }}
              className="w-full h-10 rounded-lg bg-canvas border border-border text-ink font-semibold text-xs flex items-center justify-center gap-2 hover:border-accent/40 hover:bg-surface-raised transition-all cursor-pointer mt-1"
            >
              <IconGitHub />
              <span>Sign up with GitHub</span>
            </button>

            <div className="flex items-center gap-3 text-subtle text-[11px] font-mono my-0.5">
              <div className="flex-1 h-px bg-border-subtle" />
              <span>OR</span>
              <div className="flex-1 h-px bg-border-subtle" />
            </div>
          </>
        )}

        {/* Company Mode Info Banner */}
        {mode === "COMPANY" && (
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/25 text-xs text-ink flex items-start gap-2.5">
            <span className="text-base text-accent leading-none select-none">ℹ</span>
            <div className="flex-1 text-[11px] text-muted">
              Registering a company provisions a new dedicated organization workspace. You will be assigned as the{" "}
              <strong className="text-ink">Company Administrator</strong>.
            </div>
          </div>
        )}

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

        {/* Register Form */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
          {/* Company Details (If Company mode) */}
          {mode === "COMPANY" && (
            <div className="flex flex-col gap-3 p-3.5 rounded-lg bg-canvas border border-border/70">
              <span className="text-[11px] font-bold text-subtle tracking-wider uppercase">
                1. Company Information
              </span>

              {/* Company Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="companyName" className="text-xs text-muted font-medium">
                  Company / Organization Name
                </label>
                <input
                  id="companyName"
                  type="text"
                  placeholder="e.g. Nimbus Labs Inc."
                  value={companyName}
                  onChange={(e) => {
                    setCompanyName(e.target.value);
                    if (clientErrors.companyName) {
                      setClientErrors((prev) => ({ ...prev, companyName: undefined }));
                    }
                  }}
                  disabled={isLoading}
                  required
                  className={`h-10 px-3 rounded-lg bg-surface border text-ink text-xs transition-colors placeholder:text-subtle focus:outline-none ${
                    companyNameError
                      ? "border-danger focus:border-danger focus:ring-1 focus:ring-danger/30"
                      : "border-border focus:border-accent focus:ring-1 focus:ring-accent/40"
                  } disabled:opacity-50`}
                />
                {companyNameError && (
                  <p className="text-[11px] text-danger font-medium mt-0.5">{companyNameError}</p>
                )}
              </div>

              {/* Organization size was removed: the register endpoint has no
                  field for it, so the value was collected and silently thrown
                  away. Re-add it only when the backend can store it. */}
            </div>
          )}

          {/* Admin / Personal Account Details */}
          <div className="flex flex-col gap-3.5">
            {mode === "COMPANY" && (
              <span className="text-[11px] font-bold text-subtle tracking-wider uppercase mt-1">
                2. Administrator Account
              </span>
            )}

            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs text-muted font-medium">
                {mode === "COMPANY" ? "Admin full name" : "Full name"}
              </label>
              <input
                id="name"
                type="text"
                placeholder={mode === "COMPANY" ? "Sarah Chen" : "Marcus Webb"}
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (clientErrors.fullName) {
                    setClientErrors((prev) => ({ ...prev, fullName: undefined }));
                  }
                }}
                disabled={isLoading}
                required
                className={`h-10 px-3 rounded-lg bg-canvas border text-ink text-xs transition-colors placeholder:text-subtle focus:outline-none ${
                  fullNameError
                    ? "border-danger focus:border-danger focus:ring-1 focus:ring-danger/30"
                    : "border-border focus:border-accent focus:ring-1 focus:ring-accent/40"
                } disabled:opacity-50`}
              />
              {fullNameError && (
                <p className="text-[11px] text-danger font-medium mt-0.5">{fullNameError}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs text-muted font-medium">
                {mode === "COMPANY" ? "Admin work email" : "Work email"}
              </label>
              <input
                id="email"
                type="email"
                placeholder={mode === "COMPANY" ? "admin@nimbuslabs.io" : "marcus.webb@nimbuslabs.io"}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (clientErrors.email) {
                    setClientErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                disabled={isLoading}
                readOnly={emailLocked}
                required
                className={`h-10 px-3 rounded-lg bg-canvas border text-ink text-xs transition-colors placeholder:text-subtle focus:outline-none ${
                  emailError
                    ? "border-danger focus:border-danger focus:ring-1 focus:ring-danger/30"
                    : "border-border focus:border-accent focus:ring-1 focus:ring-accent/40"
                } disabled:opacity-50 read-only:opacity-70 read-only:cursor-not-allowed`}
              />
              {emailError && (
                <p className="text-[11px] text-danger font-medium mt-0.5">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs text-muted font-medium">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (clientErrors.password) {
                      setClientErrors((prev) => ({ ...prev, password: undefined }));
                    }
                  }}
                  disabled={isLoading}
                  required
                  minLength={8}
                  className={`h-10 w-full pl-3 pr-10 rounded-lg bg-canvas border text-ink text-xs transition-colors placeholder:text-subtle focus:outline-none ${
                    passwordError
                      ? "border-danger focus:border-danger focus:ring-1 focus:ring-danger/30"
                      : "border-border focus:border-accent focus:ring-1 focus:ring-accent/40"
                  } disabled:opacity-50`}
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
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 mt-2 rounded-lg bg-accent text-canvas font-bold text-xs hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer border-none flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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
                <span>{mode === "COMPANY" ? "Registering Company..." : "Creating Account..."}</span>
              </>
            ) : (
              <span>{mode === "COMPANY" ? "Register Company & Admin Account" : "Create Account"}</span>
            )}
          </button>
        </form>
      </div>

      <div className="text-center text-xs text-subtle">
        Already have an account?{" "}
        <Link href={inviteHref("/login", invite)} className="text-accent font-medium hover:underline">
          {isInvited ? "Sign in to accept your invitation" : "Sign in"}
        </Link>
      </div>
    </div>
  );
}

// useSearchParams needs a Suspense boundary or `next build` fails to prerender the page.
export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
