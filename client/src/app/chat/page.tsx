import React from 'react'
import { isLoggedIn } from '../utils/isLoggedIn'
import { redirect } from 'next/navigation'

function page() {
  if(!isLoggedIn()){
    redirect("/login")
  } 
  return (
    <div>Chat with us</div>
  )
}

export default page