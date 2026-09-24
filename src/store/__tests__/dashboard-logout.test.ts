import { describe, expect, it } from "vitest";
import dashboardReducer, { setActiveProject, setTeam } from "../dashboardSlice";
import { logout } from "../authSlice";

describe("dashboard state on logout", () => {
  it("forgets the chosen project and its role", () => {
    let state = dashboardReducer(undefined, { type: "@@init" });
    state = dashboardReducer(
      state,
      setActiveProject({ id: "8", name: "Project 8", role: "MANAGER" }),
    );
    expect(state.activeProject?.role).toBe("MANAGER");

    state = dashboardReducer(state, logout());

    expect(state.activeProject).toBeNull();
  });

  it("also resets the other per-session selections", () => {
    let state = dashboardReducer(undefined, { type: "@@init" });
    state = dashboardReducer(state, setTeam("platform"));

    state = dashboardReducer(state, logout());

    expect(state.team).toBe("ALL");
  });
});
