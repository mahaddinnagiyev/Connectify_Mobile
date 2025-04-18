import { AuthPage, AuthType } from "@enums/auth.enum";
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  activeTab: AuthPage;
  authType: AuthType;
  isFaceIDModalOpen: boolean;
  loginForm: { username_or_email: string; password: string };
  faceIdLoginForm: {
    username_or_email_face_id: string;
    face_descriptor: number[];
  };
}

const initialState: AuthState = {
  isAuthenticated: false,
  activeTab: AuthPage.LOGIN,
  authType: AuthType.PASSWORD,
  isFaceIDModalOpen: false,
  loginForm: { username_or_email: "", password: "" },
  faceIdLoginForm: { username_or_email_face_id: "", face_descriptor: [] },
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
    setIsFaceIDModalOpen: (state, action) => {
      state.isFaceIDModalOpen = action.payload;
    },
    setFaceIdLoginForm: (state, action) => {
      state.faceIdLoginForm = { ...state.faceIdLoginForm, ...action.payload };
    },
  },
});

export const {
  setIsAuthenticated,
  setActiveTab,
  setAuthType,
  setLoginForm,
  setIsFaceIDModalOpen,
  setFaceIdLoginForm,
} = authSlice.actions;
export default authSlice.reducer;
