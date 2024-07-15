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
import { getMembers, removeMember } from "@/app/chat/workspaceClient";
import { getUserById } from "@/app/register/registerClient";
import { Button } from "../ui/button";
import useUserStore from "@/app/zustand/store";
import { FaTrash } from "react-icons/fa6";
import { toast } from "sonner";
import AddMemberToWorkspace from "./AddMemberToWorkspace";
import { Workspace } from "@/app/types/Workspace";
import DeleteWorkspace from "./DeleteWorkspace";

const WorkspaceMember = ({
  workspace,
}: {
  workspace: Workspace | null;
}) => {
  const [open , setOpen] = useState<boolean>(false);
  const [members, setMembers] = useState<User[]>([]);
  const [mod, setMod] = useState<User | null>(null);
  
  const { user, token, fetchUser , onlineMembers } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (workspace && token) {
      getMembers(workspace.id, token).then((data) => {
        setMembers(data);
      });

      getUserById(workspace.createdBy, token).then((data) => {
        setMod(data);
      });
    }
  }, [workspace]);

  async function removeMemberHandler(id: string) {
    if(workspace){
      if(await removeMember(workspace?.id , id , token)){
        getMembers(workspace?.id , token).then((data)=>{
          setMembers(data);
        })
        toast.success("Member removed successfully");
      } else{
        toast.error("Error removing member");
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <h1 className="font-primary text-lg cursor-pointer">
          {workspace?.name}
        </h1>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Workspace Members</DialogTitle>
        <Separator />
        <div className="flex flex-col gap-2">
          <div className="flex gap-4 relative items-center mb-2">
            <Avatar className="rounded-full ring ring-primary/50">
              <AvatarImage
                className="rounded-full h-16 w-16"
                src={workspace?.image || ""}
                alt="@shadcn"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div
              className={`absolute bottom-0 left-0 w-2 border-0.5 border-primary h-2 rounded-full ${
                onlineMembers?.includes(mod ? mod?.username : "")
                  ? "bg-green-600"
                  : "bg-red-600"
              }`}
            ></div>

            <div className="w-full">
              <div className="flex w-full justify-between text-sm items-center">
                <h1>{mod?.name}</h1>
                <Badge variant={"outline"}>Moderator</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{mod?.username}</p>
            </div>
          </div>
          {members &&
            members.map((member) => (
              <div className="flex gap-2 justify-between items-center">
                <div className="flex gap-4 relative items-center">
                  <Avatar className="rounded-full ring ring-primary/50">
                    <AvatarImage
                      className="rounded-full h-6 w-6"
                      src={member?.image || ""}
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute bottom-0 left-0 w-2 border-0.5 border-primary h-2 rounded-full ${
                      onlineMembers?.includes(member.username)
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  ></div>
                  <div>
                    <h1 className="text-sm">{member.name}</h1>
                    <p className="text-xs text-muted-foreground">
                      {member.username}
                    </p>
                  </div>
                </div>
                {user?.role === "MOD" && member.username !== user.username && (
                  <Button
                    size={"icon"}
                    onClick={() => removeMemberHandler(member.id)}
                    variant={"destructive"}
                  >
                    <FaTrash />
                  </Button>
                )}
              </div>
            ))}
        </div>
        {user && user.role === "MOD" && (
          <div>
            <Separator />
            <DialogFooter className="w-full flex items-center">
              <AddMemberToWorkspace
                workspaceId={workspace?.id}
                setMembers={setMembers}
                members={members}
              />
              <DeleteWorkspace
                workspace={workspace}
                open={open}
                setOpen={setOpen}
              />
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WorkspaceMember;
