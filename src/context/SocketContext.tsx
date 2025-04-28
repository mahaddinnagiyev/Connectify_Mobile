import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getTokenFromSession } from "@services/auth/token.service";

const SocketContext = createContext<Socket | null>(null);

export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    let sock: Socket | null = null;

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
      sock?.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
