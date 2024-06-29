import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import React from 'react'
import { Input } from '../ui/input';
import { getAuth, getToken } from '@/app/utils/jwtUtil';
import WorkspaceModel from './WorkspaceModel';




async function Sidebar() {
  const user = await getAuth();
  const cookie = getToken()?.value;
  return (
    <div className="flex flex-col min-h-full w-full justify-between items-center  shadow-lg">
      <div className="flex flex-col w-full items-center">
        <Input
          type="search"
          className="my-2 rounded-full"
          placeholder="Search for users or workspaces"
        />
        <UserChat isActive={false} />
        <UserChat isActive={false} />
        <UserChat isActive={false} />
        <UserChat isActive={true} />
      </div>

      {user.role === "MOD" && (
        <WorkspaceModel loggedUser={user.username} cookie={cookie}/>
      )}
    </div>
  );

  function UserChat({isActive} : {isActive : boolean}) {
    return <div className={`${isActive ? "bg-primary/30" : "bg-zinc-900"} h-max w-full flex flex-row items-center px-4 gap-3 py-2`}>
      <Avatar className='rounded-full ring ring-primary/50'>
        <AvatarImage className='rounded-full w-8' src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>
        <h1>Ruchita Parekh</h1>
        <p className='text-muted-foreground text-xs'>Last online 4d ago</p>
      </div>
    </div>;
  }
}

export default Sidebar