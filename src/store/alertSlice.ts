import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AlertSeverity } from "@/types/notification";

export interface AlertState {
  searchQuery: string;
  selectedSeverity: AlertSeverity | "ALL";
  showOnlyUnacknowledged: boolean;
  selectedAlertId: string | null;
  activeTab: "alerts" | "rules";
}

const initialState: AlertState = {
  searchQuery: "",
  selectedSeverity: "ALL",
  showOnlyUnacknowledged: false,
  selectedAlertId: null,
  activeTab: "alerts",
};

export const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedSeverity: (state, action: PayloadAction<AlertSeverity | "ALL">) => {
      state.selectedSeverity = action.payload;
    },
    setShowOnlyUnacknowledged: (state, action: PayloadAction<boolean>) => {
      state.showOnlyUnacknowledged = action.payload;
    },
    setSelectedAlertId: (state, action: PayloadAction<string | null>) => {
      state.selectedAlertId = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<"alerts" | "rules">) => {
      state.activeTab = action.payload;
    },
    resetAlertFilters: (state) => {
      state.searchQuery = "";
      state.selectedSeverity = "ALL";
      state.showOnlyUnacknowledged = false;
      state.selectedAlertId = null;
    },
  },
});

export const {
  setSearchQuery,
  setSelectedSeverity,
  setShowOnlyUnacknowledged,
  setSelectedAlertId,
  setActiveTab,
  resetAlertFilters,
} = alertSlice.actions;

export default alertSlice.reducer;
