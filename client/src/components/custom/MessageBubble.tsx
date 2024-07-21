import { MessageResponse, Status } from "@/app/types/Message";
import React from "react";
import dateFormat from "dateformat";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { IoCheckmark, IoCheckmarkDone } from "react-icons/io5";
import { MdImage } from "react-icons/md";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "sonner";
import { FaFile, FaFilePdf } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";

const MessageBubble = ({
  message,
  isUser,
}: {
  message: MessageResponse;
  isUser: boolean;
}) => {
  const handleView = async (url: string | undefined) => {
    if (!url) return;
    window.open(url);
  };

  const handleDownload = async (
    message: MessageResponse,
    endpoint: string | undefined
  ) => {
    if(!endpoint) return;

    try{
      const response = await axios.get(endpoint , {
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", message.attachment?.name || "file");
      document.body.appendChild(link);
      link.click();
    }catch(e){
      toast.error("Failed to download file");
    }
  };
  return (
    <div
      className={`flex w-max gap-3 items-center ${
        isUser ? "self-end flex-row-reverse" : "self-start"
      }`}
    >
      <Avatar className="rounded-full ring ring-primary/50">
        <AvatarImage
          className="rounded-full w-8"
          src={message.sender.image || ""}
          alt="@shadcn"
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="my-2 w-52 rounded-lg py-1">
        <div className="px-2 py-0.1">
          <div
            className={`text-xs text-muted-foreground ${
              isUser ? "self-end flex-row-reverse" : "self-start"
            }`}
          >
            {isUser ? "You" : message.sender.username}
          </div>
          {message.attachment && (
            <div className="my-2 rounded-lg bg-primary text-zinc-200 border-2 border-white/5 text-sm flex flex-col items-center justify-center relative w-full">
              {message.attachment.type.startsWith("image") && (
                <Image
                  alt={message.attachment.name}
                  src={message.attachment.url}
                  className="w-full h-full rounded-md"
                  width={100}
                  height={100}
                />
              )}
              <div className="flex gap-2 w-full items-center font-semibold p-2">
                {message.attachment.type.startsWith("image") ? (
                  <MdImage className="w-5 h-5" />
                ) :
                message.attachment.type.startsWith("pdf") ? (
                  <FaFilePdf className="w-5 h-5" />
                )               
                : (
                  <FaFile className="w-5 h-5" />
                )}
                <p
                  title={message.attachment.name}
                  className="flex-1 p-0 m-0 w-full truncate whitespace-nowrap"
                >
                  {message.attachment.name}
                </p>
              </div>
              <div className="flex bottom-0 w-full mt-2 items-center">
                <Button
                  size={"sm"}
                  onClick={() => handleView(message.attachment?.url)}
                  className="w-full rounded-tr-none rounded-br-none"
                  variant={"outline"}
                >
                  View
                </Button>
                <Button
                  size={"sm"}
                  className="w-full rounded-tl-none rounded-bl-none"
                  variant={"secondary"}
                  onClick={() =>
                    handleDownload(message, message.attachment?.url)
                  }
                >
                  Download
                </Button>
              </div>
            </div>
          )}
          <div
            className={` rounded-lg px-4 break-words text-wrap max-w-full py-2 ${
              isUser ? "bg-primary/10" : "bg-primary/50"
            }`}
          >
            {message.content}
          </div>
        </div>
        <div
          className={`flex ${
            isUser ? "justify-end" : "justify-start"
          } items-center text-muted-foreground`}
        >
          <div>
            {isUser &&
              (message.status === Status[Status.SENT] ? (
                <IoCheckmark />
              ) : message.status === Status[Status.RECEIVED] ? (
                <IoCheckmarkDone />
              ) : (
                <IoCheckmarkDone className="text-yellow-300" />
              ))}
          </div>
          <div className="text-2xs px-2 py-0.5">
            {dateFormat(message.createdAt, "shortTime")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
