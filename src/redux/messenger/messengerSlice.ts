import { Account } from "@services/account/dto/account.dto";
import { PrivacySettings } from "@services/account/dto/privacy.dto";
import { ChatRoomsDTO } from "@services/messenger/messenger.dto";
import { User } from "@services/user/dto/user.dto";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MessengerState {
  chats: (ChatRoomsDTO & {
    otherUser: User;
    otherUserAccount: Account;
    otherUserPrivacySettings: PrivacySettings;
  })[];
  filteredChats: (ChatRoomsDTO & {
    otherUser: User;
    otherUserAccount: Account;
    otherUserPrivacySettings: PrivacySettings;
  })[];
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
  },
});

export const { setChats, filterChats } = messengerSlice.actions;
export default messengerSlice.reducer;
