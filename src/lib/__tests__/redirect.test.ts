import { describe, expect, it } from "vitest";
import {
  adminLandingPath,
  isAdminPath,
  loginPathFor,
  memberLandingPath,
  safeCallbackPath,
} from "../redirect";

describe("safeCallbackPath", () => {
  it("keeps a same-origin path", () => {
    expect(safeCallbackPath("/dashboard")).toBe("/dashboard");
    expect(safeCallbackPath("/pull-requests?state=open")).toBe("/pull-requests?state=open");
  });

  it("rejects anything that could leave the site", () => {
    expect(safeCallbackPath("https://evil.example/x")).toBeNull();
    expect(safeCallbackPath("//evil.example")).toBeNull();
    expect(safeCallbackPath("/\\evil.example")).toBeNull();
    expect(safeCallbackPath("javascript:alert(1)")).toBeNull();
    expect(safeCallbackPath("dashboard")).toBeNull();
  });

  it("treats empty input as no callback", () => {
    expect(safeCallbackPath(null)).toBeNull();
    expect(safeCallbackPath(undefined)).toBeNull();
    expect(safeCallbackPath("  ")).toBeNull();
  });
});

describe("isAdminPath", () => {
  it("matches the console and everything under it", () => {
    expect(isAdminPath("/admin")).toBe(true);
    expect(isAdminPath("/admin/overview")).toBe(true);
    expect(isAdminPath("/admin/projects/8")).toBe(true);
    expect(isAdminPath("/admin?tab=x")).toBe(true);
  });

  it("does not match look-alikes", () => {
    expect(isAdminPath("/adminlogin")).toBe(false);
    expect(isAdminPath("/administrators")).toBe(false);
    expect(isAdminPath("/dashboard")).toBe(false);
    expect(isAdminPath(null)).toBe(false);
  });
});

describe("memberLandingPath (the workspace login)", () => {
  it("sends everyone to the project picker by default, admins included", () => {
    expect(memberLandingPath(null)).toBe("/select-project");
  });

  it("does not follow a callback into the admin console", () => {
    // The bug: signing out of /admin/projects/8 left this on the workspace login.
    expect(memberLandingPath("/admin/projects/8")).toBe("/select-project");
    expect(memberLandingPath("/admin/overview")).toBe("/select-project");
  });

  it("still returns to a workspace page the visitor was on", () => {
    expect(memberLandingPath("/dashboard")).toBe("/dashboard");
    expect(memberLandingPath("/pull-requests/12")).toBe("/pull-requests/12");
  });

  it("ignores a callback that is unsafe or is itself a login page", () => {
    expect(memberLandingPath("https://evil.example")).toBe("/select-project");
    expect(memberLandingPath("/login")).toBe("/select-project");
    expect(memberLandingPath("/adminlogin?x=1")).toBe("/select-project");
    expect(memberLandingPath("/register")).toBe("/select-project");
  });
});

describe("adminLandingPath (the admin login)", () => {
  it("defaults to the console home", () => {
    expect(adminLandingPath(null)).toBe("/admin/overview");
  });

  it("returns to the admin page the visitor was on", () => {
    expect(adminLandingPath("/admin/projects/8")).toBe("/admin/projects/8");
  });

  it("does not follow a callback into the workspace or off the site", () => {
    expect(adminLandingPath("/dashboard")).toBe("/admin/overview");
    expect(adminLandingPath("//evil.example")).toBe("/admin/overview");
    expect(adminLandingPath("https://evil.example/admin")).toBe("/admin/overview");
  });
});

describe("loginPathFor", () => {
  it("returns an admin to the admin login, everyone else to the workspace login", () => {
    expect(loginPathFor("/admin/overview")).toBe("/adminlogin");
    expect(loginPathFor("/admin/projects/8")).toBe("/adminlogin");
    expect(loginPathFor("/dashboard")).toBe("/login");
    expect(loginPathFor("/select-project")).toBe("/login");
    expect(loginPathFor(null)).toBe("/login");
  });
});
