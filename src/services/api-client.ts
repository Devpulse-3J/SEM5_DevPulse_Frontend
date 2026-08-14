import { getToken, clearSession } from "@/lib/auth";
import { RATE_LIMIT_MESSAGE } from "@/lib/constants";

/**
 * Normalised error for every failure in the stack.
 *
 * The backend produces FOUR different error bodies depending on which component
 * rejects the request, so nothing above this layer should ever parse a raw
 * response:
 *   gateway              { status, error, path }
 *   auth-service         { timestamp, status, error }
 *   auth-service (400)   { timestamp, status, error: "Validation failed", fieldErrors }
 *   Spring default       { timestamp, status, error, path }
 */
export class ApiError extends Error {
  readonly status: number;
  /** Server's short error title, e.g. "Validation failed". */
  readonly error?: string;
  /** Per-field messages from a 400. Render these on the offending input. */
  readonly fieldErrors?: Record<string, string>;

  constructor(
    status: number,
    message: string,
    error?: string,
    fieldErrors?: Record<string, string>
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.error = error;
    this.fieldErrors = fieldErrors;
  }
}

interface RequestOptions extends RequestInit {
  /** Overrides the stored token. Used during login before the token is saved. */
  token?: string;
  params?: Record<string, string | number | boolean | undefined>;
  /** Set false for public endpoints so a 401 doesn't bounce the user. */
  requiresAuth?: boolean;
}

export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, "");
  }
  return "http://localhost:8080";
}

/**
 * A 401 means the token is gone or expired. There is no refresh endpoint, so
 * the only correct response is to drop the session and get out of the way.
 * Never retry.
 */
function handleUnauthorized(): void {
  clearSession();
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
    const callback = encodeURIComponent(window.location.pathname);
    window.location.replace(`/login?callbackUrl=${callback}`);
  }
}

/** Flattens any of the four server error bodies into one message. */
function parseErrorBody(
  data: unknown,
  status: number,
  url: string
): { message: string; title?: string; fieldErrors?: Record<string, string> } {
  let message = "";
  let title: string | undefined;
  let fieldErrors: Record<string, string> | undefined;

  if (typeof data === "object" && data !== null) {
    const body = data as {
      message?: string;
      error?: string;
      fieldErrors?: Record<string, string>;
    };
    fieldErrors = body.fieldErrors;
    title = body.error;
    message = body.message || body.error || "";
  } else if (typeof data === "string" && data.trim()) {
    message = data;
  }

  // A validation failure's useful detail is in fieldErrors, not the title.
  if (fieldErrors && Object.keys(fieldErrors).length > 0 && !message) {
    message = Object.values(fieldErrors)[0];
  }

  if (!message) {
    switch (status) {
      case 400:
        message = "Invalid request. Please check the form and try again.";
        break;
      case 401:
        message = "Your session has expired. Please sign in again.";
        break;
      case 403:
        message = "You do not have permission to do that.";
        break;
      case 404:
        message = `Not found (404): ${url}`;
        break;
      case 409:
        message = "That already exists (e.g. an account with this email).";
        break;
      case 429:
        message = RATE_LIMIT_MESSAGE;
        break;
      default:
        message =
          status >= 500
            ? `Server error (${status}). Check the service logs.`
            : `Request failed with status ${status}.`;
    }
  }

  // The gateway's 429 body is unhelpful; always use our wording.
  if (status === 429) message = RATE_LIMIT_MESSAGE;

  return { message, title, fieldErrors };
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  let url = `${baseUrl}${cleanEndpoint}`;
  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, String(value));
    });
    const queryString = searchParams.toString();
    if (queryString) url += `?${queryString}`;
  }

  const { token, params: _params, requiresAuth = true, ...fetchOptions } = options;
  void _params;

  const headers = new Headers(fetchOptions.headers);
  if (!headers.has("Content-Type") && !(fetchOptions.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  const resolvedToken = token ?? getToken();
  if (resolvedToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${resolvedToken}`);
  }

  let response: Response;
  try {
    response = await fetch(url, { ...fetchOptions, headers });
  } catch (error: unknown) {
    const raw = error instanceof Error ? error.message : String(error);
    throw new ApiError(
      0,
      `Unable to reach the API at ${baseUrl}. Is the gateway running, and does its CORS config allow this origin?`,
      raw
    );
  }

  // 204 and other empty successes have no body to parse.
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    if (!response.ok) {
      throw new ApiError(response.status, `Request failed with status ${response.status}.`);
    }
    return undefined as T;
  }

  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json") ?? false;
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const { message, title, fieldErrors } = parseErrorBody(data, response.status, url);
    if (response.status === 401 && requiresAuth) handleUnauthorized();
    throw new ApiError(response.status, message, title, fieldErrors);
  }

  return data as T;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),
  put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),
  patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};

export default apiClient;
