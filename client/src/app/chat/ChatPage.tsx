"use client";
import Chat from "@/components/custom/Chat";
import Sidebar from "@/components/custom/Sidebar";
import React, { useEffect, useState } from "react";
import { Workspace } from "../types/Workspace";
import { StompSessionProvider } from "react-stomp-hooks";
import useUserStore from "../zustand/store";

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState<Workspace | null>(null);
  const { user } = useUserStore();
  useEffect(() => {
    if(typeof window !== "undefined"){
      const queryParams = new URLSearchParams(window.location.search);
      const workspaceId = queryParams.get("workspace");
      console.log(workspaceId);
      if(workspaceId){
        setSelectedChat((prev) => prev = user?.workspaces.find((workspace) => workspace.id === workspaceId) || null);
      }
    }
  } , [typeof window !== "undefined" ? window : ""]);

  return (
    <div className="max-w-screen h-[90vh] grid grid-cols-4 mt-16">
      <Sidebar setSelectedChat={setSelectedChat}  selectedChat={selectedChat} />
      <Chat className="col-span-3" selectedChat={selectedChat} />
    </div>
  );
};

export default ChatPage;
