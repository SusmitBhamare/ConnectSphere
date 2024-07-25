"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { BsBellFill } from "react-icons/bs";
import useUserStore from "@/app/zustand/store";
import Link from "next/link";
import { addUsersInteracted } from "@/app/register/registerClient";

const Notifications = () => {
  const { fetchUser, token , user, notifications } = useUserStore();
  useEffect(() => {
    if (!user) return;
  }, []);

  useEffect(()=>{
    if(!user) return;
    for(let notification of notifications){
      const interactedIds = user?.usersInteractedWith.map(user => user.id);
      if(!notification.sender) continue;
      if(!interactedIds?.includes(notification.sender.id)){
        addUsersInteracted(token , user.id , {receiverId : notification.sender.id })
      }
    }
  } , [user , notifications])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={notifications.length === 0}
          className="rounded-full ring-2 ring-primary/5"
          variant={"ghost"}
          size={"icon"}
        >
          <BsBellFill />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {notifications.map((notification) => (
          <DropdownMenuItem className="text-white" key={notification?.id}>
            <Link
              href={`${
                notification.workspaceId
                  ? "chat?workspace=" + notification.workspaceId.id
                  : "chat?user=" + notification.sender?.id
              }`}
            >
              {notification?.content}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
