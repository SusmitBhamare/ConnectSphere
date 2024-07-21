"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { MdAttachment } from "react-icons/md";
import { useDropzone } from "@uploadthing/react/hooks";
import { Progress } from "../ui/progress";

function AttachmentModal({
  setAttachment,
  attachment,
}: {
  attachment: File | null;
  setAttachment: React.Dispatch<React.SetStateAction<File | null>>;
}) {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const simulatedProgress = () => {
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 1000);
    return interval;
  };



  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop: (file) => handleSubmit(file),
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
    },
    multiple: false,
    maxFiles: 1,
  });

    const handleSubmit = (file:File[]) => {
      const interval = simulatedProgress();
      setProgress(100);
      console.log(file);
      setAttachment(file[0]);
      setOpen(false);
    };

    const removeFile = () => {
      acceptedFiles.pop();
      setAttachment(null);
      setProgress(0);
    };

  return (
    <Dialog onOpenChange={() => setOpen(!open)} open={open}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <MdAttachment />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-3">Attach Files</DialogTitle>
          <DialogDescription>
            <div className="cursor-pointer" {...getRootProps()}>
              <input {...getInputProps()} />
              <div className="w-full flex flex-col justify-center gap-2 items-center border-2 border-primary/5 p-16">
                <h1 className="text-xl md:text-2xl font-semibold text-primary">
                  Drop your Files
                </h1>
                <p className="text-muted-foreground">
                  .png .jpg .jpeg .pdf .txt supported
                </p>
                <div className="w-full text-center my-4">
                  {<Progress value={progress} className="mb-2" />}
                  {progress === 100 ? (
                    <p>File Uploaded Successfully</p>
                  ) : (
                    <p>{progress}% done</p>
                  )}
                </div>
                
              </div>
              <div></div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AttachmentModal;
