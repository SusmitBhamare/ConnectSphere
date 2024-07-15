import axios from 'axios';
import React from 'react'
import { getToken, isLoggedIn } from './utils/jwtUtil';
import WebSocketProvider from '@/components/custom/WebSocketProvider';

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