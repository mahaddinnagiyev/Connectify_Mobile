import { configureStore } from "@reduxjs/toolkit";
import headerReducer from "./header/headerSlice";
import chatReducer from "./chat/chatSilce";

export const store = configureStore({
  reducer: {
    header: headerReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
