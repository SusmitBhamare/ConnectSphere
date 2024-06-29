import React from 'react'
import { isLoggedIn } from '../utils/jwtUtil'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/custom/Sidebar'
import Chat from '@/components/custom/Chat'

function page() {
  if(!isLoggedIn()){
    redirect("/login")
  } 
  return (
    <div className='max-w-screen h-[90vh] grid grid-cols-4 mt-16'>
        <Sidebar/>
        <Chat className='col-span-3'/>
    </div>
  )
}

export default page