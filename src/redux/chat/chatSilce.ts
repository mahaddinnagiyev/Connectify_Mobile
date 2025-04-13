import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMenuVisible: false,
  inputHeight: 35,
  showBackToBottom: false,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    toggleMenu: (state) => {
      state.isMenuVisible = !state.isMenuVisible;
    },
    setInputHeight: (state, action) => {
      state.inputHeight = action.payload;
    },
    setShowBackToBottom: (state, action) => {
      state.showBackToBottom = action.payload;
    },
  },
});

export const { toggleMenu, setInputHeight, setShowBackToBottom } =
  chatSlice.actions;
export default chatSlice.reducer;
