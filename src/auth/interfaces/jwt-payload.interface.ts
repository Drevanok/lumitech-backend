export interface JwtPayload {
    uuid: string;
    email: string;
    role?: string;
    iat?: number;
    exp?: number;
  }
  