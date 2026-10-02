export interface GithubAuthState {
  intent: "login" | "link";
  inviteToken?: string | null;
}

/**
 * Builds the GitHub OAuth authorization URL for starting the OAuth flow.
 * Default redirect URI matches the registered callback:
 * https://odineye.cse23.org/auth/github/callback (or current window origin in local dev).
 */
export function getGithubAuthorizeUrl(options: {
  intent?: "login" | "link";
  inviteToken?: string | null;
} = {}): string {
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID?.trim() || "";
  if (!clientId) {
    throw new Error(
      "GitHub Client ID is not configured. Please set NEXT_PUBLIC_GITHUB_CLIENT_ID in your environment variables."
    );
  }

  const defaultRedirect =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/github/callback`
      : "https://odineye.cse23.org/auth/github/callback";

  const redirectUri = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI?.trim() || defaultRedirect;

  const statePayload: GithubAuthState = {
    intent: options.intent || "login",
    inviteToken: options.inviteToken || null,
  };

  const rawJson = JSON.stringify(statePayload);
  const state =
    typeof btoa !== "undefined"
      ? btoa(rawJson)
      : Buffer.from(rawJson).toString("base64");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "read:user,user:email",
    state,
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

/**
 * Safely parses the state parameter returned by GitHub in the callback query.
 */
export function parseGithubAuthState(rawState: string | null | undefined): GithubAuthState {
  if (!rawState) {
    return { intent: "login" };
  }

  try {
    const decoded =
      typeof atob !== "undefined"
        ? atob(rawState)
        : Buffer.from(rawState, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded);
    return {
      intent: parsed.intent === "link" ? "link" : "login",
      inviteToken: typeof parsed.inviteToken === "string" ? parsed.inviteToken : null,
    };
  } catch {
    if (rawState === "link" || rawState === "login") {
      return { intent: rawState };
    }
    return { intent: "login" };
  }
}
