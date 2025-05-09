import { Gender } from "@enums/gender.enum";
import { SignupDTO } from "@services/auth/dto/auth.dto";
import { AuthPage, AuthType } from "@enums/auth.enum";
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  activeTab: AuthPage;

  token: string | null;

  // Login
  authType: AuthType;
  isFaceIDModalOpen: boolean;
  loginForm: { username_or_email: string; password: string };
  faceIdLoginForm: {
    username_or_email_face_id: string;
    face_descriptor: number[];
  };

  // Signup
  signupForm: SignupDTO;

  // Confirm Account
  code: string[];
}

const initialState: AuthState = {
  isAuthenticated: false,
  activeTab: AuthPage.LOGIN,

  token: null,

  // Login
  authType: AuthType.PASSWORD,
  isFaceIDModalOpen: false,
  loginForm: { username_or_email: "", password: "" },
  faceIdLoginForm: { username_or_email_face_id: "", face_descriptor: [] },

  signupForm: {
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    gender: "" as Gender,
    password: "",
    confirm: "",
  },

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

    // Signup
    setSignupForm: (state, action) => {
      state.signupForm = { ...state.signupForm, ...action.payload };
    },

    // Confirm Account
    setCode: (state, action) => {
      state.code = action.payload;
    },

    // Token
    setToken: (state, action) => {
      state.token = action.payload;
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
  setSignupForm,
  setCode,
  setToken,
} = authSlice.actions;
export default authSlice.reducer;
