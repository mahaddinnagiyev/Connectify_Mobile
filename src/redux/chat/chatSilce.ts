import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMenuVisible: false,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    toggleMenu: (state) => {
      state.isMenuVisible = !state.isMenuVisible;
    },
  },
});

export const { toggleMenu } = chatSlice.actions;
export default chatSlice.reducer;
