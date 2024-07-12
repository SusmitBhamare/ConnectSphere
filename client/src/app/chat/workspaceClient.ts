import axios from "axios";
import { toast } from "sonner";


const workspaceUrl = "http://localhost:8083"
const messageUrl = "http://localhost:8082"

type WorkspaceData = {
  name: string,
  description: string,
  members: string[]
}


export async function createWorkspace(data: WorkspaceData, token: string | undefined) {
  try {
    const response = await axios.post(workspaceUrl + "/workspace", data, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    toast.success("Workspace created successfully");
    return true;
  } catch (e) {
    toast.error('Error creating workspace');
    return false;
  }
}

export async function getMembers(workspaceId: string, token: string | undefined | null) {
  try {
    const response = await axios.get(workspaceUrl + "/workspace/members/" + workspaceId, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data;
  } catch (e) {
    toast.error('Error fetching members');
  }
}

export async function removeMember(workspaceId: string, memberId: string, token: string | undefined | null) {
  if (!token) return false;
  try {
    const response = await axios.put(workspaceUrl + "/workspace/remove/" + workspaceId, { userId: memberId }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return true;
  } catch (e) {
    return false;
  }
}


export async function addMembers(workspaceId: string | undefined, members: string[], token: string | undefined | null) {
  try {
    const response = await axios.put(workspaceUrl + "/workspace/add/" + workspaceId, { userIds : members }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return true;
  } catch (e) {
    return false;
  }
}

export async function deleteWorkspace(workspaceId: string, token: string | undefined | null) {
  try {
    const response = await axios.delete(workspaceUrl + "/workspace/" + workspaceId, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return true;
  } catch (e) {
    return false;
  }
}


export async function getMessagesForWorkspace(workspaceId : string, token : string | undefined | null){

  try{
    const response = await axios.get(messageUrl + "/messages/workspace/" + workspaceId , {
      headers : {
        'Authorization' : `Bearer ${token}`
      }
    });
    return response.data;
  } catch(e){
    return null;
  }

}