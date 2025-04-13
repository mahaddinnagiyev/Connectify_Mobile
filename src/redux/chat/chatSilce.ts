import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMenuVisible: false,
  inputHeight: 35,
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
  },
});

export const { toggleMenu, setInputHeight } = chatSlice.actions;
export default chatSlice.reducer;
