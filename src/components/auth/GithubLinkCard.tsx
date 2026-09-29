"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ApiError } from "@/services/api-client";
import { authService } from "@/services/auth.service";
import { pullRequestService } from "@/services/pullRequest.service";
import type { UserGithubStatusResponse } from "@/types/user";

interface GithubLinkCardProps {
  /** Numeric id of the account already linked, if any. */
  githubId?: number | null;
  /** Called after a successful link or disconnect so the caller can reload the profile. */
  onLinked: () => void | Promise<unknown>;
}

function messageOf(err: unknown, fallback: string): string {
  if (err instanceof ApiError) {
    if (err.status === 409) {
      return "This GitHub account is already connected to another OdinEye user.";
    }
    return err.message || fallback;
  }
  return err instanceof Error ? err.message || fallback : fallback;
}

/**
 * 1-Click GitHub Identity Connection Card.
 *
 * Redirects developers to GitHub to authorize OdinEye, automatically fetching
 * and storing their numeric GitHub User ID and username.
 */
export function GithubLinkCard({ githubId, onLinked }: GithubLinkCardProps) {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<UserGithubStatusResponse | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    // Check URL params for redirect feedback
    const githubParam = searchParams?.get("github");
    const msgParam = searchParams?.get("message");

    if (githubParam === "connected") {
      setTimeout(() => {
        setNote("GitHub account connected successfully! Your pull requests are now attributed to you.");
      }, 0);
      // Trigger background relink
      pullRequestService.relinkMyAuthored().catch(() => undefined);
      onLinked();
    } else if (githubParam === "error") {
      setTimeout(() => {
        setError(msgParam || "Failed to connect GitHub account.");
      }, 0);
    }
  }, [searchParams, onLinked]);

  useEffect(() => {
    let unmounted = false;
    async function loadStatus() {
      try {
        const current = await authService.getUserGithubStatus();
        if (!unmounted) setStatus(current);
      } catch {
        // Fallback to prop
        if (!unmounted && typeof githubId === "number") {
          setStatus({ connected: true, githubUserId: githubId });
        }
      } finally {
        if (!unmounted) setLoadingStatus(false);
      }
    }
    loadStatus();
    return () => {
      unmounted = true;
    };
  }, [githubId]);

  const isConnected = (status?.connected || typeof githubId === "number") && status?.connected !== false;
  const username = status?.githubUsername;

  async function handleConnect() {
    if (busy) return;
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      const res = await authService.getUserGithubConnectUrl();
      if (res.url) {
        window.location.href = res.url;
      } else {
        setError("Could not retrieve GitHub connection URL.");
        setBusy(false);
      }
    } catch (err: unknown) {
      setError(messageOf(err, "Failed to initiate GitHub authorization."));
      setBusy(false);
    }
  }

  async function handleDisconnect() {
    if (busy) return;
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      const updated = await authService.disconnectUserGithub();
      setStatus(updated);
      setNote("GitHub account disconnected.");
      await onLinked();
    } catch (err: unknown) {
      setError(messageOf(err, "Could not disconnect GitHub account."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-5 rounded-card border border-border bg-surface px-4 py-3.5 text-left">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-ink flex items-center gap-1.5">
          <svg className="h-4 w-4 fill-current text-ink" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          GitHub Account
        </div>
        {isConnected && username && (
          <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">
            Connected as @{username}
          </span>
        )}
      </div>

      {loadingStatus ? (
        <div className="mt-2.5 flex items-center gap-2 text-[11px] text-muted">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          Loading GitHub status…
        </div>
      ) : isConnected ? (
        <div className="mt-2 flex flex-col gap-2">
          <p className="text-[11px] text-muted">
            Connected{username ? ` as @${username}` : ""}. Your pull requests and commits are automatically attributed to your OdinEye user profile.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDisconnect}
              disabled={busy}
              className="h-8 cursor-pointer rounded-lg border border-danger/40 bg-danger/10 px-3 text-xs font-medium text-danger hover:bg-danger/20 disabled:opacity-50"
            >
              {busy ? "Disconnecting…" : "Disconnect"}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-2 flex flex-col gap-2">
          <p className="text-[11px] text-muted">
            Connect your GitHub account with 1 click so your pull requests and code contributions show up under your name.
          </p>
          <div>
            <button
              type="button"
              onClick={handleConnect}
              disabled={busy}
              className="h-9 cursor-pointer rounded-lg border-none bg-accent px-4 text-xs font-bold text-canvas hover:brightness-110 disabled:cursor-wait disabled:opacity-60 flex items-center gap-2"
            >
              {busy ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-canvas border-t-transparent" />
                  Connecting to GitHub…
                </>
              ) : (
                "Connect GitHub"
              )}
            </button>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-2 text-[11px] font-medium text-danger">
          {error}
        </p>
      )}
      {note && !error && <p className="mt-2 text-[11px] text-success">{note}</p>}
    </div>
  );
}

