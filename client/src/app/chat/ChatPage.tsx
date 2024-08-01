"use client";
import Chat from "@/components/custom/Chat";
import Sidebar from "@/components/custom/Sidebar";
import React, { useEffect, useState } from "react";
import { Workspace } from "../types/Workspace";
import useUserStore from "../zustand/store";
import { User } from "../types/User";

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState<Workspace | User | null>(
    null
  );
  const [selectChat, setSelectChat] = useState<boolean>(false);
  const { fetchUser, user } = useUserStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const queryParams = new URLSearchParams(window.location.search);
      const workspaceId = queryParams.get("workspace");
      if (workspaceId) {
        setSelectedChat(
          user?.workspaces.find((workspace) => workspace.id === workspaceId) ||
            null
        );
        setSelectChat(true);
      }

      const userId = queryParams.get("user");
      if (userId) {
        if (
          user?.usersInteractedWith.find((user) => user.id === userId) ===
          undefined
        ) {
          fetchUser();
        }
        setSelectedChat(
          user?.usersInteractedWith.find((user) => user.id === userId) || null
        );
        setSelectChat(true);
      }
    }
  }, [window.location]);

  return (
    <div className="max-w-screen h-[90vh] grid grid-cols-4 mt-16">
      <Sidebar
        className={`${
          selectChat ? "hidden sm:block" : "block"
        } col-span-4 sm:col-span-1 md:block`}
        selectChat={selectChat}
        setSelectChat={setSelectChat}
        setSelectedChat={setSelectedChat}
        selectedChat={selectedChat}
      />

      <Chat
        selectChat={selectChat}
        setSelectChat={setSelectChat}
        className={`${
          selectChat ? "block" : "hidden md:block"
        } col-span-4 md:col-span-3`}
        selectedChat={selectedChat}
      />
    </div>
  );
};

export default ChatPage;
