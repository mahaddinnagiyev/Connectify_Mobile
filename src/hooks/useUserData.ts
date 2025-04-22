import { useState, useEffect, useRef } from "react";
import axios, { AxiosError } from "axios";
import { UserResponse } from "@services/user/user.service";
import { getTokenFromSession } from "@services/auth/token.service";
import { setErrorMessage } from "@redux/messages/messageSlice";
import { useDispatch } from "react-redux";
import { setOtherUserData } from "../redux/users/usersSlice";
import { User } from "../services/user/dto/user.dto";
import { Account } from "../services/account/dto/account.dto";
import { PrivacySettings } from "../services/account/dto/privacy.dto";

interface ErrorPayload {
  message?: string | string[];
  error?: string;
}

export function useUserData() {
  const dispatch = useDispatch();
  const [userResponse, setUserResponse] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOtherUserDataLoading, setIsOtherUserDataLoading] =
    useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get<UserResponse>(
        `${process.env.SERVER_URL}/user/by`,
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${await getTokenFromSession()}`,
          },
          withCredentials: true,
          signal: abortControllerRef.current?.signal,
        }
      );
      setUserResponse(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.code === "ERR_CANCELED") return;
        const axiosErr = err as AxiosError<ErrorPayload>;
        const payload = axiosErr.response?.data;
        let msg: string;

        if (payload) {
          if (Array.isArray(payload.message)) {
            msg = payload.message[0];
          } else if (typeof payload.message === "string") {
            msg = payload.message;
          } else if (payload.error) {
            msg = payload.error;
          } else {
            msg = axiosErr.message;
          }
        } else {
          msg = axiosErr.message;
        }

        dispatch(setErrorMessage(msg));
      } else if (err instanceof Error) {
        dispatch(setErrorMessage(err.message));
      } else {
        dispatch(setErrorMessage("Something went wrong"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    abortControllerRef.current = new AbortController();

    fetchUser();
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // Get User By Username
  const getUserByUsername = async (username: string) => {
    dispatch(
      setOtherUserData({
        otherUserData: {
          user: {} as User,
          account: {} as Account,
          privacySettings: {} as PrivacySettings,
        },
      })
    );
    try {
      setIsOtherUserDataLoading(true);
      const { data } = await axios.get<UserResponse>(
        `${process.env.SERVER_URL}/user/by?username=${username}`,
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${await getTokenFromSession()}`,
          },
          withCredentials: true,
        }
      );
      if (data.success) {
        dispatch(
          setOtherUserData({
            otherUserData: {
              user: data.user || null,
              account: data.account || null,
              privacySettings: data.privacy_settings || null,
            },
          })
        );
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
      setIsOtherUserDataLoading(false);
    }
  };

  return {
    userResponse,
    isLoading,
    refetch: fetchUser,

    // Get User By Username
    getUserByUsername,
    refetchOtherUserData: getUserByUsername,
    isOtherUserDataLoading,
  };
}
