
export enum Status {
  READ,
  RECEIVED,
  SENT
}

export interface message {
  id: string | null,
  receiverIds: string[] | null,
  content: string | null,
  status: Status | null,
  senderId: string | null,
  workspaceId: string | null,
  attachment: string | null
}