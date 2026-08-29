import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "@/lib/constants";

export type DateRange = "7d" | "14d" | "30d" | "90d";

export type WorkspaceRole = "MANAGER" | "DEVELOPER";
export interface ActiveProject {
  id: string;
  name: string;
  role: WorkspaceRole;
}

export interface DashboardState {
  activeProject: ActiveProject | null;
  team: string;
  dateRange: DateRange;
  selectedProjectId: string | null;
}

const ACTIVE_PROJECT_KEY = STORAGE_KEYS.activeProject;

function loadActiveProject(): ActiveProject | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ACTIVE_PROJECT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveActiveProject(project: ActiveProject | null) {
  if (typeof window === "undefined") return;
  try {
    if (project) {
      localStorage.setItem(ACTIVE_PROJECT_KEY, JSON.stringify(project));
    } else {
      localStorage.removeItem(ACTIVE_PROJECT_KEY);
    }
  } catch {
    // ignore
  }
}

const initialState: DashboardState = {
  activeProject: loadActiveProject(),
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
      saveActiveProject(action.payload);
    },
    clearActiveProject: (state) => {
      state.activeProject = null;
      saveActiveProject(null);
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
    resetDashboardFilters: () => {
      saveActiveProject(null);
      return {
        ...initialState,
        activeProject: null,
      };
    },
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
