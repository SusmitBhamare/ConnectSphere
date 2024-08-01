import React from "react";
import { getCurrentUser, getToken } from "../utils/jwtUtil";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getModRequests } from "../register/registerClient";
import { User } from "../types/User";
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

const AdminDashboard = async () => {
  const token = getToken();
  const user = await getCurrentUser(token?.value);

  if (!user || (user && user.role !== "ADMIN")) {
    redirect("/chat");
  }

  let modRequests: User[] = [];

  try {
    modRequests = await getModRequests(token?.value);
  } catch (e: any) {
    // alert(e.message);
  }


  return (
    <Tabs defaultValue="modRequests" className="w-full mt-20 px-4">
      <TabsList>
        <TabsTrigger value="modRequests" className="relative">
          Mod Requests
          <div className="h-4 w-4 text-xs rounded-full bg-primary absolute -top-2 -left-2">
            {modRequests.length}
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
            {modRequests.map((modRequest: User) => (
              <TableRow key={modRequest.id}>
                <TableCell>{modRequest.name}</TableCell>
                <TableCell>{modRequest.username}</TableCell>
                <TableCell>{modRequest.workspaces.length}</TableCell>
                <TableCell className="flex gap-2 items-center float-right">
                    <AcceptRejectButtons user={modRequest} users={modRequests}/>
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

export default AdminDashboard;
