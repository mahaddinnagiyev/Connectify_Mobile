import { BlockListDTO } from "@/src/services/friends/blockList.dto";
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

  // Block List
  blockList: BlockListDTO[];
}

const initialState: MyFriendsState = {
  friends: [],
  sentFriendshipRequests: [],
  receivedFriendshipRequests: [],
  blockList: [],
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
    acceptFriendshipRequest: (state, action) => {
      state.sentFriendshipRequests = state.sentFriendshipRequests.filter(
        (request) => request.id !== action.payload
      );
      state.receivedFriendshipRequests =
        state.receivedFriendshipRequests.filter(
          (request) => request.id !== action.payload
        );
    },
    rejectFriendshipRequest: (state, action) => {
      state.sentFriendshipRequests = state.sentFriendshipRequests.filter(
        (request) => request.id !== action.payload
      );
      state.receivedFriendshipRequests =
        state.receivedFriendshipRequests.filter(
          (request) => request.id !== action.payload
        );
    },

    // Block List
    setBlockList: (state, action) => {
      state.blockList = action.payload;
    },
    removeBlockUser: (state, action) => {
      state.blockList = state.blockList.filter(
        (block) => block.id !== action.payload
      );
    },
  },
});

export const {
  setMyFriends,
  setSentFriendshipRequests,
  setReceivedFriendshipRequests,
  acceptFriendshipRequest,
  rejectFriendshipRequest,

  // Block List
  setBlockList,
} = myFriendsSlice.actions;
export default myFriendsSlice.reducer;
