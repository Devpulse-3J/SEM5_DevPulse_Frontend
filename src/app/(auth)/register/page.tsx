"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconGitHub, IconEye, IconEyeOff } from "@/components/icons";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/services/api-client";

type RegisterMode = "INDIVIDUAL" | "COMPANY";

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading, error: authError, fieldErrors: serverFieldErrors, clearErrors } =
    useAuth();

  const [mode, setMode] = useState<RegisterMode>("INDIVIDUAL");

  // Individual / Admin fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Company specific fields
  const [companyName, setCompanyName] = useState("");
  const [companySize, setCompanySize] = useState("11-50");

  const [clientErrors, setClientErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    companyName?: string;
  }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const validate = () => {
    const errors: {
      fullName?: string;
      email?: string;
      password?: string;
      companyName?: string;
    } = {};

    if (mode === "COMPANY" && !companyName.trim()) {
      errors.companyName = "Company name is required";
    }

    if (!fullName.trim()) {
      errors.fullName = mode === "COMPANY" ? "Admin full name is required" : "Full name is required";
    }

    if (!email.trim()) {
      errors.email = mode === "COMPANY" ? "Company admin email is required" : "Work email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
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
      const isCompany = mode === "COMPANY";
      const authResponse = await registerUser({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        companyName: isCompany ? companyName.trim() : undefined,
        isCompany,
      });

      // If registered as company admin, route to admin overview or dashboard
      if (authResponse.systemRole === "ADMIN" || isCompany) {
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
          {mode === "COMPANY" ? "Register your Company" : "Get started with DevPulse"}
        </h1>
        <p className="text-xs text-muted">
          {mode === "COMPANY"
            ? "Create an organization workspace and provision an Admin account"
            : "Create your personal account to collaborate across Developer & Manager workspaces"}
        </p>
      </div>

      <div className="bg-surface border border-border rounded-panel p-7 flex flex-col gap-4 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]">
        {/* Account Mode Switcher Tabs */}
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

        {/* GitHub OAuth Button (Individual only) */}
        {mode === "INDIVIDUAL" && (
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

              {/* Company Size */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="companySize" className="text-xs text-muted font-medium">
                  Organization Size
                </label>
                <select
                  id="companySize"
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  disabled={isLoading}
                  className="h-10 px-3 rounded-lg bg-surface border border-border text-ink text-xs transition-colors focus:border-accent focus:outline-none cursor-pointer"
                >
                  <option value="1-10">1 - 10 engineers</option>
                  <option value="11-50">11 - 50 engineers</option>
                  <option value="51-200">51 - 200 engineers</option>
                  <option value="201+">201+ engineers (Enterprise)</option>
                </select>
              </div>
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
                required
                className={`h-10 px-3 rounded-lg bg-canvas border text-ink text-xs transition-colors placeholder:text-subtle focus:outline-none ${
                  emailError
                    ? "border-danger focus:border-danger focus:ring-1 focus:ring-danger/30"
                    : "border-border focus:border-accent focus:ring-1 focus:ring-accent/40"
                } disabled:opacity-50`}
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
        <Link href="/login" className="text-accent font-medium hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
