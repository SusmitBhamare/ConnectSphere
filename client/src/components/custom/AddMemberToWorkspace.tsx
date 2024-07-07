"use client";
import React, { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { User } from "@/app/types/User";
import { debounce, set } from "lodash";
import { getUser } from "@/app/register/registerClient";
import useUserStore from "@/app/zustand/store";
import { FaTrash } from "react-icons/fa6";
import { addMembers, getMembers } from "@/app/chat/workspaceClient";
import { toast } from "sonner";

function AddMemberToWorkspace({ workspaceId , setMembers ,  members }: { workspaceId : string | undefined , setMembers: (members : User[]) => void , members: User[] }) {
  const [open , setOpen] = useState<boolean>(false);
  const [searchUser, setSearchUser] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const cookie = useUserStore((state) => state.token);
  const loggedUser = useUserStore((state) => state.user?.username);

  const addAllMembers = async () => {
    const userIds = selectedUsers.map((user) => user.id);

    if(await addMembers(workspaceId , userIds  , cookie)){
      toast.success("Members added successfully");
      setSelectedUsers([]);
      if(workspaceId){
        getMembers(workspaceId , cookie).then((data) => setMembers(data));
      }
      setOpen(false);
    } else{
      toast.error("Error adding members");
    }
  };

  const addMemberHandler = (user : User) => {
    setSelectedUsers((prev) => [...prev, user]);
    setSearchUser((prev) => prev.filter((u) => u.username !== user.username));
    setCurrentUser("");
  };

  const removeFromSelectedUsers = (user: User) => {
    setSelectedUsers((prev) => prev.filter((u) => u.username !== user.username));
  };

  const debouncedResults = useCallback(
    debounce(async (username: string) => {
      const result = await getUser(username, cookie ? cookie : "");
      const userExistsInSelectedUsers = selectedUsers.some(
        (user) => user.username === result?.username
      );
      const userExistsInMembers = members.some(
        (user) => user.username === result?.username
      );
      if (result) {
        if (
          result.username === username &&
          username !== loggedUser &&
          !userExistsInSelectedUsers &&
          !userExistsInMembers
        ) {
          setSearchUser((prev) => [...prev, result]);
        }
      } else {
        setSearchUser([]);
      }
    }, 500),
    []
  );

  const searchUserHandler = async (username: string) => {
    setCurrentUser(username);
    debouncedResults(username);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-1/2" size={"sm"}>
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add Member</DialogTitle>
        <Command>
          <CommandInput
            placeholder="Search user"
            value={currentUser}
            onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) =>
              searchUserHandler(e.target.value)
            }
          />
          <CommandSeparator />
          <CommandList>
            <CommandGroup heading="Search Results">
              <CommandEmpty>No users found</CommandEmpty>
              {searchUser.map((user) => (
                <CommandItem key={user.id} value={user.username} asChild>
                  <div onClick={() => addMemberHandler(user)}>
                    <h1>{user.username}</h1>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Selected Users">
              <CommandEmpty>No users added</CommandEmpty>
              {selectedUsers.map((user) => (
                <CommandItem key={user.id} value={user.username} asChild>
                  <div>
                    <h1 className="w-full">{user.username}</h1>
                    <Button
                      variant="destructive"
                      size={"icon"}
                      type="button"
                      onClick={() => removeFromSelectedUsers(user)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <Button className="my-4" type="submit" onClick={()=>addAllMembers()}>
          Add
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default AddMemberToWorkspace;
