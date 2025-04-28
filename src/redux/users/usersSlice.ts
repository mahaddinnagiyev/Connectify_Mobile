import { Account } from "@services/account/dto/account.dto";
import { PrivacySettings } from "@services/account/dto/privacy.dto";
import { User } from "@services/user/dto/user.dto";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UsersState {
  otherUserData: {
    user: User;
    account: Account;
    privacySettings: PrivacySettings;
  };
}

const initialState: UsersState = {
  otherUserData: {
    user: {
      id: "",
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      gender: null,
      face_descriptor: null,
      created_at: null,
    } as User,
    account: {
      id: "",
      bio: "",
      location: "",
      profile_picture: "",
      social_links: [],
      last_login: null,
    } as Account,
    privacySettings: {} as PrivacySettings,
  },
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setOtherUserData: (state, action: PayloadAction<UsersState>) => {
      state.otherUserData = action.payload.otherUserData;
    },
  },
});

export const { setOtherUserData } = usersSlice.actions;
export default usersSlice.reducer;
