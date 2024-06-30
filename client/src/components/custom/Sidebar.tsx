import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import React from 'react'
import { Input } from '../ui/input';
import { getAuth, getToken } from '@/app/utils/jwtUtil';
import WorkspaceModel from './WorkspaceModel';


async function Sidebar() {
  let user;
  try{
    user = await getAuth();
  } catch(e){
    user = null;
  }
  console.log(user);
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
        {
          user?.workspaces &&  user.workspaces.map((workspace : Workspace) => (
            <WorkspaceChat name={workspace.name} url={workspace.image} />
          ))
        }
      </div>


      {user && user.role === "MOD" && (
        <WorkspaceModel loggedUser={user.username} cookie={cookie}/>
      )}
    </div>
  );

  function WorkspaceChat({name , url } : {name : string, url : string}){
       return (
         <div
           className=
             {"bg-zinc-900 h-max w-full flex flex-row items-center px-4 gap-3 py-2"}
         >
           <Avatar className="rounded-full ring ring-primary/50">
             <AvatarImage
               className="rounded-full w-8"
               src={url}
               alt="@shadcn"
             />
             <AvatarFallback>CN</AvatarFallback>
           </Avatar>
           <div>
             <h1>{name}</h1>
             <p className="text-muted-foreground text-xs">
               Sounds good ! Thank you
             </p>
           </div>
         </div>
       );
  }

  function UserChat({isActive} : {isActive : boolean}) {
    return <div className={`${isActive ? "bg-primary/30" : "bg-zinc-900"} h-max w-full flex flex-row items-center px-4 gap-3 py-2`}>
      <Avatar className='rounded-full ring ring-primary/50'>
        <AvatarImage className='rounded-full w-8' src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>
        <h1>Ruchita Parekh</h1>
        <p className='text-muted-foreground text-xs'>Sounds good ! Thank you</p>
      </div>
    </div>;
  }
}

export default Sidebar