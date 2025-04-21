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
    account: {
      id: "",
      bio: "",
      location: "",
      profile_picture: "",
      social_links: [],
      last_login: "",
    } as Account,
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

    // User Info
    updateUserFields(
      state,
      action: PayloadAction<Partial<MyProfileState["userData"]["user"]>>
    ) {
      state.userData.user = {
        ...state.userData.user,
        ...action.payload,
      };
    },

    // Account Info
    updateAccountFields(
      state,
      action: PayloadAction<Partial<MyProfileState["userData"]["account"]>>
    ) {
      state.userData.account = {
        ...state.userData.account,
        ...action.payload,
      };
    },

    changeProfilePhoto(
      state,
      action: PayloadAction<Partial<MyProfileState["userData"]["account"]>>
    ) {
      state.userData.account = {
        ...state.userData.account,
        ...action.payload,
      };
    },

    // Social Links
    updateSocialLink(
      state,
      action: PayloadAction<{ id: string; name: string; link: string }>
    ) {
      const { id, name, link } = action.payload;
      state.userData.account.social_links =
        state.userData.account.social_links.map((sl) =>
          sl.id === id ? { ...sl, name, link } : sl
        );
    },
    addSocialLink(
      state,
      action: PayloadAction<{ id: string; name: string; link: string }>
    ) {
      const { id, name, link } = action.payload;
      state.userData.account.social_links = [
        ...state.userData.account.social_links,
        { id, name, link },
      ];
    },
    removeSocialLink(state, action: PayloadAction<{ id: string }>) {
      state.userData.account.social_links =
        state.userData.account.social_links.filter(
          (sl) => sl.id !== action.payload.id
        );
    },
  },
});

export const {
  setActiveIndex,
  setUserData,
  updateUserFields,
  updateAccountFields,
  updateSocialLink,
  addSocialLink,
  removeSocialLink,
  changeProfilePhoto,
} = myProfileSlice.actions;
export default myProfileSlice.reducer;
