
export enum Status {
  READ,
  RECEIVED,
  SENT
}

export interface message {
  receiverIds: string[] | null,
  content: string | null,
  senderId: string | null,
  workspaceId: string | null,
  attachment: string | null,
  createdAt : Date | null
}