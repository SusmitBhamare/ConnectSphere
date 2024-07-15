"use client";

import WebSocketService from "@/app/utils/socket";
import useUserStore from "@/app/zustand/store";
import { ReactNode, useEffect } from "react";

const WebSocketProvider = ({children} : {children : ReactNode}) => {
  const token = useUserStore((state) => state.token);
  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (token) {
      const connect = async () => {
        const stompClient = new WebSocketService();
        stompClient.connect(token);

        stompClient.onConnected(() => {
          stompClient.send("/app/users", "");
          stompClient.subscribe("/topic/connectedUsers", (message) => {
            useUserStore
              .getState()
              .setOnlineMembers(JSON.parse(message.body).connectedUsers);
          });
        });
      };

      connect();
      interval = setInterval(connect, 5000);
    }

    // Clean up interval when component unmounts or token changes
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [token]);

  return <div>
    {children}
  </div>
};

export default WebSocketProvider;
