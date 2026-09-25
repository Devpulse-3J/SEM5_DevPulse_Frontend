"use client";

import { useState } from "react";
import { ApiError } from "@/services/api-client";
import { authService } from "@/services/auth.service";
import { pullRequestService } from "@/services/pullRequest.service";

interface GithubLinkCardProps {
  /** Numeric id of the account already linked, if any. */
  githubId?: number | null;
  /** Called after a successful link so the caller can reload the profile. */
  onLinked: () => void | Promise<unknown>;
}

/**
 * Links the signed-in user's GitHub account.
 *
 * Pull requests and commits are attributed to a user through their GitHub id, so
 * until it is linked their work shows up with no author. Linking also
 * attributes their earlier PRs.
 */
export function GithubLinkCard({ githubId, onLinked }: GithubLinkCardProps) {
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const linked = typeof githubId === "number" && !editing;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = username.trim();
    if (!value || busy) return;
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      const result = await authService.linkGithub(value);
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
      setUsername("");
      setEditing(false);
      await onLinked();
    } catch (err: unknown) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Could not link that GitHub account."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-5 rounded-card border border-border bg-surface px-4 py-3.5 text-left">
      <div className="text-xs font-semibold text-ink">GitHub account</div>

      {linked ? (
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
      ) : (
        <form onSubmit={submit} className="mt-2 flex flex-col gap-2">
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
              {busy ? "Linking…" : "Link"}
            </button>
          </div>
        </form>
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
