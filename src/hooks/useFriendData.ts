import axios from "axios";
import { useState } from "react";
import { Response } from "./useUpdateProfile";

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  acceptFriendshipRequest,
  rejectFriendshipRequest,
  setBlockerList,
  setBlockList,
  setMyFriends,
  setReceivedFriendshipRequests,
  setSentFriendshipRequests,
} from "@redux/friend/myFriendsSlice";
import {
  setErrorMessage,
  setSuccessMessage,
} from "@redux/messages/messageSlice";
import { RootState } from "@redux/store";

// Enums
import { FriendshipAction } from "@enums/friendship.enum";

// Services
import {
  FriendshipRecieveRequestDTO,
  FriendshipSentRequestDTO,
  UserFriendsDTO,
} from "@services/friends/friends.dto";
import { BlockAction, BlockListDTO } from "@services/friends/blockList.dto";

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

interface BlockerListResponse {
  success: boolean;
  blockerList: BlockListDTO[];
  response: { success: boolean; error?: string; message?: string };
}

export function useFriendData() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isRemovingOrAdding, setIsRemovingOrAdding] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isBlockerListLoading, setIsBlockerListLoading] = useState(false);

  const { token } = useSelector((state: RootState) => state.auth);
  const { userData } = useSelector((state: RootState) => state.myProfile);

  const fetchAllMyFriends = async () => {
    try {
      setIsLoading(true);

      const { data } = await axios.get<MyFriendsReponse>(
        `${process.env.SERVER_URL}/friendship/my-friends`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
            Authorization: `Bearer ${token}`,
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
      status === FriendshipAction.accept
        ? setIsAccepting(true)
        : setIsRejecting(true);

      const { data } = await axios.patch<Response>(
        `${process.env.SERVER_URL}/friendship/request?status=${status}&request=${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
      setIsAccepting(false);
      setIsRejecting(false);
    }
  };

  const sentFriendshipRequest = async (id: string) => {
    try {
      setIsRemovingOrAdding(true);

      const { data } = await axios.post<Response>(
        `${process.env.SERVER_URL}/friendship/request/create?requestee=${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        await fetchAllFriendReuqest();
        dispatch(setSuccessMessage(data.message ?? "Friendship request sent"));
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
      setIsRemovingOrAdding(false);
    }
  };

  const removeFriend = async (id: string) => {
    try {
      setIsRemovingOrAdding(true);

      const { data } = await axios.delete<Response>(
        `${process.env.SERVER_URL}/friendship/request/remove?request=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        await fetchAllMyFriends();
        dispatch(setSuccessMessage(data.message ?? "Friend removed"));
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
      setIsRemovingOrAdding(false);
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
            Authorization: `Bearer ${token}`,
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

  const fetchBlockerList = async () => {
    try {
      setIsBlockerListLoading(true);

      const { data } = await axios.get<BlockerListResponse>(
        `${process.env.SERVER_URL}/user/block-list?by=${userData.user.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        dispatch(setBlockerList(data.blockerList!));
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
      setIsBlockerListLoading(false);
    }
  };

  const blockAndUnblockUser = async (id: string, block_action: BlockAction) => {
    try {
      setIsBlocking(true);

      const { data } = await axios.post<Response>(
        `${process.env.SERVER_URL}/user/block-list?id=${id}&action=${block_action}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        if (block_action === BlockAction.block) {
          await Promise.all([
            fetchAllFriendReuqest(),
            fetchBlockList(),
            fetchAllMyFriends(),
          ]);
          dispatch(setSuccessMessage(data.message ?? "User blocked"));
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
      setIsBlocking(false);
    }
  };

  return {
    isLoading,
    isAccepting,
    isRejecting,
    fetchAllMyFriends,
    fetchAllFriendReuqest,
    acceptAndRejectFrienship,
    sentFriendshipRequest,
    removeFriend,
    isRemovingOrAdding,

    // Block List
    fetchBlockList,
    fetchBlockerList,
    blockAndUnblockUser,
    isBlocking,
  };
}
