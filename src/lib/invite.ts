export interface InviteParams {
  /** One-time token from the invitation email, if the visitor came from one. */
  token: string | undefined;
  /** The address the invitation was sent to. Empty unless there is a token. */
  email: string;
}

/**
 * Reads the values the invitation email puts on the register link:
 * `/register?invite=<token>&email=<address>`.
 *
 * The address is only meaningful together with a token, so it is dropped when
 * there is none: a bare `?email=` must not prefill or lock the form.
 */
export function readInviteParams(params: {
  get(name: string): string | null;
}): InviteParams {
  const token = params.get("invite")?.trim() || undefined;
  const email = token ? (params.get("email")?.trim() ?? "") : "";
  return { token, email };
}

/**
 * A link to `path` that keeps the invitation with the visitor, so switching
 * between "register" and "sign in" does not drop the token. Without a token
 * it is just `path`.
 */
export function inviteHref(path: "/login" | "/register", invite: InviteParams): string {
  if (!invite.token) return path;
  const query = new URLSearchParams({ invite: invite.token });
  if (invite.email) query.set("email", invite.email);
  return `${path}?${query.toString()}`;
}
