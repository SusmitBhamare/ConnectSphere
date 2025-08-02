"use client";
import React, { use, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AcceptRejectButtons from "./AcceptRejectButtons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getModRequests } from "../client/userClient";
import useUserStore from "../zustand/store";
import { User } from "../types/User";
import { toast } from "sonner";
import { FaSpinner } from "react-icons/fa6";

const AdminPage = () => {
  const { token } = useUserStore();
  const [modRequests, setModRequests] = useState<User[]>([]);
  const [loading , setLoading] = useState(true);

  const getModReq = async () => {
    if(!token) return;
    try{
      const modRequests = await getModRequests(token);
      setModRequests(modRequests);
    } catch(err){
      toast.error("Failed to fetch mod requests");
    } finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    getModReq();
  }, [token]);

  return (
    <Tabs defaultValue="modRequests" className="w-full mt-20 px-4">
      <TabsList>
        <TabsTrigger value="modRequests" className="relative">
          Mod Requests
          <div className="h-4 w-4 text-xs flex items-center justify-center rounded-full bg-primary absolute -top-2 -left-2">
            {
              loading ? 
              <FaSpinner className="animate-spin"/>
              :
              modRequests?.length
            }
          </div>
        </TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="modRequests">
        <Table>
          <TableCaption>All the mod requests</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>No. Of Workspaces</TableHead>
              <TableHead className="float-end">Decision</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              loading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    <FaSpinner className="animate-spin"/>
                  </TableCell>
                </TableRow>
              )
            }
            {modRequests.map((modRequest: User) => (
              <TableRow key={modRequest.id}>
                <TableCell>{modRequest.name}</TableCell>
                <TableCell>{modRequest.username}</TableCell>
                <TableCell>{modRequest.workspaces.length}</TableCell>
                <TableCell className="flex gap-2 items-center float-right">
                  <AcceptRejectButtons user={modRequest} users={modRequests} setUsers={setModRequests}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  );
};

export default AdminPage;
