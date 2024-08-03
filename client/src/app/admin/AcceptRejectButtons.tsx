"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { MdCheck } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { User } from "../types/User";
import { toast } from "sonner";
import { acceptModRequest, rejectModRequest } from "../client/userClient";
import useUserStore from "../zustand/store";

const AcceptRejectButtons = ({
  user,
  users,
  setUsers,
}: {
  user: User;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}) => {
  const { token } = useUserStore();
  const handleAccept = () => {
    acceptModRequest(token, user.username)
      .then((data) => {
        toast.success("Accepted");
        setUsers(users.filter((u) => u.username !== user.username));
        
      })
      .catch((e: any) => {
        toast.error(e.message);
      });
  };

  const handleReject = () => {
    rejectModRequest(token, user.username)
      .then((data) => {
        toast.success("Rejected");
        setUsers(users.filter((u) => u.username !== user.username));
      })
      .catch((e: any) => {
        toast.error(e.message);
      });
  };
  return (
    <>
      <Button onClick={() => handleAccept()} size={"icon"}>
        <MdCheck />
      </Button>
      <Button
        onClick={() => handleReject()}
        size={"icon"}
        variant={"destructive"}
      >
        <RxCross1 />
      </Button>
    </>
  );
};

export default AcceptRejectButtons;
