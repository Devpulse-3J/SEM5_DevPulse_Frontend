/**
 * Validation for the admin project forms.
 *
 * Deliberately NOT in `lib/validators.ts`: that file's contract is "client-side
 * mirrors of the server's validation rules, no stricter and no looser", and
 * there is no server rule to mirror here yet — no project endpoint exists.
 * These are UI-only rules. When a real `POST /api/projects` lands, reconcile
 * these limits with its DTO and consider moving them across.
 */

export const PROJECT_NAME_MIN_LENGTH = 3;
export const PROJECT_NAME_MAX_LENGTH = 100;

/**
 * Repository URLs only — `https://github.com/{owner}/{repo}`.
 *
 * Intentionally strict: no `git@` form, no `.git` suffix, no deep paths like
 * `/tree/main`. Anything looser and the owner/repo split below stops being
 * reliable, which is exactly what integration-service needs from this value.
 */
export const GITHUB_REPO_URL_PATTERN =
  /^https:\/\/github\.com\/[A-Za-z0-9][A-Za-z0-9._-]*\/[A-Za-z0-9][A-Za-z0-9._-]*\/?$/;

export function validateProjectName(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Project name is required";
  if (trimmed.length < PROJECT_NAME_MIN_LENGTH) {
    return `Project name must be at least ${PROJECT_NAME_MIN_LENGTH} characters`;
  }
  if (trimmed.length > PROJECT_NAME_MAX_LENGTH) {
    return `Project name must be at most ${PROJECT_NAME_MAX_LENGTH} characters`;
  }
  return undefined;
}

export function validateGithubRepoUrl(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "GitHub repository URL is required";
  if (!GITHUB_REPO_URL_PATTERN.test(trimmed)) {
    return "Must look like https://github.com/owner/repo";
  }
  return undefined;
}

/** Strips a trailing slash so stored URLs compare equal. */
export function normaliseGithubRepoUrl(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

/**
 * Splits a validated URL into its owner and repo halves. Returns null for
 * anything that would not pass `validateGithubRepoUrl`, so callers never have
 * to trust a half-parsed result.
 */
export function parseGithubRepoUrl(
  value: string
): { owner: string; name: string } | null {
  const normalised = normaliseGithubRepoUrl(value);
  if (!GITHUB_REPO_URL_PATTERN.test(normalised)) return null;
  const [owner, name] = normalised.replace("https://github.com/", "").split("/");
  if (!owner || !name) return null;
  return { owner, name };
}

const SECRET_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export const WEBHOOK_SECRET_LENGTH = 32;

/**
 * A 32-character webhook secret.
 *
 * Uses `crypto.getRandomValues` where available — `Math.random` is not a
 * secure source, and a webhook secret is the only thing authenticating an
 * inbound GitHub delivery. The fallback exists so a non-secure context
 * (or a test environment) still renders rather than throwing.
 */
export function generateWebhookSecret(): string {
  const out: string[] = [];

  if (typeof globalThis.crypto?.getRandomValues === "function") {
    const bytes = new Uint32Array(WEBHOOK_SECRET_LENGTH);
    globalThis.crypto.getRandomValues(bytes);
    for (let i = 0; i < WEBHOOK_SECRET_LENGTH; i += 1) {
      out.push(SECRET_ALPHABET[bytes[i] % SECRET_ALPHABET.length]);
    }
    return out.join("");
  }

  for (let i = 0; i < WEBHOOK_SECRET_LENGTH; i += 1) {
    out.push(
      SECRET_ALPHABET[Math.floor(Math.random() * SECRET_ALPHABET.length)]
    );
  }
  return out.join("");
}
