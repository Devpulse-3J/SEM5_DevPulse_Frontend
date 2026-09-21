/**
 * Where a visitor lands after signing in, and which login page a lost session
 * returns to.
 *
 * The app has two front doors: `/login` for the workspace (Manager / Developer
 * dashboards) and `/adminlogin` for the company admin console. Which door you
 * used decides where you land. It must not be decided by a `?callbackUrl=`
 * left over from the last session, or a company admin who signs out of the
 * console and then uses the workspace login is dropped straight back into the
 * console.
 */

/** Pages that are themselves a way in. A callback to one of them would loop. */
const AUTH_PAGE = /^\/(login|adminlogin|register)(\/|\?|#|$)/;

/** The company admin console: `/admin` and everything under it. */
const ADMIN_PATH = /^\/admin(\/|\?|#|$)/;

/**
 * A same-origin path taken from `?callbackUrl=`, or null. Anything that could
 * leave the site (`https://…`, `//host`, `/\host`) is rejected, so the parameter
 * cannot be used as an open redirect.
 */
export function safeCallbackPath(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const value = raw.trim();
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//") || value.startsWith("/\\")) return null;
  return value;
}

export function isAdminPath(path: string | null | undefined): boolean {
  return Boolean(path) && ADMIN_PATH.test(path as string);
}

/**
 * After the workspace login: back to where you were if that was a workspace
 * page, otherwise the project picker. Never the admin console, whatever the
 * account's role: someone who used this door wants the workspace.
 */
export function memberLandingPath(callbackUrl: string | null | undefined): string {
  const target = safeCallbackPath(callbackUrl);
  if (target && !isAdminPath(target) && !AUTH_PAGE.test(target)) return target;
  return "/select-project";
}

/** After the admin login: back to an admin page, otherwise the console home. */
export function adminLandingPath(callbackUrl: string | null | undefined): string {
  const target = safeCallbackPath(callbackUrl);
  if (target && isAdminPath(target)) return target;
  return "/admin/overview";
}

/** The login page that matches the area a session was lost in. */
export function loginPathFor(pathname: string | null | undefined): "/login" | "/adminlogin" {
  return isAdminPath(pathname) ? "/adminlogin" : "/login";
}
