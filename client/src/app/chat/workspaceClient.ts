import axios from "axios";
import { toast } from "sonner";


const url = "http://localhost:8083"

type WorkspaceData ={
  name : string,
  description : string,
  users : string[]
}


export async function createWorkspace(data : WorkspaceData , token : string | undefined){
  try{
    const response = await axios.post(url + "/workspace" , data , {
      headers : {
        'Authorization' : `Bearer ${token}`
      }
    });
  } catch(e){
    toast.error('Error creating workspace');
  }
}