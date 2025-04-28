import { Account } from "@services/account/dto/account.dto";
import { PrivacySettings } from "@services/account/dto/privacy.dto";
import { User } from "@services/user/dto/user.dto";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Gender } from "@/src/enums/gender.enum";

interface MyProfileState {
  activeIndex: number;
  userData: {
    user: User;
    account: Account;
    privacySettings: PrivacySettings;
  };

  // Privacy Settings
  isPrivacySettingsChanged: boolean;
}

const initialState: MyProfileState = {
  activeIndex: 0,
  userData: {
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

  // Privacy Settings
  isPrivacySettingsChanged: false,
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

    // Privacy Settings
    setIsPrivachSettingsChagned: (state, action: PayloadAction<boolean>) => {
      state.isPrivacySettingsChanged = action.payload;
    },

    updatePrivacySettingsForm: (
      state,
      action: PayloadAction<PrivacySettings>
    ) => {
      state.userData.privacySettings = action.payload;
    },

    updatePrivacySettings: (state, action: PayloadAction<PrivacySettings>) => {
      state.userData.privacySettings = {
        ...state.userData.privacySettings,
        ...action.payload,
      };
    },

    // Update User Face ID
    updateUserFaceID: (state, action: PayloadAction<number[] | null>) => {
      state.userData.user.face_descriptor = action.payload;
    },
  },
});

export const {
  setActiveIndex,
  setUserData,
  updateUserFields,

  // Account
  updateAccountFields,
  updateSocialLink,
  addSocialLink,
  removeSocialLink,
  changeProfilePhoto,

  // Privacy Settings
  setIsPrivachSettingsChagned,
  updatePrivacySettingsForm,
  updatePrivacySettings,

  // Face ID
  updateUserFaceID,
} = myProfileSlice.actions;
export default myProfileSlice.reducer;
