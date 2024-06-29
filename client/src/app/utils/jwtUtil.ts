import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getUser } from "../register/registerClient";

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

export function extractClaims(token : string | undefined){
  if(token){
    const claims = jwt.decode(token);
    return claims;
  }
  return null;
}


export async function getAuth(){
  const claims: null | jwt.JwtPayload | string = extractClaims(
    getToken()?.value ?? ''
  );

  let user;
  if (claims && typeof claims === "object") {
    if (claims.sub) {
      user = await getUser(claims.sub);
    }
  }
  return user;
}