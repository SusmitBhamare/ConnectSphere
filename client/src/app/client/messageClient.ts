import axios from "axios";

const messageUrl = process.env.NEXT_PUBLIC_MESSAGE_URL;


export async function getMessagesForWorkspace(workspaceId: string, token: string | undefined | null) {

  try {
    const response = await axios.get(messageUrl + "/messages/workspace/" + workspaceId, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (e) {
    return null;
  }

}

export async function getMessagesForUser(senderId: string, receiverId: string, token: string | undefined | null) {
  try {
    const response = await axios.get(messageUrl + "/messages/user/" + senderId + "/" + receiverId, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (e) {
    return null;
  }
}


export async function getNotifications(token: string | undefined | null, userId: string) {
  try {
    const response = await axios.get(messageUrl + "/notifications/" + userId, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (e) {
    throw new Error("Error fetching notifications");
  }
}

