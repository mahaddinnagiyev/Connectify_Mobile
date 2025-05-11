import { MessagesDTO, MessageStatus } from "@services/messenger/messenger.dto";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  inputHeight: number;
  showBackToBottom: boolean;
  messages: MessagesDTO[];
  downloadMessages: MessagesDTO[];
}

const initialState: ChatState = {
  inputHeight: 35,
  showBackToBottom: false,
  messages: [],
  downloadMessages: [],
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
    addMessage: (state, action: PayloadAction<MessagesDTO>) => {
      if (!state.messages.find((m) => m.id === action.payload.id)) {
        state.messages.push(action.payload);
      }
    },
    removeMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter((m) => m.id !== action.payload);
    },
    setMessagesRead: (state) => {
      state.messages.forEach((m) => {
        if (m.status !== MessageStatus.READ) {
          m.status = MessageStatus.READ;
        }
      });
    },

    // Download Messages
    addDownloadMessage: (state, action: PayloadAction<MessagesDTO>) => {
      if (state.downloadMessages.find((m) => m.id === action.payload.id))
        return;

      state.downloadMessages.push(action.payload);
    },
    removeDownloadMessage: (state, action: PayloadAction<string>) => {
      state.downloadMessages = state.downloadMessages.filter(
        (m) => m.id !== action.payload
      );
    },
    clearDownloadMessages: (state) => {
      state.downloadMessages = [];
    },
  },
});

export const {
  setInputHeight,
  setShowBackToBottom,
  setMessages,
  addMessage,
  removeMessage,
  setMessagesRead,

  // Download Messages
  addDownloadMessage,
  removeDownloadMessage,
  clearDownloadMessages,
} = chatSlice.actions;
export default chatSlice.reducer;
