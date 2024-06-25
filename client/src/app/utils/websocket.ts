
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { message } from '../types/Message';

const WEBSOCKET_URL = 'http://localhost:8082/ws';

let stompClient: Client | null = null;
const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtZWh1bDE0NCIsImlhdCI6MTcxOTI5NTkxMCwiZXhwIjoxNzE5MzMxOTEwfQ.- s8HTh_OgKy66CiosJT0Eajw2gYk40abN5_vwL1Zcfo";



export const connect = (onMessageReceived: (message: any) => void): void => {
  const socket = new SockJS(WEBSOCKET_URL);
  
  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => {
      console.log(str);
    },
    onConnect: () => {
      console.log("connected");
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
      destination: '/app/chat',
      body: JSON.stringify(message),
      // headers : {
      //   "Authorization" : `Bearer ${token}`
      // }
    });
  }
};
