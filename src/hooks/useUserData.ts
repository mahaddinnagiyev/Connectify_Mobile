import { useState, useEffect, useRef } from "react";
import axios, { AxiosError } from "axios";
import { UserResponse } from "@services/user/user.service";
import { getTokenFromSession } from "../services/auth/token.service";

interface ErrorPayload {
  message?: string | string[];
  error?: string;
}

export function useUserData() {
  const [userResponse, setUserResponse] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

        setErrorMessage(msg);
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Something went wrong");
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

  return { userResponse, isLoading, errorMessage, refetch: fetchUser };
}
