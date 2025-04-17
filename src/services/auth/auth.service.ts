import axios from "axios";
import { LoginDTO } from "./dto/auth.dto";
import { getTokenFromSession } from "./token.service";

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

// Login
export const login = async (formData: LoginDTO): Promise<Response> => {
  try {
    const { data } = await axios.post<Response>(
      `${process.env.SERVER_URL}/auth/login`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return {
        success: false,
        error: err.response?.data?.error || err.message,
      };
    }
    return {
      success: false,
      error: "Something went wrong while logging in",
    };
  }
};

// Logout
export const logout = async (): Promise<Response> => {
  try {
    const { data } = await axios.post<Response>(
      `${process.env.SERVER_URL}/auth/logout`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getTokenFromSession()}`,
        },
        withCredentials: true,
      }
    );

    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return {
        success: false,
        error: err.response?.data?.error || err.message,
      };
    }
    return {
      success: false,
      error: "Something went wrong while logging out",
    };
  }
};
