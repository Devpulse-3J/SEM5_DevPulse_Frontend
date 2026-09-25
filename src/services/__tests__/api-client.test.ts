import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { apiClient, ApiError } from "../api-client";

describe("apiClient metrics error handling", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("normalizes the metrics-service nested error envelope", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: {
              code: "PROJECT_ACCESS_DENIED",
              message: "The authenticated user is not a member of this project",
            },
          }),
          { status: 403, headers: { "content-type": "application/json" } },
        ),
      ),
    );

    const error = await apiClient.get("/metrics/dora", {
      params: { projectId: 7 },
    }).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 403,
      error: "PROJECT_ACCESS_DENIED",
      message: "The authenticated user is not a member of this project",
    });
  });

  it("logs every API request and response without exposing headers", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          statusText: "OK",
          headers: { "content-type": "application/json" },
        }),
      ),
    );

    await apiClient.get("/metrics/dora", {
      params: { projectId: 7 },
      token: "secret-token",
    });

    expect(log).toHaveBeenCalledTimes(2);
    expect(log.mock.calls[0][0]).toContain(
      "[API] GET http://localhost:8080/api/metrics/dora?projectId=7",
    );
    expect(log.mock.calls[1][0]).toMatch(
      /^\[API\] GET .* 200 OK \(\d+ms\)$/,
    );
    expect(log.mock.calls.flat().join(" ")).not.toContain("secret-token");
  });
});

/**
 * NEXT_PUBLIC_API_BASE_URL already ends in `/api` in production ("/api"), so
 * every endpoint passed to apiClient is written WITHOUT that prefix
 * ("/auth/login"). An endpoint that still starts with "/api/" is sent as
 * "/api/api/..." and the gateway answers 404. It merges silently - there is no
 * text conflict when one branch adds the prefix and another removes it - so
 * guard it here.
 */
function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "__tests__" ? [] : sourceFiles(path);
    return /\.(ts|tsx)$/.test(name) ? [path] : [];
  });
}

describe("apiClient endpoint convention", () => {
  it("never passes an endpoint that repeats the /api base prefix", () => {
    const offenders: string[] = [];
    for (const file of sourceFiles(join(process.cwd(), "src"))) {
      const text = readFileSync(file, "utf8");
      // apiClient.<verb>( optionally generic, optionally on the next line, then a "/api/ or `/api/ literal
      const call = /apiClient\s*\.\s*(?:get|post|put|patch|delete)\s*(?:<[^()]*>)?\s*\(\s*["`]\/api\//g;
      // hand-built fallback URLs: `${base}/api/...` where base already ends in /api.
      // `${window.location.origin}/api/...` is a correct public URL, so it is exempt.
      const built = /\$\{(?![^}]*location\.origin)[^}]*\}\/api\//;
      if (call.test(text) || built.test(text)) offenders.push(file.replace(process.cwd() + "/", ""));
    }
    expect(offenders).toEqual([]);
  });
});
