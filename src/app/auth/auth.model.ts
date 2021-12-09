export interface AuthData {
  token: string;
  user?: User;
}

export interface User {
  id: string;
  name: string;
  picture: string;
  email: string;
  createdAt: string;
}
