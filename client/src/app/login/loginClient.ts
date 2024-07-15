import { LoginSchema } from "@/lib/schemas/loginSchema";
import axios from "axios";
import { toast } from "sonner";
import useUserStore from "../zustand/store";
import WebSocketService from "../utils/socket";


const url = 'http://localhost:3000/api/user';
export async function login(data: LoginSchema) {
  try {
    const response = await axios.post(url + "/auth/login", data);
    useUserStore.getState().setToken(response.data.token);

    const stompClient = new WebSocketService();
    stompClient.connect(response.data.token);

    stompClient.onConnected(() => {
      stompClient.send("/app/users", "");
      stompClient.subscribe("/topic/connectedUsers" , (message) => {
        console.log(JSON.parse(message.body));
        useUserStore.getState().setOnlineMembers(JSON.parse(message.body).connectedUsers);
      })
      toast.success('Logged in successfully');
    });

  } catch (e) {
    console.error(e);
    toast.error('Invalid credentials');
  }
}