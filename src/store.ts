import { configureStore } from "@reduxjs/toolkit";
import ChatwindowSlice from "./Components/ChatwindowSlice";

export const store = configureStore({
  reducer: {
    chat: ChatwindowSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
