import { cn } from '@/lib/utils'
import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { RiSendPlaneFill } from "react-icons/ri";
import { MdAttachment } from "react-icons/md";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import WorkspaceMember from './WorkspaceMember';



function Chat({className , selectedChat , cookie } : {className? : string , cookie:string | undefined , selectedChat : Workspace | null}) {
  return (
    <div className={cn(className, "min-h-full relative")}>
      {selectedChat ? (
        <div>
          <div className="shadow-2xl border-b-2 border-zinc-600/5 py-4 px-4 flex gap-5">
            <Avatar className="rounded-full ring ring-primary/50">
              <AvatarImage
                className="rounded-full h-16 w-16"
                src={selectedChat.image}
                alt="@shadcn"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <WorkspaceMember cookie={cookie} workspace={selectedChat}/>
          </div>
          <div className="absolute w-full bottom-0">
            <div className="rounded-full mx-32 mb-4 flex gap-2">
              <Input type="text" placeholder="Send a message" />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant={"secondary"}>
                      <MdAttachment />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Attach files</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button>
                      <RiSendPlaneFill />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Send Message</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-center text-2xl mt-32 text-muted-foreground">
            Select a chat to start messaging
          </h1>
        </div>
      )}
    </div>
  );
}

export default Chat