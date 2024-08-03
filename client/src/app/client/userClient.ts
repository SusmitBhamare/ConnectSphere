import { LoginSchema } from "@/lib/schemas/loginSchema";
import { SignupSchema } from "@/lib/schemas/signupSchema";
import axios from "axios"
import { toast } from "sonner";
import useUserStore from "../zustand/store";
import WebSocketService from "../utils/socket";

// Port forwarding Check next.config.js. Done to tackle with cookies not being set in the browser
const url = `${process.env.FRONTEND_URL}/api/user`;
export async function doesUserExist(username: string) {
  try {
    const response = await axios.get(url + '/util/verify/user/' + username);
    return true;
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      return false;
    }
  }
}


export async function login(data: LoginSchema) {
  try {
    const response = await axios.post(url + "/auth/login", data);
    useUserStore.getState().setToken(response.data.token);

    const stompClient = new WebSocketService();
    stompClient.connect(response.data.token);

    stompClient.onConnected(() => {
      stompClient.send("/app/users", "");
      stompClient.subscribe("/topic/connectedUsers", (message) => {
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


export async function getUser(username: string, token: string | undefined) {
  try {
    const response = await axios.get(url + '/util/user/' + username, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      return null;
    }
  }
}

export async function getUserById(id: string | undefined, token: string | undefined | null) {
  try {
    const response = await axios.get(url + '/util/user/id/' + id, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      return null;
    }
  }
}


export async function register(data: SignupSchema) {
  try {
    const response = await axios.post(url + "/auth/register", data);
    toast.success('User registered successfully');
    return true;
  } catch (e) {
    toast.error('Failed to register user');
    return false;
  }

}

export async function addUsersInteracted(token: string | undefined | null, userId: string, data: {
  receiverId: string
}) {
  try {
    const response = await axios.put(url + "/util/user/usersInteracted/" + userId, data, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return true;
  } catch (e) {
    return false;
  }
}


export async function sendModRequest(token: string | undefined | null) {
  try {
    const response = await axios.post(url + "/user/mod-request", {}, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    return response.data;
  } catch (e: any) {
    throw new Error(e.response.data);
  }
}


export async function getModRequests(token: string | undefined | null) {
  try {
    const response = await axios.get(url + "/admin/mod-requests", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    return response.data;
  } catch (e: any) {
    throw new Error(e.response.data);
  }
}

export async function acceptModRequest(token: string | undefined | null, username: string) {
  if (!token) throw new Error('Token not found');
  try {

    const response = await axios.put(url + "/admin/accept-mod-request/" + username, {}, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    return response.data;
  } catch (e: any) {
    throw new Error(e.response.data);
  }
}

export async function rejectModRequest(token: string | undefined | null, username: string) {
  if (!token) throw new Error('Token not found');
  try {
    const response = await axios.delete(url + "/admin/reject-mod-request/" + username, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    return response.data;
  } catch (e: any) {
    throw new Error(e.response.data);
  }
}