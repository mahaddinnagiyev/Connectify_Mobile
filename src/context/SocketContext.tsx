import React, { createContext, useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { getTokenFromSession } from "@services/auth/token.service";

const SocketContext = createContext<Socket | null>(null);

export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    (async () => {
      const token = await getTokenFromSession();
      if (!token) return;

      socketRef.current = io(process.env.SERVER_WEB_SOCKET_URL!, {
        transports: ["websocket"],
        auth: { token },
      });
    })();

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};
