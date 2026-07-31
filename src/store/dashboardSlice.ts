import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// OWNER: Person B — client-only UI state for the Manager/DORA/Team screens
// (filters + selections). Server data never lives here — that's React Query.

export type DateRange = "7d" | "14d" | "30d" | "90d";

export interface DashboardState {
  /** Selected team filter, or "ALL" for the whole org. */
  team: string;
  /** Active date-range window for metrics. */
  dateRange: DateRange;
  /** Currently focused project (repo group), or null for all. */
  selectedProjectId: string | null;
}

const initialState: DashboardState = {
  team: "ALL",
  dateRange: "30d",
  selectedProjectId: null,
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
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
  setTeam,
  setDateRange,
  setSelectedProjectId,
  resetDashboardFilters,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
