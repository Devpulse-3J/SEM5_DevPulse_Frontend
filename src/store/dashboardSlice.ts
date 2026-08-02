import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// OWNER: Person B — client-only UI state for the Manager/DORA/Team screens
// (filters + selections). Server data never lives here — that's React Query.

export type DateRange = "7d" | "14d" | "30d" | "90d";

/** A user's role is per-project, so the active project carries its own role. */
export type WorkspaceRole = "MANAGER" | "DEVELOPER";
export interface ActiveProject {
  id: string;
  name: string;
  role: WorkspaceRole;
}

export interface DashboardState {
  /** The project the user picked after login + their role on it. null = not chosen. */
  activeProject: ActiveProject | null;
  /** Selected team filter, or "ALL" for the whole org. */
  team: string;
  /** Active date-range window for metrics. */
  dateRange: DateRange;
  /** Currently focused project (repo group) within the dashboard, or null for all. */
  selectedProjectId: string | null;
}

const initialState: DashboardState = {
  activeProject: null,
  team: "ALL",
  dateRange: "30d",
  selectedProjectId: null,
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setActiveProject: (state, action: PayloadAction<ActiveProject>) => {
      state.activeProject = action.payload;
    },
    clearActiveProject: (state) => {
      state.activeProject = null;
    },
    setTeam: (state, action: PayloadAction<string>) => {
      state.team = action.payload;
    },
    setDateRange: (state, action: PayloadAction<DateRange>) => {
      state.dateRange = action.payload;
    },
    setSelectedProjectId: (state, action: PayloadAction<string | null>) => {
      state.selectedProjectId = action.payload;
    },
    resetDashboardFilters: () => initialState,
  },
});

export const {
  setActiveProject,
  clearActiveProject,
  setTeam,
  setDateRange,
  setSelectedProjectId,
  resetDashboardFilters,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
