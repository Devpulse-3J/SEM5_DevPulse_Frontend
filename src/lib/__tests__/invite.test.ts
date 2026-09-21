import { describe, expect, it } from "vitest";
import { inviteHref, readInviteParams } from "../invite";

const params = (query: string) => new URLSearchParams(query);

describe("readInviteParams", () => {
  it("reads the token and the address from the invitation link", () => {
    expect(readInviteParams(params("invite=abc-123&email=new%40x.com"))).toEqual({
      token: "abc-123",
      email: "new@x.com",
    });
  });

  it("returns no token for an ordinary visit to /register", () => {
    expect(readInviteParams(params(""))).toEqual({ token: undefined, email: "" });
  });

  it("ignores an address that arrives without a token", () => {
    expect(readInviteParams(params("email=new%40x.com"))).toEqual({
      token: undefined,
      email: "",
    });
  });

  it("treats a blank token as no token", () => {
    expect(readInviteParams(params("invite=%20%20&email=new%40x.com"))).toEqual({
      token: undefined,
      email: "",
    });
  });

  it("keeps a token even when the address is missing", () => {
    expect(readInviteParams(params("invite=abc-123"))).toEqual({
      token: "abc-123",
      email: "",
    });
  });

  it("trims whitespace around both values", () => {
    expect(readInviteParams(params("invite=%20abc%20&email=%20new%40x.com%20"))).toEqual({
      token: "abc",
      email: "new@x.com",
    });
  });
});

describe("inviteHref", () => {
  it("keeps the token and address when moving between login and register", () => {
    const invite = { token: "abc-123", email: "new@x.com" };
    expect(inviteHref("/login", invite)).toBe("/login?invite=abc-123&email=new%40x.com");
    expect(inviteHref("/register", invite)).toBe("/register?invite=abc-123&email=new%40x.com");
  });

  it("omits the address when the invitation link had none", () => {
    expect(inviteHref("/login", { token: "abc-123", email: "" })).toBe("/login?invite=abc-123");
  });

  it("is just the path for an ordinary visit", () => {
    expect(inviteHref("/login", { token: undefined, email: "" })).toBe("/login");
    expect(inviteHref("/register", { token: undefined, email: "" })).toBe("/register");
  });

  it("encodes a token that contains reserved characters", () => {
    expect(inviteHref("/login", { token: "a&b=c", email: "" })).toBe("/login?invite=a%26b%3Dc");
  });
});
