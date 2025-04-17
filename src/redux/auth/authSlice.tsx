import { AuthPage, AuthType } from "@enums/auth.enum";
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  activeTab: AuthPage;
  authType: AuthType;
  loginForm: { username_or_email: string; password: string };
}

const initialState: AuthState = {
  isAuthenticated: false,
  activeTab: AuthPage.LOGIN,
  authType: AuthType.PASSWORD,
  loginForm: { username_or_email: "", password: "" },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setAuthType: (state, action) => {
      state.authType = action.payload;
    },
    // Login
    setLoginForm: (state, action) => {
      state.loginForm = { ...state.loginForm, ...action.payload };
    },
  },
});

export const { setIsAuthenticated, setActiveTab, setAuthType, setLoginForm } =
  authSlice.actions;
export default authSlice.reducer;
