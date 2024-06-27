import { SignupSchema } from "@/lib/schemas/signupSchema";
import axios from "axios"
import { toast } from "sonner";

const url = 'http://localhost:8081'
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

