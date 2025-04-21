import { useState, useEffect, useRef } from "react";
import axios, { AxiosError } from "axios";
import { Response } from "./useUpdateProfile";
import { getTokenFromSession } from "@services/auth/token.service";
import { useDispatch } from "react-redux";
import { setMyFriends } from "../redux/friend/myFriendsSlice";
import { UserFriendsDTO } from "../services/friends/friends.dto";
import { setErrorMessage } from "../redux/messages/messageSlice";

interface MyFriendsReponse {
  success: boolean;
  friends?: UserFriendsDTO[];
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

  return { isLoading, fetchAllMyFriends };
}
