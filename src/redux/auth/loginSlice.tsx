import { AuthPage, AuthType } from "@enums/auth.enum";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: AuthPage.LOGIN,
  authType: AuthType.PASSWORD,
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setAuthType: (state, action) => {
      state.authType = action.payload;
    },
  },
});

export const { setActiveTab, setAuthType } = loginSlice.actions;
export default loginSlice.reducer;
