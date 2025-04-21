import { createSlice } from "@reduxjs/toolkit";
import {
  FriendshipRecieveRequestDTO,
  FriendshipSentRequestDTO,
  UserFriendsDTO,
} from "@services/friends/friends.dto";

interface MyFriendsState {
  friends: UserFriendsDTO[];
  sentFriendshipRequests: FriendshipSentRequestDTO[];
  receivedFriendshipRequests: FriendshipRecieveRequestDTO[];
}

const initialState: MyFriendsState = {
  friends: [],
  sentFriendshipRequests: [],
  receivedFriendshipRequests: [],
};

export const myFriendsSlice = createSlice({
  name: "myFriends",
  initialState,
  reducers: {
    setMyFriends: (state, action) => {
      state.friends = action.payload;
    },
    setSentFriendshipRequests: (state, action) => {
      state.sentFriendshipRequests = action.payload;
    },
    setReceivedFriendshipRequests: (state, action) => {
      state.receivedFriendshipRequests = action.payload;
    },
  },
});

export const {
  setMyFriends,
  setSentFriendshipRequests,
  setReceivedFriendshipRequests,
} = myFriendsSlice.actions;
export default myFriendsSlice.reducer;
