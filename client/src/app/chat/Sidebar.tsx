"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import WorkspaceModel from "./WorkspaceModel";
import ChatSkeleton from "./ChatSkeleton";
import useUserStore from "@/app/zustand/store";
import { Workspace } from "@/app/types/Workspace";
import { useRouter } from "next/navigation";
import { User } from "@/app/types/User";
import { getUser } from "../client/userClient";
import { debounce } from "lodash";
import { MessageResponse } from "@/app/types/Message";
import { getMessagesForUser } from "../client/messageClient";
import { cn } from "@/lib/utils";


function Sidebar({
  selectChat,
  setSelectChat,
  selectedChat,
  setSelectedChat,
  className
}: {
  selectChat : boolean,
  setSelectChat: (selectChat: boolean) => void;
  selectedChat: Workspace | User | null;
  setSelectedChat: (workspace: Workspace | User) => void;
  className?: string;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [workspaceCreated, setWorkspaceCreated] = useState(false);
  const [isActive, setIsActive] = useState<string>("");
  const { fetchUser, user, token, onlineMembers } = useUserStore();
  const [searchUser, setSearchUser] = useState<string>("");
  const [searchedUser, setSearchedUser] = useState<User | null>(null);
  const [lastMessages, setLastMessages] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleGetLastMessage = async (userId: string) => {
    if (!user) return;
    const res: MessageResponse[] = await getMessagesForUser(
      user.id,
      userId,
      token
    );
    if (res) {
      res.forEach((message) => {
        message.createdAt = new Date(message.createdAt);
      });
      res.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      const lastMessage = res.length > 0 ? res[0].content : "";
      setLastMessages((prevMessages) => ({
        ...prevMessages,
        [userId]: lastMessage,
      }));
    }
  };

  const debouncedResults = useCallback(
    debounce(async (username: string) => {
      const result = await getUser(username, token ? token : "");
      if (result) {
        if (result.username === username && username !== user?.username) {
          setSearchedUser(result);
        }
      } else {
        setSearchedUser(null);
      }
    }, 500),
    [token, user]
  );

  const searchUserHandler = async (username: string) => {
    if (user?.usersInteractedWith.some((u) => u.username === username)) {
      setSearchUser(username);
    } else {
      setSearchUser(username);
      debouncedResults(username);
    }
  };

  const handleSelectChat = (workspaceId: string, workspace: Workspace) => {
    setSelectedChat(workspace);
    router.push("?workspace=" + workspaceId, { scroll: false });
    setSelectChat(true);
  };

  const handleUserChat = (userId: string, user: User) => {
    setSelectedChat(user);
    router.push("?user=" + userId, { scroll: false });
    setSelectChat(true);
  };

  useEffect(() => {
    if (selectedChat && selectedChat.id !== isActive) {
      setIsActive(selectedChat.id);
    }
  }, [selectedChat, isActive]);

  useEffect(() => {
    if (user?.usersInteractedWith && user.usersInteractedWith.length > 0) {
      user.usersInteractedWith.forEach((u) => handleGetLastMessage(u.id));
    }
    if (searchedUser) {
      handleGetLastMessage(searchedUser.id);
    }
  }, [user, searchedUser]);

  useEffect(() => {
    fetchUser();
    setIsLoading(false);
  }, [workspaceCreated, fetchUser]);

  return (
    <div className={cn("flex flex-col min-h-full w-full justify-between items-center shadow-lg" , className)}>
      <div className="flex flex-col w-full items-center">
        <Input
          value={searchUser}
          onChange={(e) => searchUserHandler(e.target.value)}
          type="search"
          className="my-2 rounded-full"
          placeholder="Search for users or workspaces"
        />
        {searchedUser && (
          <UserChat
            lastMessage={lastMessages[searchedUser.id]}
            user={searchedUser}
            isActive={isActive === searchedUser.id}
          />
        )}

        {user?.usersInteractedWith.map((user) => (
          <UserChat
            key={user.id}
            user={user}
            lastMessage={lastMessages[user.id]}
            isActive={isActive === user.id}
          />
        ))}

        {isLoading && (
          <div>
            <ChatSkeleton />
            <ChatSkeleton />
            <ChatSkeleton />
            <ChatSkeleton />
          </div>
        )}

        {user?.workspaces &&
          user.workspaces.map((workspace: Workspace) => (
            <WorkspaceChat
              key={workspace?.id}
              workspace={workspace}
              isActive={isActive === workspace?.id}
            />
          ))}
      </div>

      {user && user.role === "MOD" && (
        <WorkspaceModel setWorkspaceCreated={setWorkspaceCreated} />
      )}
    </div>
  );

  function WorkspaceChat({
    workspace,
    isActive,
  }: {
    workspace: Workspace;
    isActive: boolean;
  }) {
    return (
      <div
        onClick={() => {
          handleSelectChat(workspace?.id, workspace);
        }}
        className={`${
          isActive ? "bg-primary/30" : "bg-zinc-900"
        } h-max w-full flex flex-row items-center px-4 gap-3 py-2 cursor-pointer`}
      >
        <Avatar className="rounded-full ring ring-primary/50">
          <AvatarImage
            className="rounded-full w-8"
            src={workspace?.image}
            alt={workspace?.name}
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h1>{workspace?.name}</h1>
          <p className="text-muted-foreground text-xs">
            Sounds good! Thank you
          </p>
        </div>
      </div>
    );
  }

  function UserChat({
    user,
    isActive,
    lastMessage,
  }: {
    user: User;
    isActive: boolean;
    lastMessage?: string;
  }) {
    return (

          <div
            onClick={() => {
              handleUserChat(user.id, user);
            }}
            className={`${
              isActive ? "bg-primary/30" : "bg-zinc-950"
            } h-max w-full flex flex-row items-center px-4 gap-3 py-2 relative`}
          >
            <div className="relative">
              <Avatar className="ring-1 ring-primary/20">
                <AvatarImage
                  src={user.image ? user.image : ""}
                  alt={user.name}
                />
                <AvatarFallback>
                  {user.name.toUpperCase()[0] + user.name.toUpperCase()[1]}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute bottom-0 left-1 w-2 border-0.5 border-primary h-2 rounded-full ${
                  onlineMembers?.includes(user.username)
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              ></div>
            </div>
            <div>
              <h1>{user.name}</h1>
              {lastMessage && (
                <p className="text-muted-foreground text-sm">{lastMessage}</p>
              )}
            </div>
          </div>

    );
  }
}

export default Sidebar;
