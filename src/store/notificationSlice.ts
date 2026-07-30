import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  durationMs?: number;
}

export interface NotificationState {
  isDrawerOpen: boolean;
  unreadCount: number;
  toastQueue: ToastMessage[];
}

const initialState: NotificationState = {
  isDrawerOpen: false,
  unreadCount: 2,
  toastQueue: [],
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    toggleNotificationDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    setDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isDrawerOpen = action.payload;
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    decrementUnreadCount: (state) => {
      if (state.unreadCount > 0) {
        state.unreadCount -= 1;
      }
    },
    addToast: (state, action: PayloadAction<Omit<ToastMessage, "id">>) => {
      const toast: ToastMessage = {
        ...action.payload,
        id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      };
      state.toastQueue.push(toast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toastQueue = state.toastQueue.filter((t) => t.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toastQueue = [];
    },
  },
});

export const {
  toggleNotificationDrawer,
  setDrawerOpen,
  setUnreadCount,
  decrementUnreadCount,
  addToast,
  removeToast,
  clearToasts,
} = notificationSlice.actions;

export default notificationSlice.reducer;
