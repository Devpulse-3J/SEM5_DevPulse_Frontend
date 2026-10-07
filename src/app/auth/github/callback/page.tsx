"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";
import { ApiError } from "@/services/api-client";
import * as session from "@/lib/auth";
import { parseGithubAuthState } from "@/lib/github-auth";
import { memberLandingPath } from "@/lib/redirect";

function GithubCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithGithub } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Parse state to determine if this is login/signup or linking an existing account
  const rawState = searchParams?.get("state");
  const stateData = parseGithubAuthState(rawState);
  const isLoginFlow = stateData.intent === "login" || !session.hasValidSession();

  useEffect(() => {
    const code = searchParams?.get("code");
    const error = searchParams?.get("error");
    const errorDescription = searchParams?.get("error_description");
    const installationId = searchParams?.get("installation_id");
    const setupAction = searchParams?.get("setup_action");

    // If redirected here from GitHub App installation (repo integration), forward to admin integration page
    if (installationId) {
      const stateParam = searchParams?.get("state");
      const forwardParams = new URLSearchParams();
      forwardParams.set("installation_id", installationId);
      if (setupAction) forwardParams.set("setup_action", setupAction);
      if (stateParam) forwardParams.set("state", stateParam);
      router.replace(`/admin/integrations/github?${forwardParams.toString()}`);
      return;
    }

    const fallbackUrl = isLoginFlow ? "/login" : "/select-project";

    if (error) {
      const displayError = errorDescription || error;
      router.replace(`${fallbackUrl}?github=error&message=${encodeURIComponent(displayError)}`);
      return;
    }

    if (!code) {
      router.replace(`${fallbackUrl}?github=error&message=${encodeURIComponent("No authorization code received from GitHub")}`);
      return;
    }

    let active = true;

    async function processCallback() {
      try {
        if (isLoginFlow) {
          await loginWithGithub(code!, stateData.inviteToken || undefined);
          if (active) {
            // GitHub login is exclusively for developer/manager workspace profiles.
            // Workspace doors always land on memberLandingPath (/select-project), never the admin console.
            const target = memberLandingPath(stateData.callbackUrl);
            router.replace(target);
          }
        } else {
          // Account linking for user who is already authenticated
          await authService.callbackUserGithub(code!);
          if (active) {
            router.replace("/select-project?github=connected");
          }
        }
      } catch (err: unknown) {
        if (!active) return;
        let msg = isLoginFlow ? "Failed to sign in with GitHub" : "Failed to connect GitHub account";
        if (err instanceof ApiError) {
          if (err.status === 409) {
            msg = isLoginFlow
              ? "This GitHub account is already associated with another user."
              : "This GitHub account is already connected to another OdinEye user.";
          } else if (err.message) {
            msg = err.message;
          }
        } else if (err instanceof Error && err.message) {
          msg = err.message;
        }

        setErrorMsg(msg);
        setTimeout(() => {
          router.replace(`${fallbackUrl}?github=error&message=${encodeURIComponent(msg)}`);
        }, 2000);
      }
    }

    processCallback();
    return () => {
      active = false;
    };
  }, [searchParams, router, isLoginFlow, loginWithGithub, stateData.inviteToken, stateData.callbackUrl]);

  const headingText = isLoginFlow ? "Signing you in with GitHub…" : "Connecting your GitHub account…";

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-6">
      <div className="w-full max-w-md rounded-panel border border-border bg-surface p-6 text-center shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]">
        {errorMsg ? (
          <div>
            <div className="text-sm font-semibold text-danger">Authentication Error</div>
            <p className="mt-2 text-xs text-muted">{errorMsg}</p>
            <p className="mt-4 text-[11px] text-subtle">Redirecting back…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <div className="text-xs font-semibold text-ink">{headingText}</div>
            <p className="text-[11px] text-muted">Please wait while we complete authentication.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GithubCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-canvas p-6">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      }
    >
      <GithubCallbackContent />
    </Suspense>
  );
}
