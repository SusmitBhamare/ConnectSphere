import React from "react";
import { isLoggedIn } from "../utils/jwtUtil";
import { redirect } from "next/navigation";
import ChatPage from "./ChatPage";

function ChatHomePage() {
  if (!isLoggedIn()) {
    redirect("/login");
  }
  return (
      <ChatPage />
  );
}

export default ChatHomePage;
