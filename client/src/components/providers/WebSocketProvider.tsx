"use client"
import WebSocketService from "@/app/utils/socket";
import useUserStore from "@/app/zustand/store";
import { ReactNode, useEffect, useRef } from "react";

const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const token = useUserStore((state) => state.token);
  const stompClientRef = useRef<WebSocketService | null>(null);

  useEffect(() => {
    // Clean up previous connection when token changes or component unmounts
    if (stompClientRef.current) {
      stompClientRef.current.disconnect();
      stompClientRef.current = null;
    }

    if (token) {
      // Create a new WebSocket connection
      const stompClient = new WebSocketService();
      stompClient.connect(token);
      stompClientRef.current = stompClient;

      // Handle connection events
      stompClient.onConnected(() => {
        // Function to fetch latest subscription data (connected users)
        const fetchLatestData = () => {
          stompClient.send("/app/users", ""); // Replace with your actual endpoint
          stompClient.subscribe("/topic/connectedUsers", (message) => {
            useUserStore
              .getState()
              .setOnlineMembers(JSON.parse(message.body).connectedUsers);
          });
        };

        // Initial fetch
        fetchLatestData();

        // Set up interval to fetch data every 15 seconds
        const intervalId = setInterval(fetchLatestData, 15000);

        // Clean up interval and WebSocket connection when component unmounts or token changes
        return () => {
          clearInterval(intervalId);
          if (stompClientRef.current) {
            stompClientRef.current.disconnect();
            stompClientRef.current = null;
          }
        };
      });
    }
  }, [token]);

  return <div>{children}</div>;
};

export default WebSocketProvider;
