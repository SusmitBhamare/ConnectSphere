import axios from "axios";
import { toast } from "sonner";


const workspaceUrl = "http://localhost:8083"

type WorkspaceData ={
  name : string,
  description : string,
  members : string[]
}


export async function createWorkspace(data : WorkspaceData , token : string | undefined){
  try{
    const response = await axios.post(workspaceUrl + "/workspace" , data , {
      headers : {
        'Authorization' : `Bearer ${token}`
      }
    });
    toast.success("Workspace created successfully");
    return true;
  } catch(e){
    toast.error('Error creating workspace');
    return false;
  }
}

export async function getMembers(workspaceId : string , token : string | undefined){
  try{
    const response = await axios.get(workspaceUrl + "/workspace/members/" + workspaceId , {
      headers : {
        'Authorization' : `Bearer ${token}`
      }
    })
    return response.data;
    } catch(e){
      toast.error('Error fetching members');
    }
  }
