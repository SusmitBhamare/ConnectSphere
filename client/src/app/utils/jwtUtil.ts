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

export function extractClaims(token: string | undefined) {
  if (token) {
    const claims = jwt.decode(token);
    return claims;
  }
  return null;
}


export async function getAuth() {
  const token = getToken()?.value;
  if (token) {
    try {
      const response = await axios.get(url + "/profile", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      return response.data;
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 404) {
        return null;
      }
    }
  }
}
