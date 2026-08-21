import { afterEach, describe, expect, it, vi } from "vitest";
import { apiClient, ApiError } from "../api-client";

describe("apiClient metrics error handling", () => {
  afterEach(() => vi.unstubAllGlobals());

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
});
