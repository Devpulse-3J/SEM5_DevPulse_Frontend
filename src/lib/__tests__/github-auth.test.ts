import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { getGithubAuthorizeUrl, parseGithubAuthState } from "../github-auth";

describe("github-auth utility", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("getGithubAuthorizeUrl", () => {
    it("throws an error if NEXT_PUBLIC_GITHUB_CLIENT_ID is missing", () => {
      delete process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
      delete process.env.GITHUB_CLIENT_ID;
      expect(() => getGithubAuthorizeUrl()).toThrow(/GitHub Client ID is not configured/);
    });

    it("generates a valid GitHub authorization URL", () => {
      process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID = "test-client-id";
      process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI = "https://odineye.cse23.org/auth/github/callback";

      const url = getGithubAuthorizeUrl({ intent: "login", inviteToken: "inv-123", callbackUrl: "/dashboard" });
      const parsed = new URL(url);

      expect(parsed.origin).toBe("https://github.com");
      expect(parsed.pathname).toBe("/login/oauth/authorize");
      expect(parsed.searchParams.get("client_id")).toBe("test-client-id");
      expect(parsed.searchParams.get("redirect_uri")).toBe("https://odineye.cse23.org/auth/github/callback");
      expect(parsed.searchParams.get("scope")).toBe("read:user,user:email");

      const stateRaw = parsed.searchParams.get("state");
      expect(stateRaw).toBeTruthy();

      const decoded = parseGithubAuthState(stateRaw);
      expect(decoded.intent).toBe("login");
      expect(decoded.inviteToken).toBe("inv-123");
      expect(decoded.callbackUrl).toBe("/dashboard");
    });
  });

  describe("parseGithubAuthState", () => {
    it("returns default login intent for null or undefined", () => {
      expect(parseGithubAuthState(null)).toEqual({ intent: "login" });
      expect(parseGithubAuthState(undefined)).toEqual({ intent: "login" });
    });

    it("handles plain string fallbacks", () => {
      expect(parseGithubAuthState("login")).toEqual({ intent: "login" });
      expect(parseGithubAuthState("link")).toEqual({ intent: "link" });
    });

    it("decodes valid base64 payload", () => {
      const payload = JSON.stringify({ intent: "link", inviteToken: null, callbackUrl: "/team" });
      const encoded = Buffer.from(payload).toString("base64");
      expect(parseGithubAuthState(encoded)).toEqual({ intent: "link", inviteToken: null, callbackUrl: "/team" });
    });
  });
});
