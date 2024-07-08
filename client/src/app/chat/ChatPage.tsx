"use client";
import Chat from "@/components/custom/Chat";
import Sidebar from "@/components/custom/Sidebar";
import React, { useState } from "react";
import { Workspace } from "../types/Workspace";
import { StompSessionProvider } from "react-stomp-hooks";

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState<Workspace | null>(null);
  return (
   
      <div className="max-w-screen h-[90vh] grid grid-cols-4 mt-16">
        <Sidebar setSelectedChat={setSelectedChat} />
        <Chat className="col-span-3" selectedChat={selectedChat} />
      </div>
   
  );
};

export default ChatPage;
