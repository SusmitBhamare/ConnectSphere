"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Workspace } from "../types/Workspace";
import useUserStore from "../zustand/store";
import { User } from "../types/User";
import Sidebar from "./Sidebar";
import Chat from "./Chat";

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState<Workspace | User | null>(
    null
  );
  const [selectChat, setSelectChat] = useState<boolean>(false);
  const { fetchUser, user } = useUserStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleLocationChange = () => {
      const workspaceId = searchParams.get("workspace");
      if (workspaceId) {
        setSelectedChat(
          user?.workspaces.find((workspace) => workspace.id === workspaceId) ||
            null
        );
        setSelectChat(true);
      }

      const userId = searchParams.get("user");
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
    };

    handleLocationChange(); // Call initially to handle the current URL
  }, [searchParams, user]);

  return (
    <div className="max-w-screen h-[90vh] grid grid-cols-4 mt-16">
      <Sidebar
        className={`${
          selectChat ? "hidden sm:block" : "flex"
        } col-span-4 sm:col-span-1 md:flex`}
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
