import React from 'react'
import Home from './Home'
import { getToken } from '@/app/utils/jwtUtil'
import ResponsiveNavbar from './ResponsiveNavbar';


function Navbar() {
  return (
    <nav className='fixed inset-0 py-8 px-16 backdrop-blur-md bg-inherit  max-w-screen h-12 shadow-mg flex justify-between items-center z-10 shadow-2xl'>
      <h1 className='text-2xl font-display'>ConnectSphere</h1>
      <div className='hidden md:flex flex-row gap-2'>
        <Home/>
      </div>
      <ResponsiveNavbar/>

      
    </nav>
  )
}

export default Navbar