import {
  Chat,
  MessagesDTO,
  MessageStatus,
} from "@services/messenger/messenger.dto";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessengerFilter } from "@enums/messenger.enum";

interface MessengerState {
  menuFilter: MessengerFilter;
  chats: Chat[];
  filteredChats: Chat[];
}

const initialState: MessengerState = {
  menuFilter: MessengerFilter.LATEST,
  chats: [],
  filteredChats: [],
};

export const messengerSlice = createSlice({
  name: "messenger",
  initialState,
  reducers: {
    // Menu Filter
    setMenuFilter: (state, action: PayloadAction<MessengerFilter>) => {
      state.menuFilter = action.payload;
    },

    // Chats
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
      const { chatId, message } = action.payload;

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
    updateLastMessageStatus: (
      state,
      action: PayloadAction<{ roomId: string; ids: string[] }>
    ) => {
      const { roomId, ids } = action.payload;
      const idx = state.chats.findIndex((c) => c.id === roomId);
      if (
        idx !== -1 &&
        state.chats[idx].lastMessage &&
        ids.includes(state.chats[idx].lastMessage.id)
      ) {
        state.chats[idx].lastMessage.status = MessageStatus.READ;
      }

      const fidx = state.filteredChats.findIndex((c) => c.id === roomId);
      if (
        fidx !== -1 &&
        state.filteredChats[fidx].lastMessage &&
        ids.includes(state.filteredChats[fidx].lastMessage.id)
      ) {
        state.filteredChats[fidx].lastMessage.status = MessageStatus.READ;
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
  setMenuFilter,
  setChats,
  filterChats,
  bumpChat,
  updateLastMessage,
  updateLastMessageStatus,
  updateUnreadCount,
  addChat,
  changeRoomName,
} = messengerSlice.actions;
export default messengerSlice.reducer;
