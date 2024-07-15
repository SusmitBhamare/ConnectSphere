"use client";
import Chat from "@/components/custom/Chat";
import Sidebar from "@/components/custom/Sidebar";
import React, { useEffect, useState } from "react";
import { Workspace } from "../types/Workspace";
import useUserStore from "../zustand/store";
import { User } from "../types/User";

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState<Workspace | User | null>(null);
  const { user } = useUserStore();
  useEffect(() => {
    if(typeof window !== "undefined"){
      const queryParams = new URLSearchParams(window.location.search);
      const workspaceId = queryParams.get("workspace");
      if(workspaceId){
        setSelectedChat((prev) => prev = user?.workspaces.find((workspace) => workspace.id === workspaceId) || null);
      }

      const userId = queryParams.get("user");
      if(userId){
        setSelectedChat((prev) => prev = user?.usersInteractedWith.find((user) => user.id === userId) || null);
      }
    }
  } , [window]);

  return (
    <div className="max-w-screen h-[90vh] grid grid-cols-4 mt-16">
      <Sidebar setSelectedChat={setSelectedChat}  selectedChat={selectedChat} />
      <Chat className="col-span-3" selectedChat={selectedChat} />
    </div>
  );
};

export default ChatPage;
