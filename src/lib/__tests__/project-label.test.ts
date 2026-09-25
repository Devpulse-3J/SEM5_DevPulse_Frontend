import { describe, expect, it } from "vitest";
import { projectLabel } from "@/types/project";

describe("projectLabel", () => {
  it("prefers the project's name when the API supplied it", () => {
    expect(projectLabel(8, "Dev_pulse_Backend")).toBe("Dev_pulse_Backend");
  });

  it("falls back to the id when there is no name", () => {
    expect(projectLabel(8)).toBe("Project #8");
    expect(projectLabel(8, null)).toBe("Project #8");
  });

  it("treats a blank name as missing", () => {
    expect(projectLabel(8, "   ")).toBe("Project #8");
  });
});
