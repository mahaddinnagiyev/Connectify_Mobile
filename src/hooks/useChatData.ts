import axios from "axios";
import { useState } from "react";

// Services
import { MessagesDTO } from "@services/messenger/messenger.dto";

// Redux
import { RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setErrorMessage } from "@redux/messages/messageSlice";

interface MediaResponse {
  success: boolean;
  messages: MessagesDTO[];
  error?: string;
  message?: string;
  response: { success: boolean; error?: string; message?: string };
}

interface UploadResponse {
  success: boolean;
  publicUrl: string;
  error?: string;
  message?: string;
  response: { success: boolean; error?: string; message?: string };
}

export function useChatData() {
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const [medias, setMedias] = useState<MessagesDTO[]>([]);
  const [isMediasLoading, setIsMediasLoading] = useState<boolean>(false);
  const [isUploadingAudio, setIsUploadingAudio] = useState<boolean>(false);
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false);
  const [isVideoUploading, setIsVideoUploading] = useState<boolean>(false);
  const [isFileUploading, setIsFileUploading] = useState<boolean>(false);

  const fetchMedias = async (roomId: string) => {
    try {
      const { data } = await axios.get<MediaResponse>(
        `${process.env.SERVER_URL}/messenger/chat-rooms/${roomId}/medias`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (data.success) {
        setMedias(data.messages);
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
      setIsMediasLoading(false);
    }
  };

  const handleUploadAudio = async (
    formData: FormData,
    roomId: string,
    senderId: string
  ) => {
    try {
      setIsUploadingAudio(true);
      const { data } = await axios.post<UploadResponse>(
        `${process.env.SERVER_URL}/messenger/upload-audio?roomId=${roomId}&senderId=${senderId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (data.success) return data;

      dispatch(
        setErrorMessage(
          data.response?.message ??
            data.response?.error ??
            data.message ??
            data.error ??
            "Something went wrong"
        )
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(setErrorMessage(error.message));
      }
      dispatch(setErrorMessage((error as Error).message));
    } finally {
      setIsUploadingAudio(false);
    }
  };

  const handleUploadImage = async (
    formData: FormData,
    roomId: string,
    senderId: string
  ) => {
    try {
      setIsImageUploading(true);
      const { data } = await axios.post<UploadResponse>(
        `${process.env.SERVER_URL}/messenger/upload-image?roomId=${roomId}&senderId=${senderId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (data.success) return data;

      dispatch(
        setErrorMessage(
          data.response?.message ??
            data.response?.error ??
            data.message ??
            data.error ??
            "Something went wrong"
        )
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(setErrorMessage(error.message));
      }
      dispatch(setErrorMessage((error as Error).message));
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleUploadVideo = async (
    formData: FormData,
    roomId: string,
    senderId: string
  ) => {
    try {
      setIsVideoUploading(true);
      const { data } = await axios.post<UploadResponse>(
        `${process.env.SERVER_URL}/messenger/upload-video?roomId=${roomId}&senderId=${senderId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (data.success) return data;

      dispatch(
        setErrorMessage(
          data.response?.message ??
            data.response?.error ??
            data.message ??
            data.error ??
            "Something went wrong"
        )
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(setErrorMessage(error.message));
      }
      dispatch(setErrorMessage((error as Error).message));
    } finally {
      setIsVideoUploading(false);
    }
  };

  const handleFileUpload = async (
    formData: FormData,
    roomId: string,
    senderId: string
  ) => {
    try {
      setIsVideoUploading(true);
      const { data } = await axios.post<UploadResponse>(
        `${process.env.SERVER_URL}/messenger/upload-file?roomId=${roomId}&senderId=${senderId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (data.success) return data;

      dispatch(
        setErrorMessage(
          data.response?.message ??
            data.response?.error ??
            data.message ??
            data.error ??
            "Something went wrong"
        )
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(setErrorMessage(error.message));
      }
      dispatch(setErrorMessage((error as Error).message));
    } finally {
      setIsVideoUploading(false);
    }
  };

  return {
    medias,
    isMediasLoading,
    fetchMedias,

    // audio
    handleUploadAudio,
    isUploadingAudio,

    // Image
    handleUploadImage,
    isImageUploading,

    // Video
    handleUploadVideo,
    isVideoUploading,

    // File
    handleFileUpload,
    isFileUploading,
  };
}
