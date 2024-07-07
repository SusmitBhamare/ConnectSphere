import { User } from "./User"

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
  attachment: string | undefined,
  createdAt : Date | undefined
  sentAt? : Date
}

export interface MessageResponse {
  receiverIds: string[] | undefined,
  content: string,
  status: Status | undefined
  senderId: User,
  workspaceId: string | undefined,
  attachment: string | undefined,
  createdAt: Date | undefined
  sentAt?: Date
}


export interface UserStatus{
  username : string,
  isOnline : boolean
}