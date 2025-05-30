import axios, { AxiosError } from "axios";
import { useState, useEffect, useRef } from "react";
import { Response } from "./useUpdateProfile";

// Redux
import {
  setErrorMessage,
  setSuccessMessage,
} from "@redux/messages/messageSlice";
import { useDispatch, useSelector } from "react-redux";
import { setOtherUserData } from "@redux/users/usersSlice";
import { setIsAuthenticated } from "@redux/auth/authSlice";
import { updateUserFaceID } from "@redux/profile/myProfileSlice";
import { RootState } from "@redux/store";

// Services
import { User } from "@services/user/dto/user.dto";
import { UserResponse } from "@services/user/user.service";
import { Account } from "@services/account/dto/account.dto";
import { PrivacySettings } from "@services/account/dto/privacy.dto";

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  status?: number;
}

interface ErrorPayload {
  message?: string | string[];
  error?: string;
  status?: number;
  response?: { message?: string; error?: string; status?: number };
}

interface SearchUserResponse {
  success: boolean;
  allUsers: {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
    profile_picture: string;
  }[];
  response: { success: boolean; error?: string; message?: string };
  error?: string;
  message?: string;
}

interface GetMyDataResponse {
  success: boolean;
  user: User;
  account: Account;
  privacy_settings: PrivacySettings;
  status?: number;
  response?: ApiResponse;
  message?: string;
  error?: string;
}

export function useUserData() {
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const [userResponse, setUserResponse] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isOtherUserDataLoading, setIsOtherUserDataLoading] =
    useState<boolean>(false);
  const [isFaceIdLoading, setIsFaceIdLoading] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get<GetMyDataResponse>(
        `${process.env.SERVER_URL}/user/by`,
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
          signal: abortControllerRef.current?.signal,
        }
      );

      if (
        (data.status && data.status === 404) ||
        (data.response?.status && data.response.status === 404)
      )
        return dispatch(setIsAuthenticated(false));

      setUserResponse(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.code === "ERR_CANCELED") return;
        const axiosErr = err as AxiosError<ErrorPayload>;
        const payload = axiosErr.response?.data;
        let msg: string = "";

        if (
          (axiosErr.status && axiosErr.status === 404) ||
          (axiosErr.response?.status && axiosErr.response.status === 404)
        )
          return dispatch(setIsAuthenticated(false));

        if (payload) {
          if (payload.status && payload.status === 404) {
            dispatch(setIsAuthenticated(false));
          } else if (Array.isArray(payload.message)) {
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
            Authorization: `Bearer ${token}`,
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

  // Get User By Id
  const getUserByID = async (id: string) => {
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
        `${process.env.SERVER_URL}/user/by?id=${id}`,
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(setErrorMessage(error.message));
      }
      dispatch(setErrorMessage((error as Error).message));
    } finally {
      setIsOtherUserDataLoading(false);
    }
  };

  // SearchUser
  const searchUser = async (u: string) => {
    try {
      setIsSearching(true);

      const { data } = await axios.get<SearchUserResponse>(
        `${process.env.SERVER_URL}/user/search?u=${u}`,
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        return data.allUsers;
      } else {
        return [];
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(setErrorMessage(error.message));
      }
      dispatch(setErrorMessage((error as Error).message));
    } finally {
      setIsSearching(false);
    }
  };

  // Face ID
  const registerUserFaceID = async (face_descriptor: number[]) => {
    try {
      setIsFaceIdLoading(true);
      const { data } = await axios.patch<Response>(
        `${process.env.SERVER_URL}/auth/register/faceid`,
        { face_descriptor },
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (data.success) {
        dispatch(updateUserFaceID(face_descriptor));
        dispatch(setSuccessMessage(data.message ?? "Face ID updated"));
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
      setIsFaceIdLoading(false);
    }
  };

  return {
    userResponse,
    isLoading,
    refetch: fetchUser,

    // Get User By Username
    getUserByUsername,
    getUserByID,
    refetchOtherUserData: getUserByUsername,
    isOtherUserDataLoading,
    searchUser,
    isSearching,

    // Face ID
    isFaceIdLoading,
    registerUserFaceID,
  };
}
