import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RiSendPlaneFill } from "react-icons/ri";
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
import { CompatClient, Stomp } from "@stomp/stompjs";
import { Message, MessageResponse, Status } from "@/app/types/Message";
import { ScrollArea } from "../ui/scroll-area";
import {
  getMessagesForUser,
  getMessagesForWorkspace,
  uploadImage as uploadFile,
} from "@/app/chat/workspaceClient";
import MessageBubble from "./MessageBubble";
import { User } from "@/app/types/User";
import AttachmentModal from "./AttachmentModal";
import { Badge } from "../ui/badge";
import { MdClose, MdFileCopy, MdImage } from "react-icons/md";
import { FaFile, FaFilePdf, FaSpinner } from "react-icons/fa6";
import { toast } from "sonner";
import { useUploadThing } from "@/app/utils/uploadthing";
import { isWorkspace } from "@/app/utils/typeUtil";
import { set } from "react-hook-form";

function Chat({
  className,
  selectedChat,
}: {
  className?: string;
  selectedChat: Workspace | User | null;
}) {
  const [stompClient, setStompClient] = useState<CompatClient | null>(null);
  const [messageInput, setMessageInput] = useState<string>("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const cookie = useUserStore((state) => state.token); // Assuming this fetches the token correctly
  const { fetchUser, user, notifications, setNotifications } = useUserStore();
  const { startUpload } = useUploadThing("imageUploader");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      if (!selectedChat) return;
      let messages;
      if (isWorkspace(selectedChat)) {
        messages = await getMessagesForWorkspace(selectedChat.id, cookie);
      } else {
        // Assuming this function fetches messages for a user
        if (user) {
          messages = await getMessagesForUser(user.id, selectedChat.id, cookie);
        }
      }
      if (messages) {
        setMessages(messages);
      }
      setLoading(false);
    };
    fetchMessages();
  }, [selectedChat, cookie]);

  useEffect(() => {
    fetchUser(); // Fetching user details
  }, [fetchUser]);

  useEffect(() => {
    // if (!selectedChat) return; // Exit if no chat is selected

    const socket = new SockJS("http://localhost:8082/ws");
    const stomp = Stomp.over(() => socket);

    stomp.connect(
      {
        Authorization: `Bearer ${cookie}`, // Authorization header for WebSocket connection
      },
      () => {
        setStompClient(stomp);
      },
      (error: any) => {
        console.error("Connection error: ", error);
      }
    );

    return () => {
      if (stompClient) {
        stompClient.disconnect(() => {
          console.log("Disconnected");
        });
      }
    };
  }, [selectedChat, cookie]);

  useEffect(() => {
    if (!stompClient) return;

    console.log("Subscribing to messages");
    
    const messageSubscription = stompClient?.subscribe(
      `/topic/messages`, // Subscribe to the topic specific to selected chat
      (message) => {
        const messageResponse: MessageResponse = JSON.parse(message.body);
        console.log("Received message: ", messageResponse);
        
        if (!isWorkspace(selectedChat) && messageResponse.receivers) {
          if (
            user &&
            !user.usersInteractedWith
              .map((u) => u.id)
              .includes(messageResponse?.receivers[0].id)
          ) {
            fetchUser();
          }
        }
        if(!isWorkspace){
          setNotifications([...notifications, messageResponse]);
          return;
        }
        if (
          (isWorkspace(selectedChat) &&
            messageResponse.workspaceId?.id !== selectedChat.id)
        ) {
          setNotifications([...notifications, messageResponse]);
          return;
        } else if (
          !isWorkspace(selectedChat) &&
          messageResponse.sender.id !== user?.id &&
          messageResponse.sender.id !== selectedChat?.id
        ) {
          setNotifications([...notifications, messageResponse]);
          alert(
            messageResponse.content + "-" + messageResponse.sender.username
          );
          return;
        }
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

  const sendMessage = async () => {
    setIsSending(true);
    if (
      (messageInput.trim() !== "" || attachment) &&
      stompClient &&
      user &&
      selectedChat
    ) {
      let attachmentObj = null;
      if (attachment) {
        const response = await startUpload([attachment]);
        if (response) {
          const res = response;
          attachmentObj = res[0].serverData;
        } else {
          toast.error("Failed to upload attachment");
          return;
        }
      }

      const message: Message = {
        content: messageInput,
        receiverIds: isWorkspace(selectedChat)
          ? selectedChat.members
          : [selectedChat.id],
        senderId: user.id,
        workspaceId: isWorkspace(selectedChat) ? selectedChat.id : "",
        attachment: attachmentObj,
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

      setIsSending(false);

      setMessageInput(""); // Clear input after sending message
      setAttachment(null); // Clear attachment after sending message
      fetchUser(); // Fetching latest user interactions after sending message
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
                src={selectedChat.image ? selectedChat.image : ""}
                alt={selectedChat.name} // Assuming selectedChat has 'image' and 'name' properties
              />
              <AvatarFallback>
                {selectedChat.name.toLocaleUpperCase()[0]}
              </AvatarFallback>
            </Avatar>
            {isWorkspace(selectedChat) ? (
              <WorkspaceMember workspace={selectedChat} />
            ) : (
              <h1 className="font-primary text-lg cursor-pointer">
                {selectedChat?.name}
              </h1>
            )}
          </div>
          {loading ? (
            <div className="text-center mt-32 text-muted-foreground">
              <h1 className="text-2xl">Loading messages...</h1>
            </div>
          ) : (
            <div
              ref={scrollRef}
              className="h-[29rem] rounded-md overflow-y-auto "
            >
              <div className="flex flex-col px-4">
                {messages.map((message, index) => (
                  <MessageBubble
                    message={message}
                    key={index}
                    isUser={user?.username === message.sender.username}
                  />
                ))}
              </div>
            </div>
          )}
          <div className="absolute w-full bottom-0">
            <div className="flex items-center justify-between px-4 py-2 rounded-b-lg">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Send a message"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className={`relative ${attachment ? "h-12" : ""}`}
                />
                {attachment && (
                  <div className="absolute top-1/2 right-3 transform -translate-y-1/2 ">
                    <Badge
                      variant={"secondary"}
                      className="text-sm md:text-base flex gap-2 items-center "
                    >
                      {attachment.type.startsWith("image") ? (
                        <MdImage />
                      ) : attachment.type.startsWith("application/pdf") ? (
                        <FaFilePdf />
                      ) : (
                        <FaFile />
                      )}
                      {attachment?.name}{" "}
                      <MdClose
                        onClick={() => setAttachment(null)}
                        className="cursor-pointer"
                      />
                    </Badge>
                  </div>
                )}
              </div>
              <div className="flex gap-2 items-center px-3">
                <AttachmentModal
                  attachment={attachment}
                  setAttachment={setAttachment}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button disabled={isSending} onClick={sendMessage}>
                        {isSending ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <RiSendPlaneFill />
                        )}
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
          <h1 className="text-3xl">Select a chat to start messaging</h1>
        </div>
      )}
    </div>
  );
}

export default Chat;
