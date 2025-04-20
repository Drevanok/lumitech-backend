interface LoginResponse {
    token: string;
    user: {
      uuid: string;
      name: string;
      nickName: string;
      email: string;
    };
  }
  