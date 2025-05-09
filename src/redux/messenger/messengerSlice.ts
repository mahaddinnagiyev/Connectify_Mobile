import { Chat } from "@services/messenger/messenger.dto";
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
    addChat: (state, action: PayloadAction<Chat>) => {
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

export const { setChats, filterChats, addChat, changeRoomName } =
  messengerSlice.actions;
export default messengerSlice.reducer;
