import { User } from "./User"
import { Workspace } from "./Workspace"

export enum Status {
  READ,
  RECEIVED,
  SENT
}

export interface Message {
  receiverIds: string[] | undefined,
  content: string,
  status : Status | undefined
  senderId: string | undefined,
  workspaceId: string | undefined,
  attachment: Attachment | null,
  createdAt : Date | undefined
  sentAt? : Date
}


export interface Attachment{
  url : string,
  name : string,
  type : string,
  size : number
  extension : string
}

export interface MessageResponse {
  id : string,
  receivers: User[] | undefined,
  content: string,
  status: string ,
  sender: User,
  workspaceId: Workspace | undefined,
  attachment: Attachment | undefined,
  createdAt: Date | undefined
  sentAt?: Date
}


export interface UserStatus{
  username : string,
  isOnline : boolean
}