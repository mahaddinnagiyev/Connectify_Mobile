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
}

const initialState: MessengerState = {
  chats: [],
};

export const messengerSlice = createSlice({
  name: "messenger",
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<MessengerState["chats"]>) => {
      state.chats = action.payload;
    },
  },
});

export const { setChats } = messengerSlice.actions;
export default messengerSlice.reducer;
