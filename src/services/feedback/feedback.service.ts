import axios from "axios";
import { Response } from "../auth/auth.service";

export interface CreateFeedbackDTO {
  first_name: string;
  last_name: string;
  email: string;
  message: string;
}

export const createFeedback = async (
  formData: CreateFeedbackDTO
): Promise<Response> => {
  try {
    const { data } = await axios.post<Response>(
      `${process.env.SERVER_URL}/feedback/send`,
      formData,
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        withCredentials: true,
      }
    );
    return data;
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
    return {
      success: false,
      error: "Something went wrong while logging in",
    };
  }
};
