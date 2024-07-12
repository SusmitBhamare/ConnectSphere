import { MessageResponse, Status } from "@/app/types/Message";
import React from "react";
import dateFormat from "dateformat";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { IoCheckmark, IoCheckmarkDone } from "react-icons/io5";

const MessageBubble = ({
  message,
  isUser,
}: {
  message: MessageResponse;
  isUser: boolean;
}) => {
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
      <div
        className={`my-2 w-52 rounded-lg py-1 ${
          isUser ? "bg-primary/10" : "bg-primary/50"
        }`}
      >
        <div className="px-2 py-0.1">
          <div className="text-xs text-muted-foreground">
            {isUser ? "You" : message.sender.username}
          </div>
          <p className="">{message.content}</p>
        </div>
        <Separator className="mt-1" />
        <div className="flex justify-end items-center text-muted-foreground ">
          <div>
            {message.status === Status[Status.SENT] ? (
              <IoCheckmark />
            ) : message.status === Status[Status.RECEIVED] ? (
              <IoCheckmarkDone />
            ) : (
              <IoCheckmarkDone className="text-yellow-300" />
            )}
          </div>
          <div className="text-2xs text-right px-1 py-0.5">
            {dateFormat(message.createdAt, "shortTime")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
