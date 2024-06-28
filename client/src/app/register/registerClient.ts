import { SignupSchema } from "@/lib/schemas/signupSchema";
import axios from "axios"
import { toast } from "sonner";

// Port forwarding Check next.config.js. Done to tackle with cookies not being set in the browser
const url = 'http://localhost:3000/api/user';
export async function doesUserExist(username : string){
  try{
    const response = await axios.get(url + '/util/user/' + username);
    return true;
  } catch(e){
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      return false;
    }
  }
}


export async function register(data : SignupSchema){
  try{
    const response = axios.post(url + "/auth/register" , data);
    toast.success('User registered successfully');
  } catch(e){
    toast.error('Failed to register user');
  }

}

