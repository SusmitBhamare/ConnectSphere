"use client";
import React from "react";
import { Button } from "../ui/button";
import { HiPlusCircle } from "react-icons/hi2";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  workspaceSchema,
  WorkspaceSchema,
} from "@/lib/schemas/createWorkspaceSchema";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { getUser } from "@/app/register/registerClient";
import { useCallback } from "react";
import { debounce } from "lodash";
import { Label } from "../ui/label";
import { FaTrash } from "react-icons/fa6";
import { createWorkspace } from "@/app/chat/workspaceClient";
import { User } from "@/app/types/User";
import useUserStore from "@/app/zustand/store";
import { toast } from "sonner";


function WorkspaceModel({ setWorkspaceCreated }: { setWorkspaceCreated : (value : boolean) => void}) {
  const [searchUser, setSearchUser] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<WorkspaceSchema>({
    resolver: zodResolver(workspaceSchema),
  });

  const cookie = useUserStore((state) => state.token);
  const loggedUser = useUserStore((state) => state.user?.username);

  const debouncedResults = useCallback(
    debounce(async (username: string) => {
      const result = await getUser(username , cookie ? cookie : "");
      if (result) {
        if (
          result.username === username &&
          username !== loggedUser &&
          !selectedUsers.includes(result)
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

  const addToSelectedUsers = (data: User) => {
    setSelectedUsers((prev) => [...prev, data]);
    setSearchUser(searchUser.filter((user) => user.username !== data.username));
  };

  const removeFromSelectedUsers = (data : User) => {
    setSelectedUsers(selectedUsers.filter((user) => user.username !== data.username));
  };

  const createWorkspaceHandler: SubmitHandler<WorkspaceSchema> = async (data) => {
    const userIds = selectedUsers.reduce((acc , user) => {acc.push(user.id); return acc} , [] as string[]);
      if(userIds.length === 0){
        toast.error("Please add atleast one user to the workspace");
        return;
      }
      if(await createWorkspace({ ...data, members: userIds } ,cookie ? cookie : "")){
        form.reset({
          name: "",
          description : "",
        });
        setWorkspaceCreated(true);
        setCurrentUser("");
        setSelectedUsers([]);
        setOpen(false);
      }
      

  };

  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full flex gap-2 items-center"
          variant={"secondary"}
        >
          Create a new workspace
          <HiPlusCircle className="text-2xl" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2">Add a new workspace</DialogTitle>
          <Separator />
          <DialogDescription>
            <Form {...form}>
              <form
                className="px-2 w-full"
                onSubmit={form.handleSubmit(createWorkspaceHandler)}
              >
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">Name</FormLabel>
                      <FormControl>
                        <Input className="mt-2 w-full" id="name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="description">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          className="mt-2 w-full"
                          id="description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Label htmlFor="user">Users</Label>
                <Command>
                  <CommandInput asChild>
                    <Input
                      id="user"
                      type="search"
                      value={currentUser}
                      className="w-full"
                      onChange={(e) => searchUserHandler(e.target.value)}
                    />
                  </CommandInput>
                  <CommandList>
                    <CommandGroup title="Users">
                      {searchUser?.map((user) => (
                        <CommandItem
                          key={user.id}
                          value={user.username}
                          asChild
                        >
                          <Button
                            className="w-full"
                            variant="outline"
                            type="button"
                            onClick={() => addToSelectedUsers(user)}
                          >
                            {user.username}
                          </Button>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>

                <Separator />
                <div className="mt-4 flex flex-col gap-2">
                  {selectedUsers.map((user) => (
                    <div className="w-full flex gap-2">
                      <h1 className="text-sm flex-1">{user.username}</h1>
                      <Button
                        type="button"
                        onClick={() => removeFromSelectedUsers(user)}
                        variant={"destructive"}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button className="my-4" type="submit">
                  Create
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
        <DialogClose asChild>
          <Button type="button" className="hidden" id="closeDialog">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default WorkspaceModel;
