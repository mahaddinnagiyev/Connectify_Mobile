import { configureStore } from "@reduxjs/toolkit";
import headerReducer from "./header/headerSlice";
import chatReducer from "./chat/chatSilce";
import myFriendsReducer from "./friend/myFriendsSlice";
import usersReducer from "./users/usersSlice";
import myProfileReducer from "./profile/myProfileSlice";
import settingsReducer from "./settings/settingsSlice";
import loginReucer from "./auth/loginSlice";

export const store = configureStore({
  reducer: {
    header: headerReducer,
    chat: chatReducer,
    myFriends: myFriendsReducer,
    users: usersReducer,
    myProfile: myProfileReducer,
    settings: settingsReducer,

    // Auth
    login: loginReucer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
