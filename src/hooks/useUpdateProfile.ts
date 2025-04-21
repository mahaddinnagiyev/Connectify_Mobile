import axios from "axios";
import { useDispatch } from "react-redux";
import {
  updateAccountFields,
  updateUserFields,
  updateSocialLink as updateSocialLinkAction,
  addSocialLink as addSocialLinkAction,
  removeSocialLink as removeSocialLinkAction,
} from "@redux/profile/myProfileSlice";
import {
  setErrorMessage,
  setSuccessMessage,
} from "@redux/messages/messageSlice";
import { getTokenFromSession } from "@services/auth/token.service";
import { Gender } from "@enums/gender.enum";
import { useState } from "react";

export interface UpdateResponse {
  success: boolean;
  message?: string;
  error?: string;
  response?: {
    success: boolean;
    message?: string;
    error?: string;
  };
}

export interface AddResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: { id: string; name: string; link: string };
  response?: {
    success: boolean;
    message?: string;
    error?: string;
  };
}

export interface UpdatePersonalInfoPayload {
  first_name: string;
  last_name: string;
  username: string;
  gender: Gender;
}

export interface UpdateProfileInfoPayload {
  bio: string;
  location: string;
}

export interface UpdateSocialLinkPayload {
  id: string;
  name: string;
  link: string;
}

export interface AddSocialLink {
  name: string;
  link: string;
}

export function useUpdateProfile() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = async (payload: UpdatePersonalInfoPayload) => {
    try {
      setIsLoading(true);
      const token = await getTokenFromSession();
      const { data } = await axios.patch<UpdateResponse>(
        `${process.env.SERVER_URL}/user/my-profile`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        dispatch(updateUserFields(payload));
        dispatch(setSuccessMessage(data.message ?? "Profile updated"));
      } else {
        const msg =
          data.response?.message ??
          data.response?.error ??
          data.message ??
          data.error ??
          "Something went wrong";
        dispatch(setErrorMessage(msg));
      }
    } catch (err) {
      dispatch(
        setErrorMessage(
          axios.isAxiosError(err) ? err.message : (err as Error).message
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateAccount = async (payload: UpdateProfileInfoPayload) => {
    try {
      setIsLoading(true);
      const token = await getTokenFromSession();
      const { data } = await axios.patch<UpdateResponse>(
        `${process.env.SERVER_URL}/account/my-info`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        dispatch(updateAccountFields(payload));
        dispatch(setSuccessMessage(data.message ?? "Profile updated"));
      } else {
        const msg =
          data.response?.message ??
          data.response?.error ??
          data.message ??
          data.error ??
          "Something went wrong";
        dispatch(setErrorMessage(msg));
      }
    } catch (err) {
      dispatch(
        setErrorMessage(
          axios.isAxiosError(err) ? err.message : (err as Error).message
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Social Links
  const updateSocialLink = async (payload: UpdateSocialLinkPayload) => {
    try {
      setIsLoading(true);
      const token = await getTokenFromSession();
      const { data } = await axios.patch<UpdateResponse>(
        `${process.env.SERVER_URL}/account/social-link/${payload.id}`,
        { name: payload.name, link: payload.link },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (data.success) {
        dispatch(updateSocialLinkAction(payload));
        dispatch(setSuccessMessage(data.message ?? "Link updated"));
      } else {
        const msg =
          data.response?.message ??
          data.response?.error ??
          data.message ??
          data.error ??
          "Something went wrong";
        dispatch(setErrorMessage(msg));
      }
    } catch (err) {
      dispatch(
        setErrorMessage(
          axios.isAxiosError(err) ? err.message : (err as Error).message
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const addSocialLink = async (payload: AddSocialLink) => {
    try {
      setIsLoading(true);
      const token = await getTokenFromSession();
      const { data } = await axios.post<AddResponse>(
        `${process.env.SERVER_URL}/account/social-link`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        dispatch(addSocialLinkAction(data.data!));
        dispatch(setSuccessMessage(data.message ?? "New Social Link Added"));
      } else {
        let msg: any;

        if (Array.isArray(data.response?.message)) {
          msg = data.response?.message[0];
        } else {
          msg =
            data.response?.message ??
            data.response?.error ??
            data.message ??
            data.error ??
            "Something went wrong";
        }
        dispatch(setErrorMessage(msg));
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return {
          success: false,
          message:
            err.response?.data?.message ??
            err.response?.data?.error ??
            err.message,
        };
      }
    } finally {
      setIsLoading(false);
    }
  };

  const removeSocialLink = async (payload: { id: string }) => {
    try {
      setIsLoading(true);
      const token = await getTokenFromSession();
      const { data } = await axios.delete<UpdateResponse>(
        `${process.env.SERVER_URL}/account/social-link/${payload.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        dispatch(removeSocialLinkAction({ id: payload.id }));
        dispatch(setSuccessMessage(data.message ?? "Socil Link removed"));
      } else {
        let msg: any;

        if (Array.isArray(data.response?.message)) {
          msg = data.response?.message[0];
        } else {
          msg =
            data.response?.message ??
            data.response?.error ??
            data.message ??
            data.error ??
            "Something went wrong";
        }
        dispatch(setErrorMessage(msg));
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return {
          success: false,
          message:
            err.response?.data?.message ??
            err.response?.data?.error ??
            err.message,
        };
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateProfile,
    updateAccount,
    updateSocialLink,
    addSocialLink,
    removeSocialLink,
    isLoading,
  };
}
