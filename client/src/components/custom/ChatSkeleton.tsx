import React from 'react'
import { Skeleton } from '../ui/skeleton';

const ChatSkeleton = () => {
  return (
    <div className="bg-zinc-900 h-max w-full flex flex-row items-center px-4 gap-3 py-2 cursor-pointer">
      <div className="flex items-center space-x-4">
        <div className="rounded-full ring ring-primary/50">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </div>
  );
}

export default ChatSkeleton