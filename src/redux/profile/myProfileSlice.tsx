import { Account } from "@services/account/dto/account.dto";
import { PrivacySettings } from "@services/account/dto/privacy.dto";
import { User } from "@services/user/dto/user.dto";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MyProfileState {
  activeIndex: number;
  userData: {
    user: User;
    account: Account;
    privacySettings: PrivacySettings;
  };
}

const initialState: MyProfileState = {
  activeIndex: 0,
  userData: {
    user: {} as User,
    account: {} as Account,
    privacySettings: {} as PrivacySettings,
  },
};

export const myProfileSlice = createSlice({
  name: "myProfile",
  initialState,
  reducers: {
    setActiveIndex: (state, action: PayloadAction<number>) => {
      state.activeIndex = action.payload;
    },
    setUserData(state, action: PayloadAction<MyProfileState["userData"]>) {
      state.userData = action.payload;
    },
  },
});

export const { setActiveIndex, setUserData } = myProfileSlice.actions;
export default myProfileSlice.reducer;
