import { SignupSchema } from "@/lib/schemas/signupSchema";
import axios from "axios"
import { toast } from "sonner";

// Port forwarding Check next.config.js. Done to tackle with cookies not being set in the browser
const url = 'http://localhost:3000/api/user';
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

