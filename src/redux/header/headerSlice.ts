import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isModalVisible: false,
};

export const headerSlice = createSlice({
  name: "header",
  initialState,
  reducers: {
    toggleModal: (state) => {
      state.isModalVisible = !state.isModalVisible;
    },
  },
});

export const { toggleModal } = headerSlice.actions;
export default headerSlice.reducer;
