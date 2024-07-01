import React from 'react'
import { getToken, isLoggedIn } from '../utils/jwtUtil'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/custom/Sidebar'
import Chat from '@/components/custom/Chat'
import ChatPage from './ChatPage'

function page() {
  if(!isLoggedIn()){
    redirect("/login")
  } 
  const cookie = getToken()?.value;
  return (
    <ChatPage cookie={cookie}/>
  )
}

export default page