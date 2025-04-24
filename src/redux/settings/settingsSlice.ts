import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  isPrivachSettingsChagned: boolean;
}

const initialState: SettingsState = {
  isPrivachSettingsChagned: false,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setIsPrivachSettingsChagned: (state, action: PayloadAction<boolean>) => {
      state.isPrivachSettingsChagned = action.payload;
    },
  },
});

export const { setIsPrivachSettingsChagned } = settingsSlice.actions;
export default settingsSlice.reducer;
