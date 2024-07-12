"use client"
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import useUserStore from "@/app/zustand/store";


function Home() {
  const token = useUserStore((state) => state.token);
  const router = useRouter();
  const logoutHandler = () => {
    axios
      .post("http://localhost:3000/api/user/auth/logout" , {} , {
        headers : {
          Authorization : `Bearer ${token}`
        }
      })
      .then((res) => {
        useUserStore.getState().setToken(null);
        router.push("/login") ;
        toast.success("Logged out successfully");
      })
      .catch((e) => {
        toast.error("Error logging out");
      });
        
  };
  

  return (  
      !token ? (
        <div className="flex flex-col md:flex-row gap-2">
          <Button asChild>
            <Link className="" href={"/login"}>
              Login
            </Link>
          </Button>
          <Button asChild variant={"secondary"}>
            <Link href={"/register"}>Register</Link>
          </Button>
        </div>
      ) : (
        <Button onClick={logoutHandler}>Logout</Button>
      )
  );
}

export default Home;
