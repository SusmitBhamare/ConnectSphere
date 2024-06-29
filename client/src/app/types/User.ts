
export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
  email: string;
  image: string | null;
  role: string;
  messagesSent: any[];
  messagesReceived: any[];
  workspaces: any[];
  enabled: boolean;
  authorities: { authority: string }[];
  credentialsNonExpired: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
}
