import { configureStore } from "@reduxjs/toolkit";
import alertReducer from "./alertSlice";
import notificationReducer from "./notificationSlice";
import dashboardReducer from "./dashboardSlice";

export const store = configureStore({
  reducer: {
    alert: alertReducer,
    notification: notificationReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
