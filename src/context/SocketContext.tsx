import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Redux
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";

const SocketContext = createContext<Socket | null>(null);

export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { token } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    let sock: Socket | null = null;

    (async () => {
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
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
