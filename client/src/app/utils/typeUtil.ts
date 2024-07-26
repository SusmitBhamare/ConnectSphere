import { Workspace } from "../types/Workspace";

export const isWorkspace = (chat: any): chat is Workspace => {
  return (chat as Workspace)?.members !== undefined;
};