import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RiSendPlaneFill } from "react-icons/ri";
import { MdAttachment } from "react-icons/md";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import WorkspaceMember from "./WorkspaceMember";
import useUserStore from "@/app/zustand/store";
import { Workspace } from "@/app/types/Workspace";
import SockJS from "sockjs-client";
import { CompatClient, IMessage, Stomp } from "@stomp/stompjs";
import { Message, MessageResponse, Status } from "@/app/types/Message";
import axios from "axios";
import { getMessages } from "@/app/chat/workspaceClient";
import { getUserById } from "@/app/register/registerClient";
import { User } from "@/app/types/User";
import { ScrollArea } from "../ui/scroll-area";

function Chat({
  className,
  selectedChat,
}: {
  className?: string;
  selectedChat: Workspace | null;
}) {
  const [stompClient, setStompClient] = useState<CompatClient | null>(null);
  const [messageInput, setMessageInput] = useState<string>("");
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [userStatus, setUserStatus] = useState<{ [userName: string]: boolean }>(
    {}
  );
  const cookie = useUserStore((state) => state.token); // Assuming this fetches the token correctly
  const { fetchUser, user } = useUserStore();

  useEffect(() => {
    fetchUser(); // Fetching user details
  }, [fetchUser]);

  useEffect(() => {
    if (!selectedChat) return; // Exit if no chat is selected

    const socket = new SockJS("http://localhost:8082/ws");
    const stomp = Stomp.over(socket);

    stomp.connect(
      {
        headers: {
          Authorization: `Bearer ${cookie}`, // Authorization header for WebSocket connection
        },
      },
      () => {
        setStompClient(stomp);
      }
    );

    return () => {
      if (stompClient) {
        stompClient.disconnect(); // Disconnect WebSocket on unmount
      }
    };
  }, [selectedChat, cookie]);

  useEffect(() => {
    if (!stompClient || !selectedChat) return;

    const messageSubscription = stompClient.subscribe(
      `/topic/messages/${selectedChat.id}`, // Subscribe to the topic specific to selected chat
      (message) => {
        console.log("Received message: ", message.body);
        const messageResponse: MessageResponse = JSON.parse(message.body);
        setMessages((prev) => [...prev, messageResponse]); // Update messages state
      },
      {
        Authorization: `Bearer ${cookie}`, // Authorization header for subscription
      }
    );

    return () => {
      messageSubscription.unsubscribe(); // Unsubscribe when component unmounts or when selectedChat changes
    };
  }, [stompClient, selectedChat, cookie]);

  const sendMessage = () => {
    if (messageInput.trim() !== "" && stompClient && user && selectedChat) {
      const message: Message = {
        content: messageInput,
        receiverIds: selectedChat.members,
        senderId: user.id,
        workspaceId: selectedChat.id,
        attachment: "",
        createdAt: new Date(),
        status: Status.SENT,
      };

      stompClient.send(
        "/app/chat", // Destination
        {
          Authorization: `Bearer ${cookie}`, // Authorization header for sending message
        },
        JSON.stringify(message) // Message content
      );

      setMessageInput(""); // Clear input after sending message
    }
  };

  return (
    <div className={cn(className, "min-h-full relative")}>
      {selectedChat ? (
        <div>
          <div className="shadow-2xl border-b-2 border-zinc-600/5 py-4 px-4 flex gap-5">
            <Avatar className="rounded-full ring ring-primary/50">
              <AvatarImage
                className="rounded-full h-16 w-16"
                src={selectedChat.image}
                alt={selectedChat.name} // Assuming selectedChat has 'image' and 'name' properties
              />
              <AvatarFallback>{selectedChat.name.toLocaleUpperCase()[0]}</AvatarFallback>
            </Avatar>
            <WorkspaceMember workspace={selectedChat} />
          </div>
          <div className="mt-4 mb-2 text-lg font-bold">Messages</div>
          <ScrollArea className="h-96 rounded-md overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`px-4 py-2 ${
                  message.senderId.username === user?.username
                    ? "text-right"
                    : "text-left"
                }`}
              >
                <span className="font-semibold">
                  {message.senderId.name || message.senderId.username}
                </span>{" "}
                - {message.content}
              </div>
            ))}
          </ScrollArea>
          <div className="absolute w-full bottom-0">
            <div className="flex items-center justify-between px-4 py-2   rounded-b-lg">
              <Input
                type="text"
                placeholder="Send a message"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="secondary">
                        <MdAttachment />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Attach files</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button onClick={sendMessage}>
                        <RiSendPlaneFill />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Send Message</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-32 text-muted-foreground">
          <h1 className="text-2xl">Select a chat to start messaging</h1>
        </div>
      )}
    </div>
  );
}

export default Chat;
