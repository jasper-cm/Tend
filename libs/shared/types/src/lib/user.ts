export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthPayload {
  accessToken: string;
  user: User;
}
