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



function Chat({className} : {className? : string}) {
  return (
    <div className={cn(className, "min-h-full relative")}>
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
  );
}

export default Chat