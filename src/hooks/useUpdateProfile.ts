import axios from "axios";
import { useDispatch } from "react-redux";
import {
  updateAccountFields,
  updateUserFields,
  updateSocialLink as updateSocialLinkAction,
  addSocialLink as addSocialLinkAction,
  removeSocialLink as removeSocialLinkAction,
  changeProfilePhoto as changeProfilePhotoAction,
  updatePrivacySettings as updatePrivacySettingsAction,
} from "@redux/profile/myProfileSlice";
import {
  setErrorMessage,
  setSuccessMessage,
} from "@redux/messages/messageSlice";
import { getTokenFromSession } from "@services/auth/token.service";
import { Gender } from "@enums/gender.enum";
import { useState } from "react";
import { PrivacySettings } from "../services/account/dto/privacy.dto";

export type UploadFile = {
  uri: string;
  name: string;
  type: string;
};

export interface Response {
  success: boolean;
  message?: string;
  error?: string;
  response?: {
    success: boolean;
    message?: string;
    error?: string;
  };
}

interface AddResponse {
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

interface UpdatePersonalInfoPayload {
  first_name: string;
  last_name: string;
  username: string;
  gender: Gender;
}

interface UpdateProfileInfoPayload {
  bio: string;
  location: string;
}

interface UpdateSocialLinkPayload {
  id: string;
  name: string;
  link: string;
}

interface AddSocialLink {
  name: string;
  link: string;
}

interface ChangeProfilePhotoPayload {
  file?: File;
  clear?: boolean;
}

interface UpdateProfilePicture {
  success: boolean;
  message?: string;
  error?: string;
  profile_picture?: string;
  response?: {
    success: boolean;
    message?: string;
    error?: string;
  };
}

export function useUpdateProfile() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPrivacyChanging, setIsPrivacyChanging] = useState<boolean>(false);

  const updateProfile = async (payload: UpdatePersonalInfoPayload) => {
    try {
      setIsLoading(true);
      const token = await getTokenFromSession();
      const { data } = await axios.patch<Response>(
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
      const { data } = await axios.patch<Response>(
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
      const { data } = await axios.patch<Response>(
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
      const { data } = await axios.delete<Response>(
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

  const changeProfilePhoto = async (payload: ChangeProfilePhotoPayload) => {
    setIsLoading(true);
    try {
      const token = await getTokenFromSession();
      let response;

      if (payload.file) {
        const formData = new FormData();
        formData.append("profile_picture", payload.file as any);

        response = await axios.patch<UpdateProfilePicture>(
          `${process.env.SERVER_URL}/account/profile-pic`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
      } else {
        response = await axios.patch<UpdateProfilePicture>(
          `${process.env.SERVER_URL}/account/profile-pic`,
          { clear: payload.clear ?? false },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
      }

      const data = response.data;

      if (data.success) {
        dispatch(
          changeProfilePhotoAction({
            profile_picture: data?.profile_picture ?? undefined,
          })
        );
        dispatch(
          setSuccessMessage(
            data.message || "Profile photo updated successfully"
          )
        );
      } else {
        dispatch(
          setErrorMessage(
            data.response?.message ??
              data.response?.error ??
              data.message ??
              data.error ??
              "Failed to update photo"
          )
        );
      }
    } catch (err) {
      let msg: any;

      if (axios.isAxiosError(err)) {
        msg =
          err.response?.data?.message ??
          err.response?.data?.error ??
          err.message;
      }

      msg = msg ?? "Something went wrong";

      dispatch(setErrorMessage(msg));
    } finally {
      setIsLoading(false);
    }
  };

  const updatePrivacySettings = async (payload: PrivacySettings) => {
    try {
      setIsPrivacyChanging(true);

      const token = await getTokenFromSession();
      const { data } = await axios.patch<Response>(
        `${process.env.SERVER_URL}/account/privacy-settings`,
        {
          ...payload,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        dispatch(updatePrivacySettingsAction(payload));
        dispatch(setSuccessMessage(data.message ?? "Privacy settings updated"));
      } else {
        if (Array.isArray(data.response?.message)) {
          dispatch(setErrorMessage(data.response?.message[0]));
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
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          message:
            error.response?.data?.message ??
            error.response?.data?.error ??
            error.message,
        };
      }
    } finally {
      setIsPrivacyChanging(false);
    }
  };

  return {
    updateProfile,
    updateAccount,
    updateSocialLink,
    addSocialLink,
    removeSocialLink,
    changeProfilePhoto,
    updatePrivacySettings,
    isPrivacyChanging,
    isLoading,
  };
}
