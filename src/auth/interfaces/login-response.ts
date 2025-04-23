export interface LoginResponse {
  token: string;
  user: {
    uuid: string;
    email: string;
  };
}
