import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import axios from "axios";

const url = 'http://localhost:8081/util';

export function isLoggedIn() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  return token ? true : false;
}

export function getToken() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  return token;
}


export async function getCurrentUser(token : string | undefined) {
  if(!token) return null;
  try {
    const response = await axios.get(url + "/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    return response.data;
  } catch (e) {
    return null;
  }
}
