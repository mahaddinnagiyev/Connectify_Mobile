import { AuthPage, AuthType } from "@enums/auth.enum";
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  activeTab: AuthPage;

  // Login
  authType: AuthType;
  isFaceIDModalOpen: boolean;
  loginForm: { username_or_email: string; password: string };
  faceIdLoginForm: {
    username_or_email_face_id: string;
    face_descriptor: number[];
  };

  // Confirm Account
  code: string[];
}

const initialState: AuthState = {
  isAuthenticated: false,
  activeTab: AuthPage.LOGIN,

  // Login
  authType: AuthType.PASSWORD,
  isFaceIDModalOpen: false,
  loginForm: { username_or_email: "", password: "" },
  faceIdLoginForm: { username_or_email_face_id: "", face_descriptor: [] },

  // Confirm Account
  code: new Array(6).fill(""),
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

    // Login
    setAuthType: (state, action) => {
      state.authType = action.payload;
    },
    setLoginForm: (state, action) => {
      state.loginForm = { ...state.loginForm, ...action.payload };
    },
    setIsFaceIDModalOpen: (state, action) => {
      state.isFaceIDModalOpen = action.payload;
    },
    setFaceIdLoginForm: (state, action) => {
      state.faceIdLoginForm = { ...state.faceIdLoginForm, ...action.payload };
    },

    // Confirm Account
    setCode: (state, action) => {
      state.code = action.payload;
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
  setCode,
} = authSlice.actions;
export default authSlice.reducer;
