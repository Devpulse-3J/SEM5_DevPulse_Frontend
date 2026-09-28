"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";
import { ApiError } from "@/services/api-client";

export default function GithubCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams?.get("code");
    const error = searchParams?.get("error");

    if (error) {
      router.replace(`/select-project?github=error&message=${encodeURIComponent(error)}`);
      return;
    }

    if (!code) {
      router.replace("/select-project?github=error&message=No authorization code provided");
      return;
    }

    let active = true;
    async function processCallback() {
      try {
        await authService.callbackUserGithub(code!);
        if (active) {
          router.replace("/select-project?github=connected");
        }
      } catch (err: unknown) {
        if (!active) return;
        let msg = "Failed to connect GitHub account";
        if (err instanceof ApiError) {
          if (err.status === 409) {
            msg = "This GitHub account is already connected to another DevPulse user.";
          } else if (err.message) {
            msg = err.message;
          }
        } else if (err instanceof Error && err.message) {
          msg = err.message;
        }
        setErrorMsg(msg);
        setTimeout(() => {
          router.replace(`/select-project?github=error&message=${encodeURIComponent(msg)}`);
        }, 1500);
      }
    }

    processCallback();
    return () => {
      active = false;
    };
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-6">
      <div className="w-full max-w-md rounded-panel border border-border bg-surface p-6 text-center">
        {errorMsg ? (
          <div>
            <div className="text-sm font-semibold text-danger">Connection Error</div>
            <p className="mt-2 text-xs text-muted">{errorMsg}</p>
            <p className="mt-4 text-[11px] text-subtle">Redirecting back…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <div className="text-xs font-semibold text-ink">Connecting your GitHub account…</div>
            <p className="text-[11px] text-muted">Please wait while we verify your identity.</p>
          </div>
        )}
      </div>
    </div>
  );
}
