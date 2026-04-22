import { AuthInfo } from "../types/interface/AuthData";

let authCache: AuthInfo | null = null;

export const setAuthInfo = (info: AuthInfo | null) => {
  authCache = info;
};

export const getAuthInfo = (): AuthInfo | null => authCache;
