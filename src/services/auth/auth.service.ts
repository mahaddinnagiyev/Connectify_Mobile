import axios from "axios";
import { FaceIdLoginDTO, LoginDTO, SignupDTO } from "./dto/auth.dto";
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

// Login With Face ID
export const faceIdLogin = async (
  formData: FaceIdLoginDTO
): Promise<Response> => {
  try {
    const { data } = await axios.post<Response>(
      `${process.env.SERVER_URL}/auth/login/faceid`,
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

// Logout
export const logout = async (): Promise<Response> => {
  try {
    const { data } = await axios.post<Response>(
      `${process.env.SERVER_URL}/auth/logout`,
      {},
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
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
        message:
          err.response?.data?.message ??
          err.response?.data?.error ??
          err.message,
      };
    }
    return {
      success: false,
      error: "Something went wrong while logging out",
    };
  }
};

// Signup
export const signup = async (formData: SignupDTO): Promise<Response> => {
  try {
    const { data } = await axios.post<Response>(
      `${process.env.SERVER_URL}/auth/signup`,
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
      error: "Something went wrong while signing up",
    };
  }
};

// Confirm Account
export const confirmAccount = async (code: number): Promise<Response> => {
  try {
    const { data } = await axios.post<Response>(
      `${process.env.SERVER_URL}/auth/signup/confirm`,
      { code },
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
      error: "Something went wrong while confirming account",
    };
  }
};

// Forgot Password
export const forgotPassoword = async (email: string): Promise<Response> => {
  try {
    const { data } = await axios.post<Response>(
      `${process.env.SERVER_URL}/auth/forgot-password`,
      { email },
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
      error: "Something went wrong while confirming account",
    };
  }
};
