import { LoginSchema } from "@/lib/schemas/loginSchema";
import axios from "axios";
import { toast } from "sonner";
import useUserStore from "../zustand/store";

const url = 'http://localhost:3000/api/user';
export async function login(data : LoginSchema){
  try{
    const response = await axios.post(url + "/auth/login" , data);
    useUserStore.getState().setToken(response.data.token);
    toast.success('Logged in successfully');
  } catch(e){
    toast.error('Invalid credentials');
  }
  
}