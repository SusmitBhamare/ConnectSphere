"use client"
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaBarsStaggered } from "react-icons/fa6";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import useUserStore from "@/app/zustand/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

function ResponsiveNavbar() {
  const { token, user, fetchUser } = useUserStore();
  const router = useRouter();
  useEffect(() => {
    fetchUser();
  }, []);

    const logoutHandler = () => {
      axios
        .post(
          process.env.NEXT_PUBLIC_FRONTEND_URL + "/api/user/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          useUserStore.getState().setToken(null);
          router.push("/login");
          toast.success("Logged out successfully");
        })
        .catch((e) => {
          useUserStore.getState().setToken(null);
          toast.error("Error logging out");
        });
    };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"default"} className="md:hidden">
          <FaBarsStaggered />
        </Button>
      </SheetTrigger>
      <SheetContent className="dark md:hidden">
        <SheetHeader>
          <SheetTitle></SheetTitle>
          <SheetDescription className="">
            {!token ? (
              <div className="flex flex-col gap-2 ">
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
              <div className="flex flex-col items-center justify-center gap-6">
                <div className="flex flex-col items-center justify-center gap-2">
                <Avatar className="ring-1 ring-primary/20">
                  <AvatarImage src={user?.image ?? ""} />
                  <AvatarFallback>{user?.name.toUpperCase()[0]}</AvatarFallback>
                </Avatar>
                <div>
                <h1 className="text-2xl">{user?.name}</h1>
                <h1 className="text-muted-foreground text-sm">{user?.username}</h1>
                <p className="text-slate-600 text-xs">{user?.email}</p>
                </div>
                </div>
                <Separator/>
                <div className="flex flex-col items-center justify-center gap-2">
                <Link href={"/settings"}>Settings</Link>
                <Button variant={"ghost"} onClick={logoutHandler}>
                  Logout
                </Button>
                </div>
              </div>
            )}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default ResponsiveNavbar;
