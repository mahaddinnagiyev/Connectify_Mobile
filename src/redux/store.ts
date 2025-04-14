import { configureStore } from "@reduxjs/toolkit";
import headerReducer from "./header/headerSlice";
import chatReducer from "./chat/chatSilce";
import myFriendsReducer from "./friend/myFriendsSlice";
import usersReducer from "./users/usersSlice";

export const store = configureStore({
  reducer: {
    header: headerReducer,
    chat: chatReducer,
    myFriends: myFriendsReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
