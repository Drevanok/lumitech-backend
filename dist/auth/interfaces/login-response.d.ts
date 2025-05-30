export interface LoginResponse {
    access_token: string;
    refresh_token?: string;
    user: {
        uuid: string;
        email: string;
    };
}
