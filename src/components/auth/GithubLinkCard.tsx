"use client";

import { useState } from "react";
import { ApiError } from "@/services/api-client";
import { authService } from "@/services/auth.service";
import { pullRequestService } from "@/services/pullRequest.service";
import type { GithubPreview } from "@/types/user";

interface GithubLinkCardProps {
  /** Numeric id of the account already linked, if any. */
  githubId?: number | null;
  /** Called after a successful link so the caller can reload the profile. */
  onLinked: () => void | Promise<unknown>;
}

function messageOf(err: unknown, fallback: string): string {
  return err instanceof ApiError || err instanceof Error ? err.message || fallback : fallback;
}

/**
 * Links the signed-in user's GitHub account, in two steps so a typo can't attach
 * someone else's real account unnoticed:
 *   1. "Look up" shows who the username resolves to (name, avatar, profile link);
 *   2. "Yes, link this account" saves it.
 *
 * Pull requests and commits are attributed to a user through their GitHub id, so
 * until it is linked their work shows up with no author. Linking also attributes
 * their earlier PRs.
 *
 * Confirming catches typos, not impersonation: nothing proves the account belongs
 * to the person clicking "Yes".
 */
export function GithubLinkCard({ githubId, onLinked }: GithubLinkCardProps) {
  const [username, setUsername] = useState("");
  const [preview, setPreview] = useState<GithubPreview | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const linked = typeof githubId === "number" && !editing;

  async function lookUp(e: React.FormEvent) {
    e.preventDefault();
    const value = username.trim();
    if (!value || busy) return;
    setBusy(true);
    setError(null);
    setNote(null);
    setPreview(null);
    try {
      setPreview(await authService.lookupGithub(value));
    } catch (err: unknown) {
      setError(messageOf(err, "Could not look up that GitHub account."));
    } finally {
      setBusy(false);
    }
  }

  async function confirm() {
    if (!preview || preview.linkedToAnotherUser || busy) return;
    setBusy(true);
    setError(null);
    try {
      // Link by the canonical login the lookup returned. The server resolves it
      // again itself, so the saved id never comes from this browser.
      const result = await authService.linkGithub(preview.githubLogin);
      let attributed = 0;
      try {
        attributed = (await pullRequestService.relinkMyAuthored()).linkedPullRequests;
      } catch {
        // Linking worked; catching up earlier PRs is best-effort and re-runs
        // whenever a project is opened.
      }
      setNote(
        attributed > 0
          ? `Linked ${result.githubLogin}. ${attributed} earlier pull request${attributed === 1 ? "" : "s"} attributed to you.`
          : `Linked ${result.githubLogin}.`
      );
      setPreview(null);
      setUsername("");
      setEditing(false);
      await onLinked();
    } catch (err: unknown) {
      setError(messageOf(err, "Could not link that GitHub account."));
    } finally {
      setBusy(false);
    }
  }

  function reject() {
    setPreview(null);
    setError(null);
  }

  return (
    <div className="mt-5 rounded-card border border-border bg-surface px-4 py-3.5 text-left">
      <div className="text-xs font-semibold text-ink">GitHub account</div>

      {linked && (
        <div className="mt-1 flex items-center justify-between gap-3">
          <p className="text-[11px] text-muted">
            Linked (GitHub id {githubId}). Your pull requests and commits are attributed to you.
          </p>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="cursor-pointer border-none bg-transparent text-[11px] font-medium text-accent hover:underline"
          >
            Change
          </button>
        </div>
      )}

      {!linked && !preview && (
        <form onSubmit={lookUp} className="mt-2 flex flex-col gap-2">
          <p className="text-[11px] text-muted">
            Enter your GitHub username so your pull requests and commits show up under your name.
          </p>
          <div className="flex gap-2">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="github-username"
              disabled={busy}
              aria-label="GitHub username"
              className="h-9 flex-1 rounded-lg border border-border bg-canvas px-3 text-xs text-ink placeholder:text-subtle focus:border-accent focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={busy || !username.trim()}
              className="h-9 cursor-pointer rounded-lg border-none bg-accent px-3 text-xs font-bold text-canvas hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Looking up…" : "Look up"}
            </button>
          </div>
        </form>
      )}

      {!linked && preview && (
        <div className="mt-2 flex flex-col gap-3" aria-live="polite">
          <div className="flex items-center gap-3">
            {preview.avatarUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- GitHub avatar, not worth next/image config
              <img
                src={preview.avatarUrl}
                alt=""
                width={44}
                height={44}
                referrerPolicy="no-referrer"
                className="h-11 w-11 rounded-full border border-border"
              />
            )}
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-ink">
                {preview.name || preview.githubLogin}
              </div>
              <div className="font-mono text-[11px] text-subtle">@{preview.githubLogin}</div>
              {preview.profileUrl && (
                <a
                  href={preview.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-medium text-accent hover:underline"
                >
                  View profile on GitHub ↗
                </a>
              )}
            </div>
          </div>

          {preview.linkedToAnotherUser ? (
            <p role="alert" className="text-[11px] font-medium text-danger">
              This GitHub account is already linked to another DevPulse user, so it can&apos;t be
              linked to you. If it is yours, ask an admin.
            </p>
          ) : (
            <p className="text-[11px] text-muted">Is this your GitHub account?</p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={confirm}
              disabled={busy || preview.linkedToAnotherUser}
              className="h-9 cursor-pointer rounded-lg border-none bg-accent px-3 text-xs font-bold text-canvas hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Linking…" : "Yes, link this account"}
            </button>
            <button
              type="button"
              onClick={reject}
              disabled={busy}
              className="h-9 cursor-pointer rounded-lg border border-border bg-canvas px-3 text-xs font-medium text-ink hover:border-accent/40 disabled:opacity-60"
            >
              {preview.linkedToAnotherUser ? "Back" : "No, that's not me"}
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
