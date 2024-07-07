"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import WorkspaceModel from "./WorkspaceModel";
import ChatSkeleton from "./ChatSkeleton";
import useUserStore from "@/app/zustand/store";
import { Workspace } from "@/app/types/Workspace";

function Sidebar({
  setSelectedChat,
}: {
  setSelectedChat: (workspace: Workspace) => void;
}) {
  const [isLoading , setIsLoading] = useState<boolean>(true)
  const [workspaceCreated, setWorkspaceCreated] = useState(false);
  const [isActive, setisActive] = useState<string>("");
  const {fetchUser , user} = useUserStore();
  
  const handleSelectChat = (workspace: Workspace) => {
    setSelectedChat(workspace);
    setisActive(workspace?.id);
  };

  useEffect(() => {
    fetchUser();
    setIsLoading(false);
  }, [workspaceCreated , fetchUser]);
  

  return (
    <div className="flex flex-col min-h-full w-full justify-between items-center  shadow-lg">
      <div className="flex flex-col w-full items-center">
        <Input
          type="search"
          className="my-2 rounded-full"
          placeholder="Search for users or workspaces"
        />
        {/* <UserChat isActive={isActive} />
        <UserChat isActive={isActive} />
        <UserChat isActive={isActive} />
        <UserChat isActive={isActive} /> */}

        {isLoading && (
          <>
            <ChatSkeleton/>
            <ChatSkeleton/>
            <ChatSkeleton/>
            <ChatSkeleton/>
          </>
 
        )}

        {user?.workspaces &&
          user.workspaces.map((workspace: Workspace) => (
            <WorkspaceChat
              workspace={workspace}
              isActive={isActive === workspace?.id}
            />
          ))}
      </div>

      {user && user.role === "MOD" && (
        <WorkspaceModel
          setWorkspaceCreated={setWorkspaceCreated}
        />
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
        onClick={() => handleSelectChat(workspace)}
        className={`${
          isActive ? "bg-primary/30" : "bg-zinc-900"
        } h-max w-full flex flex-row items-center px-4 gap-3 py-2 cursor-pointer`}
      >
        <Avatar className="rounded-full ring ring-primary/50">
          <AvatarImage
            className="rounded-full w-8"
            src={workspace?.image}
            alt="@shadcn"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h1>{workspace?.name}</h1>
          <p className="text-muted-foreground text-xs">
            Sounds good ! Thank you
          </p>
        </div>
      </div>
    );
  }

  function UserChat({ isActive }: { isActive: boolean }) {
    return (
      <div
        className={`${
          isActive ? "bg-primary/30" : "bg-zinc-900"
        } h-max w-full flex flex-row items-center px-4 gap-3 py-2`}
      >
        <Avatar className="rounded-full ring ring-primary/50">
          <AvatarImage
            className="rounded-full w-8"
            src="https://github.com/shadcn.png"
            alt="@shadcn"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h1>Ruchita Parekh</h1>
          <p className="text-muted-foreground text-xs">
            Sounds good ! Thank you
          </p>
        </div>
      </div>
    );
  }
}

export default Sidebar;
