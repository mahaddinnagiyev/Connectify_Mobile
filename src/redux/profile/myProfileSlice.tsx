import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MyProfileState {
  activeIndex: number;
}

const initialState: MyProfileState = {
  activeIndex: 0,
};

export const myProfileSlice = createSlice({
  name: "myProfile",
  initialState,
  reducers: {
    setActiveIndex: (state, action: PayloadAction<number>) => {
      state.activeIndex = action.payload;
    },
  },
});

export const { setActiveIndex } = myProfileSlice.actions;
export default myProfileSlice.reducer;
