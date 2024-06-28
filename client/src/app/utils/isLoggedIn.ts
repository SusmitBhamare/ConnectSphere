import { cookies } from "next/headers";

export function isLoggedIn(){
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  return token ? true : false;
}

export function getToken(){
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  return token;
}