import { Button } from '@/components/ui/button'
import axios from 'axios';
import { cookies } from 'next/headers'
import Link from 'next/link'
import React from 'react'

function page() {
  axios.defaults.withCredentials = true;
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  console.log(token);

  return (
    <div className='m-4 flex gap-4'>
      <h1 className="text-2xl">{token === undefined ? "No Cookie" : token.value}</h1>
      <Button asChild>
      <Link className='' href={"/login"}>Login</Link>
      </Button>
      <Button asChild>
      <Link href={"/register"}>Register</Link>
      </Button>
    </div>
  )
}

export default page