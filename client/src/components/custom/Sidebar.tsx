"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useCallback, useEffect, useState } from "react";
import { Input } from "../ui/input";
import WorkspaceModel from "./WorkspaceModel";
import ChatSkeleton from "./ChatSkeleton";
import useUserStore from "@/app/zustand/store";
import { Workspace } from "@/app/types/Workspace";
import { useRouter } from "next/navigation";
import { User } from "@/app/types/User";
import { getUser, getUserById } from "@/app/register/registerClient";
import { debounce } from "lodash";

function Sidebar({
  selectedChat,
  setSelectedChat,
}: {
  selectedChat: Workspace | User | null;
  setSelectedChat: (workspace: Workspace | User) => void;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [workspaceCreated, setWorkspaceCreated] = useState(false);
  const [isActive, setisActive] = useState<string>("");
  const { fetchUser, user, token } = useUserStore();
  const [searchUser, setSearchUser] = useState<string>("");
  const [searchedUser, setSearchedUser] = useState<User | null>(null);
  const router = useRouter();

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
    []
  );

  const searchUserHandler = async (username: string) => {
    setSearchUser(username);
    debouncedResults(username);
  };

  const handleSelectChat = (workspaceId: String, workspace: Workspace) => {
    setSelectedChat(workspace);
    router.push("?workspace=" + workspaceId, { scroll: false });
  };

  const handleUserChat = (userId: String, user: User) => {
    setSelectedChat(user);
    router.push("?user=" + userId, { scroll: false });
  };

  useEffect(() => {
    if (selectedChat && selectedChat.id !== isActive) {
      setisActive(selectedChat.id);
    }
  }, [selectedChat, isActive]);


  useEffect(() => {
    fetchUser();
    setIsLoading(false);
  }, [workspaceCreated]);

  return (
    <div className="flex flex-col min-h-full w-full justify-between items-center  shadow-lg">
      <div className="flex flex-col w-full items-center">
        <Input
          value={searchUser}
          onChange={(e) => searchUserHandler(e.target.value)}
          type="search"
          className="my-2 rounded-full"
          placeholder="Search for users or workspaces"
        />
        {searchedUser && <UserChat user={searchedUser} isActive={false} />}


        {user?.usersInteractedWith.map((user) => {
          return <UserChat user={user} isActive={isActive === user.id} />;
        })}

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
          console.log("clicked");
          handleSelectChat(workspace.id, workspace);
        }}
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

  function UserChat({ user, isActive }: { user: User; isActive: boolean }) {
    return (
      <div
        onClick={() => {
            handleUserChat(user?.id, user);
        }}
        className={`${
          isActive ? "bg-primary/30" : "bg-zinc-900"
        } h-max w-full flex flex-row items-center px-4 gap-3 py-2`}
      >
        <Avatar className="rounded-full ring ring-primary/50">
          <AvatarImage
            className="rounded-full w-8"
            src={user.image ? user.image : ""}
            alt="@shadcn"
          />
          <AvatarFallback>{user.name.toUpperCase()[0] + user.name.toUpperCase()[2]}</AvatarFallback>
        </Avatar>
        <div>
          <h1>{user.name}</h1>
        </div>
      </div>
    );
  }
}

export default Sidebar;
