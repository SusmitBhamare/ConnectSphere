"use client";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import useUserStore from "@/app/zustand/store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Notifications from "./Notifications";

function Home() {
  const { token, setOnlineMembers, fetchUser, onlineMembers, user } =
    useUserStore();
  const stompClient = useUserStore((state) => state.stompClient);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const logoutHandler = () => {
    axios
      .post(
        "http://localhost:3000/api/user/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        useUserStore.getState().setToken(null);
        useUserStore.getState().setNotifications([]);
        router.push("/login");
        toast.success("Logged out successfully");
      })
      .catch((e) => {
        useUserStore.getState().setToken(null);
        toast.error("Error logging out");
      });
  };

  return !token || !user ? (
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
    <div className="flex gap-2 items-center">
    <Notifications/>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="ring-1 ring-primary/20">
          <AvatarImage src={user?.image ?? ""} />
          <AvatarFallback>{user?.name.toUpperCase()[0]}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href={"/settings"}>Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button variant={"ghost"} onClick={logoutHandler}>
            Logout
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  );
}

export default Home;
