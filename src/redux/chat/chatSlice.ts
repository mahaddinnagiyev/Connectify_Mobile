import { MessagesDTO } from "@services/messenger/messenger.dto";
import { createSlice } from "@reduxjs/toolkit";

interface ChatState {
  isMenuVisible: boolean;
  inputHeight: number;
  showBackToBottom: boolean;
  messages: MessagesDTO[];
  replyMessage: MessagesDTO | null;
}

const initialState: ChatState = {
  isMenuVisible: false,
  inputHeight: 35,
  showBackToBottom: false,
  messages: [],
  replyMessage: null,
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
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setReplyMessage: (state, action) => {
      state.replyMessage = action.payload;
    },
  },
});

export const {
  toggleMenu,
  setInputHeight,
  setShowBackToBottom,
  setMessages,
  setReplyMessage,
} = chatSlice.actions;
export default chatSlice.reducer;
