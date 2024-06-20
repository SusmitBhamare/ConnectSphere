
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { message } from '../types/Message';

const WEBSOCKET_URL = 'http://localhost:8082/chat';

let stompClient: Client | null = null;

export const connect = (onMessageReceived: (message: any) => void): void => {
  const socket = new SockJS(WEBSOCKET_URL);
  console.log("connected");
  
  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => {
      console.log(str);
    },
    onConnect: () => {
      stompClient?.subscribe('/topic/messages', (message) => {
        onMessageReceived(JSON.parse(message.body));
      });
    },
  });
  stompClient.activate();
};

export const sendMessage = (message: message): void => {
  if (stompClient && stompClient.connected) {
    console.log(message);
    stompClient.publish({
      destination: '/app/send',
      body: JSON.stringify(message),
    });
  }
};
