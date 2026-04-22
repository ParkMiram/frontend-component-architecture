export interface AuthData {
  salt: string;
}

// Login
export interface LoginForm {
  userId: string;
  password: string;
}

// auth/login
export interface AuthInfo {
  token?: {
    accessToken?: string | null;
    expiredCount?: number;
    [k: string]: any;
  } | null;
  sessionKey: string | null;
  userInfo: {
    userId: string;
    [key: string]: any;
  } | null;
  timeOver?: number;
}
