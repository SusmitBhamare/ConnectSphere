"use client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { BsBellFill } from "react-icons/bs";
import useUserStore from "@/app/zustand/store";
import { addUsersInteracted } from "@/app/register/registerClient";
import { MessageResponse } from "@/app/types/Message";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";

const Notifications = () => {
  const router = useRouter();
  const { fetchUser, token, user, notifications , setNotifications } = useUserStore();
  const [isPulsing, setIsPulsing] = useState<boolean>(false);

  useEffect(() => {
    fetchUser();
  }, []);
  
  useEffect(() => {
    if (notifications.length > 0) {
      setIsPulsing(true);
    } else{
      setIsPulsing(false);
    }
  } , [notifications])

  

  function handleNotificationClick(notification : MessageResponse){
    setNotifications(notifications.filter((n) => n.id !== notification.id));
    router.push(
      notification.workspaceId
        ? "chat?workspace=" + notification.workspaceId.id
        : "chat?user=" + notification.sender?.id
    );
  }

  console.log(notifications);
  

  useEffect(() => {
    if (!user) return;
    for (let notification of notifications) {
      const interactedIds = user?.usersInteractedWith.map((user) => user.id);
      if (!notification.sender) continue;
      if (!interactedIds?.includes(notification.sender.id)) {
        addUsersInteracted(token, user.id, {
          receiverId: notification.sender.id,
        });
      }
    }
  }, [user, notifications]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={notifications.length === 0}
          className="rounded-full ring-2 ring-primary/5 relative"
          variant={"ghost"}
          size={"icon"}
        >
          <BsBellFill />
          {
            isPulsing && <div className="w-2 h-2  rounded-full bg-red-500 absolute bottom-0 right-0 animate-pulse"/>
          }
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {notifications.map((notification) => (
          <DropdownMenuItem className="text-white" key={notification?.id}>
            <Button
              variant={"ghost"}
              onClick={() => handleNotificationClick(notification)}
              asChild
            >
              {notification?.content}
            </Button>
          </DropdownMenuItem>
        ))}
        <Separator/>
        <DropdownMenuItem asChild>
          <Button variant={"destructive"} className="w-full" onClick={()=>setNotifications([])}>Clear</Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
