import { CompatClient, IMessage, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class WebSocketService {
  private stompClient: CompatClient | null = null;
  private socket: WebSocket | null = null;
  private cookie: string | null = null;
  private isSocketConnected: boolean = false;
  private connectListeners: (() => void)[] = [];

  connect(cookie: string | null) {
    this.cookie = cookie;
    this.socket = new SockJS("http://localhost:8082/ws");
    this.stompClient = Stomp.over(() => this.socket);

    this.stompClient.connect(
      {
        Authorization: `Bearer ${cookie}`, // Authorization header for WebSocket connection
      },
      () => {
        console.log("Connected to WebSocket");
        this.isSocketConnected = true;
        this.triggerConnectListeners(); // Notify all listeners that connection is established
      },
      (error: any) => {
        console.error("Connection error: ", error);
      }
    );
  }

  private triggerConnectListeners() {
    this.connectListeners.forEach(listener => listener());
    this.connectListeners = []; // Clear listeners after triggering
  }

  onConnected(listener: () => void) {
    if (this.isSocketConnected) {
      listener(); // If already connected, trigger listener immediately
    } else {
      this.connectListeners.push(listener); // Otherwise, add listener to the list
    }
  }

  send(destination: string, message: string) {
    if (this.isSocketConnected) {
      console.log("Sending message:", message);
      this.stompClient?.send(destination, {
        Authorization: `Bearer ${this.cookie}`
      }, message);
    } else {
      console.warn("STOMP client not connected, message will be queued:", message);
      // You can handle queuing or other logic here
    }
  }

  subscribe(destination: string, callback: (message: IMessage) => void) {
    if (this.isSocketConnected) {
      this.stompClient?.subscribe(destination, (message) => {
        callback(message);
      }, {
        Authorization: `Bearer ${this.cookie}`
      });
    } else {
      console.error("Cannot subscribe - STOMP client not connected.");
    }
  }

  disconnect() {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect(() => {
        console.log("Disconnected from WebSocket");
        this.stompClient = null;
        this.socket?.close();
        this.socket = null;
        this.isSocketConnected = false;
      });
    }
  }
}

export default WebSocketService;
