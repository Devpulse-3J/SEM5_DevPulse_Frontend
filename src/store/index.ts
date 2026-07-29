import { configureStore } from "@reduxjs/toolkit";
import alertReducer from "./alertSlice";
import notificationReducer from "./notificationSlice";

export const store = configureStore({
  reducer: {
    alert: alertReducer,
    notification: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
