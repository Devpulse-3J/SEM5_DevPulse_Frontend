import { describe, expect, it } from "vitest";
import { describeMetricChange, formatMetricValue } from "../metric-display";

describe("DORA metric display helpers", () => {
  it("formats nullable and backend-native metric units", () => {
    expect(formatMetricValue({ value: null, unit: "hours" })).toBe("Not available");
    expect(formatMetricValue({ value: 12.5, unit: "%" })).toBe("12.5%");
    expect(formatMetricValue({ value: 0.2667, unit: "deployments/day" })).toBe("0.27/day");
  });

  it("knows that lower time is better", () => {
    expect(
      describeMetricChange({
        key: "leadTime",
        value: 20,
        previousValue: 30,
        unit: "hours",
      }),
    ).toMatchObject({ improving: true });
  });

  it("knows that higher deployment frequency is better", () => {
    expect(
      describeMetricChange({
        key: "deploymentFrequency",
        value: 0.5,
        previousValue: 0.25,
        unit: "deployments/day",
      }),
    ).toMatchObject({ improving: true });
  });
});
