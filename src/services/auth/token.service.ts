import axios from "axios";

export const getTokenFromSession = async (): Promise<string | null> => {
  try {
    const { data } = await axios.get<{ access_token: string }>(
      `${process.env.SERVER_URL}/auth/session/token`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    if (data.access_token === "no_token" || !data.access_token) return null;

    return data.access_token;
  } catch (error) {
    return null;
  }
};
