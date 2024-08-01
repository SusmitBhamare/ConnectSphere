"use client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BsBellFill } from "react-icons/bs";
import useUserStore from "@/app/zustand/store";
import { addUsersInteracted } from "../client/userClient";
import { MessageResponse } from "@/app/types/Message";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { getNotifications } from "../client/messageClient";
import { toast } from "sonner";
import { MdFileCopy, MdImage } from "react-icons/md";

const Notifications = () => {
  const router = useRouter();
  const { fetchUser, token, user, notifications, setNotifications } =
    useUserStore();
  const [isPulsing, setIsPulsing] = useState<boolean>(false);

  useEffect(() => {
    handleMissedNotification();
    fetchUser();
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      setIsPulsing(true);
    } else {
      setIsPulsing(false);
    }
  }, [notifications]);

  async function handleMissedNotification() {
    if (!user) return;
    getNotifications(token, user?.id)
      .then((res) => {
        if (res.length === 0) return;
        setNotifications((prevNotifications) => [...res , ...prevNotifications]);
      })
      .catch((e) => {
        toast.error("Error fetching notifications");
      });
  }

  function handleNotificationClick(notification: MessageResponse) {
    setNotifications(notifications.filter((n) => n.id !== notification.id));
    router.push(
      notification.workspaceId
        ? "chat?workspace=" + notification.workspaceId.id
        : "chat?user=" + notification.sender?.id
    );
  }

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
          {isPulsing && (
            <div className="w-2 h-2  rounded-full bg-red-500 absolute bottom-0 right-0 animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="text-white">
          Notifications
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {notifications.map((notification) => (
          <>
            <DropdownMenuItem
              className="text-white max-w-64"
              key={notification.id}
              asChild
            >
              <Button
                variant={"ghost"}
                onClick={() => handleNotificationClick(notification)}
                className="flex flex-col justify-start items-start w-full h-max"
              >
                <h1 className="text-primary text-xs">
                  {notification.sender.name} has sent a message
                  {notification.workspaceId &&
                    " in " + notification.workspaceId.name}
                </h1>
                <p className="text-foreground flex gap-2 items-center text-balance line-clamp-2">
                  {notification.content}
                  {notification.attachment &&
                    (notification.attachment.type === "image" ? (
                      <MdImage />
                    ) : (
                      <MdFileCopy />
                    ))}
                </p>
              </Button>
            </DropdownMenuItem>
          </>
        ))}
        <Separator />
        <DropdownMenuItem>
          <Button
            variant={"destructive"}
            className="w-full"
            size={"lg"}
            onClick={() => setNotifications([])}
          >
            Clear
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
