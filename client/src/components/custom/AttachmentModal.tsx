"use client"
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '../ui/button';
import { MdAttachment } from 'react-icons/md';
import Dropzone from "react-dropzone-uploader";
import { toast } from 'sonner';


function AttachmentModal({setAttachment} : {setAttachment: React.Dispatch<React.SetStateAction<File | null>>}) {
  const [open , setOpen] = useState(false);
  const handleSubmit = (files: any) => {
    setAttachment(files[0].file);
    console.log(files[0].file);
    setOpen(false);
  };

  return (
    <Dialog onOpenChange={()=>setOpen(!open)} open={open}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <MdAttachment />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-3">Attach Files</DialogTitle>
          <DialogDescription>
            <Dropzone
              maxFiles={1}
              onSubmit={handleSubmit}
              classNames={{
                dropzone: "p-4 w-full min-h-56 ring-1 ring-primary/10 rounded-md text-center flex flex-col justify-center items-center",
                input: "hidden",
                inputLabel : "font-bold text-xl md:text-2xl w-full",
                dropzoneActive: "bg-primary/10 transition-all",
                preview : "m-2 rounded-md p-2 text-semibold text-base md:text-lg w-full",
                dropzoneDisabled : "cursor-not-allowed opacity-50",
                previewImage : "rounded-md h-20 w-20 md:h-32 md:w-32",
                submitButtonContainer : "w-full",
                submitButton : "bg-primary p-2 rounded-md w-max text-white",
              }}
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AttachmentModal