export interface AuthData {
  email: string;
  password?: string;
  username?: string;
  newPassword?: string;
}

export interface AuthResponse {
  token: string;
  expiresIn: number;
  userId: string;
  username: string;
}
