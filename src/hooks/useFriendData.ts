import { useState } from "react";
import axios from "axios";
import { Response } from "./useUpdateProfile";
import { getTokenFromSession } from "@services/auth/token.service";
import { useDispatch } from "react-redux";
import {
  acceptFriendshipRequest,
  rejectFriendshipRequest,
  setBlockList,
  setMyFriends,
  setReceivedFriendshipRequests,
  setSentFriendshipRequests,
} from "@redux/friend/myFriendsSlice";
import {
  FriendshipRecieveRequestDTO,
  FriendshipSentRequestDTO,
  UserFriendsDTO,
} from "@services/friends/friends.dto";
import {
  setErrorMessage,
  setSuccessMessage,
} from "@redux/messages/messageSlice";
import { BlockAction, BlockListDTO } from "@services/friends/blockList.dto";
import { FriendshipAction } from "@enums/friendship.enum";

interface MyFriendsReponse {
  success: boolean;
  friends?: UserFriendsDTO[];
  response: { success: boolean; error?: string; message?: string };
}

interface FriendshipRequestsResponse {
  success: boolean;
  sentRequests: FriendshipSentRequestDTO[];
  receivedRequests: FriendshipRecieveRequestDTO[];
  message?: string;
  error?: string;
  response: { success: boolean; error?: string; message?: string };
}

interface BlockListResponse {
  success: boolean;
  blockList: BlockListDTO[];
  response: { success: boolean; error?: string; message?: string };
}

async function getToken() {
  const token = await getTokenFromSession();
  return token ?? null;
}

export function useFriendData() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllMyFriends = async () => {
    try {
      setIsLoading(true);

      const { data } = await axios.get<MyFriendsReponse>(
        `${process.env.SERVER_URL}/friendship/my-friends`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getToken()}`,
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        dispatch(setMyFriends(data.friends!));
      } else {
        dispatch(
          setErrorMessage(
            data.response?.message ??
              data.response?.error ??
              "Something went wrong"
          )
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(setErrorMessage(error.message));
      }
      dispatch(setErrorMessage((error as Error).message));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllFriendReuqest = async () => {
    try {
      setIsLoading(true);

      const { data } = await axios.get<FriendshipRequestsResponse>(
        `${process.env.SERVER_URL}/friendship/requests`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getToken()}`,
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        dispatch(setSentFriendshipRequests(data.sentRequests!));
        dispatch(setReceivedFriendshipRequests(data.receivedRequests!));
      } else {
        dispatch(
          setErrorMessage(
            data.response?.message ??
              data.response?.error ??
              data.message ??
              data.error ??
              "Something went wrong"
          )
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(setErrorMessage(error.message));
      }
      dispatch(setErrorMessage((error as Error).message));
    } finally {
      setIsLoading(false);
    }
  };

  const acceptAndRejectFrienship = async (
    status: FriendshipAction,
    id: string
  ) => {
    try {
      setIsLoading(true);

      const { data } = await axios.patch<Response>(
        `${process.env.SERVER_URL}/friendship/request?status=${status}&request=${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getToken()}`,
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        if (status === FriendshipAction.accept) {
          dispatch(setSuccessMessage(data.message ?? "Friendship accepted"));
          dispatch(acceptFriendshipRequest(id));
          await fetchAllMyFriends();
        } else if (status === FriendshipAction.reject) {
          dispatch(setSuccessMessage(data.message ?? "Friendship rejected"));
          dispatch(rejectFriendshipRequest(id));
        }
      } else {
        dispatch(
          setErrorMessage(
            data.response?.message ??
              data.response?.error ??
              data.message ??
              data.error ??
              "Something went wrong"
          )
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(setErrorMessage(error.message));
      }
      dispatch(setErrorMessage((error as Error).message));
    } finally {
      setIsLoading(false);
    }
  };

  // Block List
  const fetchBlockList = async () => {
    try {
      setIsLoading(true);

      const { data } = await axios.get<BlockListResponse>(
        `${process.env.SERVER_URL}/user/block-list`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getToken()}`,
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        dispatch(setBlockList(data.blockList!));
      } else {
        dispatch(
          setErrorMessage(
            data.response?.message ??
              data.response?.error ??
              "Something went wrong"
          )
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(setErrorMessage(error.message));
      }
      dispatch(setErrorMessage((error as Error).message));
    } finally {
      setIsLoading(false);
    }
  };

  const blockAndUnblockUser = async (id: string, block_action: BlockAction) => {
    try {
      setIsLoading(true);

      const { data } = await axios.post<Response>(
        `${process.env.SERVER_URL}/user/block-list?id=${id}&action=${block_action}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getToken()}`,
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        if (block_action === BlockAction.block) {
          dispatch(setSuccessMessage(data.message ?? "User blocked"));
          await Promise.all([
            fetchAllFriendReuqest(),
            fetchBlockList(),
            fetchAllMyFriends(),
          ]);
        } else if (block_action === BlockAction.unblock) {
          dispatch(setSuccessMessage(data.message ?? "User unblocked"));
          await fetchBlockList();
        }
      } else {
        dispatch(
          setErrorMessage(
            data.response?.message ??
              data.response?.error ??
              data.message ??
              data.error ??
              "Something went wrong"
          )
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(setErrorMessage(error.message));
      }
      dispatch(setErrorMessage((error as Error).message));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    fetchAllMyFriends,
    fetchAllFriendReuqest,
    acceptAndRejectFrienship,

    // Block List
    fetchBlockList,
    blockAndUnblockUser,
  };
}
function unblockUser(id: string): any {
  throw new Error("Function not implemented.");
}
