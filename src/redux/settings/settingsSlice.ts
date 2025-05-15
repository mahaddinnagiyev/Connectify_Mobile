import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  isPrivachSettingsChagned: boolean;
  soundPreferences: {
    receiveSound: boolean;
    sentSound: boolean;
  };
}

const initialState: SettingsState = {
  isPrivachSettingsChagned: false,
  soundPreferences: {
    receiveSound: true,
    sentSound: true,
  },
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setIsPrivachSettingsChagned: (state, action: PayloadAction<boolean>) => {
      state.isPrivachSettingsChagned = action.payload;
    },
    setChangeSoundPreferences: (
      state,
      action: PayloadAction<{ receiveSound: boolean; sentSound: boolean }>
    ) => {
      state.soundPreferences = action.payload;
    },
  },
});

export const { setIsPrivachSettingsChagned, setChangeSoundPreferences } = settingsSlice.actions;
export default settingsSlice.reducer;
