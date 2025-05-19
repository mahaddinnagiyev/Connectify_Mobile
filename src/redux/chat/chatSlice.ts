import { MessagesDTO, MessageStatus } from "@services/messenger/messenger.dto";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  inputHeight: number;
  showBackToBottom: boolean;
  messages: MessagesDTO[];
  downloadMessages: MessagesDTO[];
  unsendingIds: string[];

  isSelectMenuVisible: boolean;
  selectedMessages: MessagesDTO[];
}

const initialState: ChatState = {
  inputHeight: 35,
  showBackToBottom: false,
  messages: [],
  downloadMessages: [],
  unsendingIds: [],

  isSelectMenuVisible: false,
  selectedMessages: [],
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
        state.messages.unshift(action.payload);
      }
    },

    removeMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter((m) => m.id !== action.payload);
    },
    setMessagesRead: (state, action: PayloadAction<string[]>) => {
      const idsToMark = action.payload;
      state.messages.forEach((m) => {
        if (idsToMark.includes(m.id)) {
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

    markUnsending: (state, action: PayloadAction<string>) => {
      if (!state.unsendingIds.includes(action.payload)) {
        state.unsendingIds.push(action.payload);
      }
    },
    clearUnsending: (state, action: PayloadAction<string>) => {
      state.unsendingIds = state.unsendingIds.filter(
        (id) => id !== action.payload
      );
    },

    setSelectedMenuVisible: (state, action: PayloadAction<boolean>) => {
      state.isSelectMenuVisible = action.payload;
    },
    addSelectedMessages: (state, action: PayloadAction<MessagesDTO>) => {
      if (state.selectedMessages.includes(action.payload)) return;
      state.selectedMessages.push(action.payload);
    },
    removeSelectedMessages: (state, action: PayloadAction<MessagesDTO>) => {
      state.selectedMessages = state.selectedMessages.filter(
        (m) => m.id !== action.payload.id
      );
    },
    clearSelectedMessages: (state) => {
      state.selectedMessages = [];
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

  markUnsending,
  clearUnsending,

  // Selected Messages
  setSelectedMenuVisible,
  addSelectedMessages,
  removeSelectedMessages,
  clearSelectedMessages,
} = chatSlice.actions;
export default chatSlice.reducer;
