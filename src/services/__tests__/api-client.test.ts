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

    const error = await apiClient.get("/api/metrics/dora", {
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

    await apiClient.get("/api/metrics/dora", {
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
