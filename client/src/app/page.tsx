"use client"
import { message } from "./types/Message";
import { useEffect, useState } from "react";
import { connect, sendMessage } from "./utils/websocket";

export default function Home() {
  const [messages , setMessages] = useState<message[]>([]);
  const [message , setMessage] = useState("");
  const [sendId , setSendId] = useState<string>();

useEffect(() => {
  connect((newMessage: message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  });
}, []);

  const handleSendMessage = () => {
    if(message && sendId){
      const messageObject: message = {
        content: message,
        senderId: sendId,
        receiverIds: [
          "d0e0fb26-c7f3-486b-a075-edbefaaf9813",
          "d0e0fb26-c7f3-486b-a075-edbefaaf9814",
        ],
        workspaceId: null,
        attachment: null,
        createdAt: new Date(),
      };
      console.log(messageObject);
      sendMessage(messageObject);
      setMessage("");
    // setMessages((prevMessages) => [...prevMessages, messageObject]);
    //   console.log(messages);
    }
    
  }

  return (
    <div>
      <h1>Chat App</h1>
      <div>
        <input
          className="text-black"
          type="text"
          placeholder="Username"
          value={sendId}
          onChange={(e) => setSendId(e.target.value)}
        />
      </div>
      <div>
        <input
          className="text-black"
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <div className="bg-white text-black font-bold">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.senderId}: </strong>
            {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
}
