import { authService } from "./auth.service";

export class ApiError extends Error {
  status: number;
  error?: string;
  fieldErrors?: Record<string, string>;

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
  token?: string;
  params?: Record<string, string | number | boolean | undefined>;
}

export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, "");
  }
  return "http://localhost:8081";
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  let url = `${baseUrl}${cleanEndpoint}`;
  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const { token, params: _, ...fetchOptions } = options;
  void _;
  const resolvedToken = token || authService.getToken();

  const headers = new Headers(fetchOptions.headers);
  if (!headers.has("Content-Type") && !(fetchOptions.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (resolvedToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${resolvedToken}`);
  }

  const method = fetchOptions.method || "GET";
  const startTime = typeof performance !== "undefined" ? performance.now() : Date.now();

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    const durationMs = Math.round(
      (typeof performance !== "undefined" ? performance.now() : Date.now()) - startTime
    );

    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      let errorMessage = "";
      let errorTitle = `HTTP ${response.status}`;
      let fieldErrors: Record<string, string> | undefined;

      if (typeof data === "object" && data !== null) {
        const d = data as {
          message?: string;
          error?: string;
          fieldErrors?: Record<string, string>;
        };
        errorMessage = d.message || d.error || "";
        errorTitle = d.error || `HTTP ${response.status}`;
        fieldErrors = d.fieldErrors;
      } else if (typeof data === "string" && data.trim()) {
        errorMessage = data;
      }

      if (!errorMessage) {
        if (response.status === 400) {
          errorMessage = "Bad request: Invalid payload or validation failed.";
        } else if (response.status === 401) {
          errorMessage = "Unauthorized: Invalid credentials or expired session.";
        } else if (response.status === 403) {
          errorMessage = "Forbidden (403): Endpoint access denied or unauthenticated route rejected by security policy.";
        } else if (response.status === 404) {
          errorMessage = `Endpoint not found (404) at ${url}.`;
        } else if (response.status === 409) {
          errorMessage = "Conflict: A record with these details already exists (e.g. duplicate email).";
        } else if (response.status >= 500) {
          errorMessage = `Backend server error (${response.status}). Please check backend service logs.`;
        } else {
          errorMessage = response.statusText || `Request failed with HTTP status ${response.status}.`;
        }
      }

      console.group(
        `%c[API-ERROR] ${method} ${cleanEndpoint} (${response.status} ${response.statusText}) [${durationMs}ms]`,
        "color: #ffffff; background-color: #ef4444; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 10px;"
      );
      console.warn(`❌ Error Message: ${errorMessage}`);
      console.warn(`❌ Error Code/Title: ${errorTitle}`);
      if (fieldErrors && Object.keys(fieldErrors).length > 0) {
        console.warn("❌ Field Validation Errors:", fieldErrors);
      }
      console.log("📍 Failed Target URL:", url);
      console.log("📄 Raw Server Response:", data);
      console.groupEnd();

      throw new ApiError(response.status, errorMessage, errorTitle, fieldErrors);
    }

    return data as T;
  } catch (error: unknown) {
    const durationMs = Math.round(
      (typeof performance !== "undefined" ? performance.now() : Date.now()) - startTime
    );

    if (error instanceof ApiError) {
      throw error;
    }

    const rawMsg = error instanceof Error ? error.message : String(error);
    const isConnectionError = rawMsg.includes("Failed to fetch") || rawMsg.includes("fetch failed") || rawMsg.includes("NetworkError");
    const userMessage = isConnectionError
      ? `Unable to connect to backend server at ${baseUrl}. Please ensure the microservice/gateway is running.`
      : rawMsg;

    console.group(
      `%c[API-NETWORK-FAILURE] ${method} ${cleanEndpoint} [${durationMs}ms]`,
      "color: #ffffff; background-color: #dc2626; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 10px;"
    );
    console.warn("❌ Connection / Network Error:", rawMsg);
    console.warn("📍 Target URL Attempted:", url);
    console.warn("💡 Troubleshooting Tip:", `Check if backend is running on ${baseUrl} and CORS headers are configured.`);
    console.groupEnd();

    throw new ApiError(0, userMessage);
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),
  put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),
  patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};

export default apiClient;
