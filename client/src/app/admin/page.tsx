import React from "react";
import { getCurrentUser, getToken } from "../utils/jwtUtil";
import { redirect } from "next/navigation";
import AdminPage from "./AdminPage";


const AdminDashboard = async () => {
  const token = getToken();
  const user = await getCurrentUser(token?.value);

  if (!user || (user && user.role !== "ADMIN")) {
    redirect("/chat");
  }


  return (
    <AdminPage/>
  );
};

export default AdminDashboard;
