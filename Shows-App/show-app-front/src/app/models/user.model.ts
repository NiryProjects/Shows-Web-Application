export interface User {
  id: string;
  email: string;
  username: string;
}

export interface AuthData {
  token: string;
  expiresIn: number;
  userId: string;
}
