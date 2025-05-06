import { MessagesDTO } from "@services/messenger/messenger.dto";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
    addMessage: (state, action: PayloadAction<MessagesDTO>) => {
      if (!state.messages.find((m) => m.id === action.payload.id)) {
        state.messages.push(action.payload);
      }
    },
  },
});

export const { setInputHeight, setShowBackToBottom, setMessages, addMessage } =
  chatSlice.actions;
export default chatSlice.reducer;
