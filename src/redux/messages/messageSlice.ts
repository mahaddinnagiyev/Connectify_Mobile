import { createSlice } from "@reduxjs/toolkit";

interface MessagesState {
  errorMessage: string | null;
  successMessage: string | null;
  infoMessage: string | null;
}

const initialState: MessagesState = {
  errorMessage: null,
  successMessage: null,
  infoMessage: null,
};

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
    setInfoMessage: (state, action) => {
      state.infoMessage = action.payload;
    },
    clearErrorMessage: (state) => {
      state.errorMessage = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearInfoMessage: (state) => {
      state.infoMessage = null;
    },
  },
});

export const {
  setErrorMessage,
  setSuccessMessage,
  setInfoMessage,
  clearErrorMessage,
  clearSuccessMessage,
  clearInfoMessage,
} = messagesSlice.actions;
export default messagesSlice.reducer;
