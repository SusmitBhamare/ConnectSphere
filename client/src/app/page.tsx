import Home from '@/components/custom/Home';
import axios from 'axios';
import { cookies } from 'next/headers'
import Link from 'next/link'
import React from 'react'
import { getToken, isLoggedIn } from './utils/isLoggedIn';
import Navbar from '@/components/custom/Navbar';

function page() {
  axios.defaults.withCredentials = true;
  let token:string | undefined = "";
  if(isLoggedIn()){
    token = getToken()?.value;  
  }
  return (
    <div>
    </div>
  )
}

export default page