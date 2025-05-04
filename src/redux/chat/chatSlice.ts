import { MessagesDTO } from "@services/messenger/messenger.dto";
import { createSlice } from "@reduxjs/toolkit";

interface ChatState {
  inputHeight: number;
  showBackToBottom: boolean;
  messages: MessagesDTO[];
}

const initialState: ChatState = {
  inputHeight: 35,
  showBackToBottom: false,
  messages: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setInputHeight: (state, action) => {
      state.inputHeight = action.payload;
    },
    setShowBackToBottom: (state, action) => {
      state.showBackToBottom = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
});

export const {
  setInputHeight,
  setShowBackToBottom,
  setMessages,
} = chatSlice.actions;
export default chatSlice.reducer;
