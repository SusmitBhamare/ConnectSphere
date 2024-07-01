"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { User } from "@/app/types/User";
import { getMembers } from "@/app/chat/workspaceClient";
import { getUserById } from "@/app/register/registerClient";
import { Button } from "../ui/button";
import useUserStore from "@/app/zustand/store";
import { FaTrash } from "react-icons/fa6";

const WorkspaceMember = ({
  workspace,
  cookie,
}: {
  workspace: Workspace | null;
  cookie: string | undefined;
}) => {
  const [members, setMembers] = useState<User[]>([]);
  const [mod, setMod] = useState<User | null>(null);
  const { user, token, fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (workspace) {
      getMembers(workspace.id, cookie).then((data) => {
        setMembers(data);
      });

      getUserById(workspace.createdBy, cookie).then((data) => {
        setMod(data);
      });
    }
  }, [workspace]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <h1 className="font-primary text-lg cursor-pointer">
          {workspace?.name}
        </h1>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Workspace Members</DialogTitle>
        <Separator />
        <div className="flex flex-col gap-2">
          <div className="flex gap-4 items-center mb-2">
            <Avatar className="rounded-full ring ring-primary/50">
              <AvatarImage
                className="rounded-full h-2 w-2"
                src={""}
                alt="@shadcn"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className="w-full">
              <div className="flex w-full justify-between text-sm items-center">
                <h1>{mod?.name}</h1>
                <Badge className="bg-destructive">Moderator</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{mod?.username}</p>
            </div>
          </div>
          {members &&
            members.map((member) => (
              <div className="flex gap-2 justify-between items-center">
                <div className="flex gap-4 items-center">
                  <Avatar className="rounded-full ring ring-primary/50">
                    <AvatarImage
                      className="rounded-full h-6 w-6"
                      src={member?.image || ""}
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-sm">{member.name}</h1>
                    <p className="text-xs text-muted-foreground">
                      {member.username}
                    </p>
                  </div>
                </div>
                {user?.role === "MOD" && member.username !== user.username && (
                  <Button size={"icon"} className="bg-destructive">
                    <FaTrash />
                  </Button>
                )}
              </div>
            ))}
        </div>
        <DialogFooter>
          <Button className="w-full" size={"sm"}>
            Add Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkspaceMember;
