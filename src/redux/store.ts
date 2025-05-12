import { configureStore } from "@reduxjs/toolkit";
import headerReducer from "./header/headerSlice";
import chatReducer from "./chat/chatSlice";
import myFriendsReducer from "./friend/myFriendsSlice";
import usersReducer from "./users/usersSlice";
import myProfileReducer from "./profile/myProfileSlice";
import settingsReducer from "./settings/settingsSlice";
import authReducer from "./auth/authSlice";
import messageReducer from "./messages/messageSlice";
import messengerReducer from "./messenger/messengerSlice";

export const store = configureStore({
  reducer: {
    header: headerReducer,
    chat: chatReducer,
    myFriends: myFriendsReducer,
    users: usersReducer,
    myProfile: myProfileReducer,
    settings: settingsReducer,

    // Chat & Messenger
    messenger: messengerReducer,

    // Messages
    messages: messageReducer,

    // Auth
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
