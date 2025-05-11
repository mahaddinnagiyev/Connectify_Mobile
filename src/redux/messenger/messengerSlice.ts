import { Chat, MessagesDTO } from "@services/messenger/messenger.dto";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MessengerState {
  chats: Chat[];
  filteredChats: Chat[];
}

const initialState: MessengerState = {
  chats: [],
  filteredChats: [],
};

export const messengerSlice = createSlice({
  name: "messenger",
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<MessengerState["chats"]>) => {
      state.chats = action.payload;
      state.filteredChats = action.payload;
    },
    filterChats: (state, action: PayloadAction<string>) => {
      const q = action.payload.toLowerCase().trim();
      if (!q) {
        state.filteredChats = state.chats;
      } else {
        state.filteredChats = state.chats.filter((c) =>
          (c.name ?? `${c.otherUser.first_name} ${c.otherUser.last_name}`)
            .toLowerCase()
            .includes(q)
        );
      }
    },
    bumpChat: (
      state,
      action: PayloadAction<{
        chatId: string;
        message: MessagesDTO;
        user_id: string;
      }>
    ) => {
      const { chatId, message, user_id } = action.payload;

      if (message.sender_id === user_id) return;

      const idx = state.chats.findIndex((c) => c.id === chatId);
      if (idx !== -1) {
        const chat = {
          ...state.chats[idx],
          lastMessage: message,
          unreadCount: (state.chats[idx].unreadCount || 0) + 1,
        };
        state.chats.splice(idx, 1);
        state.chats.unshift(chat);
      }

      const fidx = state.filteredChats.findIndex((c) => c.id === chatId);
      if (fidx !== -1) {
        const fchat = {
          ...state.filteredChats[fidx],
          lastMessage: message,
          unreadCount: (state.filteredChats[fidx].unreadCount || 0) + 1,
        };
        state.filteredChats.splice(fidx, 1);
        state.filteredChats.unshift(fchat);
      }
    },
    updateLastMessage: (state, action: PayloadAction<MessagesDTO>) => {
      const idx = state.chats.findIndex((c) => c.id === action.payload.room_id);
      if (idx !== -1) {
        state.chats[idx].lastMessage = action.payload;
      }

      const fidx = state.filteredChats.findIndex(
        (c) => c.id === action.payload.room_id
      );

      if (fidx !== -1) {
        state.filteredChats[fidx].lastMessage = action.payload;
      }
    },
    updateUnreadCount: (
      state,
      action: PayloadAction<{ id: string; count: number }>
    ) => {
      state.chats = state.chats.map((c) =>
        c.id === action.payload.id
          ? { ...c, unreadCount: action.payload.count }
          : c
      );
      state.filteredChats = state.filteredChats.map((c) =>
        c.id === action.payload.id
          ? { ...c, unreadCount: action.payload.count }
          : c
      );
    },

    addChat: (state, action: PayloadAction<Chat>) => {
      if (state.chats.find((c) => c.id === action.payload.id)) return;
      state.chats.push(action.payload);
      state.filteredChats.push(action.payload);
    },
    changeRoomName: (
      state,
      action: PayloadAction<{ id: string; name: string | null }>
    ) => {
      const { id, name } = action.payload;
      state.chats = state.chats.map((c) =>
        c.id === id ? { ...c, name: name ?? null } : c
      );
      state.filteredChats = state.filteredChats.map((c) =>
        c.id === id ? { ...c, name: name ?? null } : c
      );
    },
  },
});

export const {
  setChats,
  filterChats,
  bumpChat,
  updateLastMessage,
  updateUnreadCount,
  addChat,
  changeRoomName,
} = messengerSlice.actions;
export default messengerSlice.reducer;
