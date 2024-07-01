"use client"
import Chat from '@/components/custom/Chat';
import Sidebar from '@/components/custom/Sidebar';
import React, { useState } from 'react'


const ChatPage = ({cookie} : {cookie : string | undefined}) => {
  const [selectedChat, setSelectedChat] = useState<Workspace | null>(null);
  return (
    <div className="max-w-screen h-[90vh] grid grid-cols-4 mt-16">
      <Sidebar cookie={cookie} setSelectedChat={setSelectedChat} />
      <Chat className="col-span-3" cookie={cookie} selectedChat={selectedChat} />
    </div>
  );
}

export default ChatPage