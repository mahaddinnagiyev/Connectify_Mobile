import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getTokenFromSession } from "@services/auth/token.service";

export const useSocket = (): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    let sock: Socket;
    (async () => {
      const token = await getTokenFromSession();
      if (!token) return;
      sock = io(process.env.SERVER_WEB_SOCKET_URL!, {
        transports: ["websocket"],
        auth: { token },
      });
      setSocket(sock);
    })();

    return () => {
      if (sock) sock.disconnect();
    };
  }, []);

  return socket;
};
