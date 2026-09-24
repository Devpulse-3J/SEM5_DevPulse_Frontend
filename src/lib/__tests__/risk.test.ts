import { describe, expect, it } from "vitest";
import { riskPresentation } from "../risk";
import type { PRRiskAnalysis } from "@/types/pullRequest";

const risk = (overrides: Partial<PRRiskAnalysis>): PRRiskAnalysis => ({
  riskScore: 50,
  riskLevel: "MEDIUM",
  summary: "The model estimates a 50% chance this pull request goes stale.",
  factors: [],
  ...overrides,
});

describe("riskPresentation", () => {
  it("shows a high-risk PR in red with its percentage", () => {
    const view = riskPresentation(risk({ riskLevel: "HIGH", riskScore: 79.3 }));

    expect(view.label).toBe("High risk · 79%");
    expect(view.variant).toBe("danger");
    expect(view.risky).toBe(true);
  });

  it("shows a medium-risk PR in amber", () => {
    const view = riskPresentation(risk({ riskLevel: "MEDIUM", riskScore: 43.5 }));

    expect(view.label).toBe("Medium risk · 44%");
    expect(view.variant).toBe("warning");
    expect(view.risky).toBe(false);
  });

  it("shows a low-risk PR in green", () => {
    const view = riskPresentation(risk({ riskLevel: "LOW", riskScore: 12 }));

    expect(view.label).toBe("Low risk · 12%");
    expect(view.variant).toBe("success");
    expect(view.risky).toBe(false);
  });

  it("treats critical like high, and says so", () => {
    const view = riskPresentation(risk({ riskLevel: "CRITICAL", riskScore: 97 }));

    expect(view.label).toBe("Critical risk · 97%");
    expect(view.variant).toBe("danger");
    expect(view.risky).toBe(true);
  });

  it("says 'Not scored' for a PR with no prediction instead of inventing one", () => {
    for (const missing of [null, undefined]) {
      const view = riskPresentation(missing);
      expect(view.label).toBe("Not scored");
      expect(view.variant).toBe("default");
      expect(view.risky).toBe(false);
    }
  });

  it("puts the model's summary, name and version in the tooltip", () => {
    const view = riskPresentation(
      risk({ algorithm: "xgboost", modelVersion: "1.0.0", predictedAt: "2026-09-21T11:49:45Z" }),
    );

    expect(view.tooltip).toContain("goes stale");
    expect(view.tooltip).toContain("Model: xgboost v1.0.0");
    expect(view.tooltip).toContain("Scored:");
  });

  it("still has a tooltip when the model details are missing", () => {
    expect(riskPresentation(risk({})).tooltip).toContain("goes stale");
  });
});
