import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "../api-client";
import { authService } from "../auth.service";

vi.mock("../api-client", () => ({
  apiClient: { get: vi.fn(), post: vi.fn() },
}));

vi.mock("@/lib/auth", () => ({
  getToken: vi.fn(),
  setToken: vi.fn(),
  getStoredUser: vi.fn(),
  setStoredUser: vi.fn(),
  clearSession: vi.fn(),
  getTokenExpiresAt: vi.fn(),
  isTokenExpired: vi.fn(),
  hasValidSession: vi.fn(),
}));

const postMock = vi.mocked(apiClient.post);

describe("authService.register", () => {
  beforeEach(() => {
    postMock.mockReset();
    postMock.mockResolvedValue({ accessToken: "jwt" });
  });

  it("sends the invitation token to the register endpoint unchanged", async () => {
    await authService.register({
      fullName: "New Person",
      email: "new@x.com",
      password: "chosen-password",
      inviteToken: "abc-123",
    });

    expect(postMock).toHaveBeenCalledWith(
      "/api/auth/register",
      expect.objectContaining({ email: "new@x.com", inviteToken: "abc-123" }),
      { requiresAuth: false },
    );
  });

  it("leaves inviteToken out of an ordinary signup", async () => {
    await authService.register({
      fullName: "New Person",
      email: "new@x.com",
      password: "chosen-password",
    });

    const body = postMock.mock.calls[0][1] as Record<string, unknown>;
    expect(body).not.toHaveProperty("inviteToken");
  });
});

describe("authService.acceptProjectInvitation", () => {
  beforeEach(() => {
    postMock.mockReset();
    postMock.mockResolvedValue({ status: "success", projectId: 8, role: "developer" });
  });

  it("posts the token as a query parameter to the gateway accept route", async () => {
    await expect(authService.acceptProjectInvitation("abc-123")).resolves.toEqual({
      status: "success",
      projectId: 8,
      role: "developer",
    });

    expect(postMock).toHaveBeenCalledWith(
      "/api/auth/invitations/project/accept?token=abc-123",
    );
  });

  it("URL-encodes a token with reserved characters", async () => {
    await authService.acceptProjectInvitation("a&b=c");

    expect(postMock).toHaveBeenCalledWith(
      "/api/auth/invitations/project/accept?token=a%26b%3Dc",
    );
  });
});

describe("authService.switchCompany", () => {
  beforeEach(() => {
    postMock.mockReset();
    postMock.mockResolvedValue({ accessToken: "switched", companyId: 15, systemRole: "member" });
  });

  it("posts to the gateway switch route for that company, authenticated", async () => {
    const result = await authService.switchCompany(15);

    // No `requiresAuth: false`: the caller must present their current token.
    expect(postMock).toHaveBeenCalledWith("/api/auth/companies/15/switch");
    expect(result.accessToken).toBe("switched");
  });
});
