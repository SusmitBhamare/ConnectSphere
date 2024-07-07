"use client"
import { Workspace } from '@/app/types/Workspace'
import React, { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { Button } from '../ui/button';
import { deleteWorkspace } from '@/app/chat/workspaceClient';
import { toast } from 'sonner';
import useUserStore from '@/app/zustand/store';

function DeleteWorkspace({workspace , open , setOpen} : {workspace : Workspace | null , open : boolean , setOpen : (open : boolean) => void}) {
  const {fetchUser , token} = useUserStore();
  const [alertOpen , setAlertOpen] = useState<boolean>(false);


  const removeWorkspace = async () => {
    if(workspace){
      if(await deleteWorkspace(workspace?.id , token)){
        toast.success("Workspace deleted successfully");
        fetchUser();
        setAlertOpen(false);
        setOpen(false);
      } else{
        toast.error("Error deleting workspace");
      }
    }
  }

  return (
    <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
      <AlertDialogTrigger asChild>
        <Button className="w-1/2" variant={"destructive"} size={"sm"}>
          Delete Workspace
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the workspace.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild> 
            <Button variant={"destructive"} onClick={()=>removeWorkspace()}>
              Continue
              </Button></AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteWorkspace