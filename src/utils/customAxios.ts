import axios from "axios";
import pkg from "crypto-js";

import { getAuthInfo } from "../recoil/authStore";
const { HmacSHA256, enc } = pkg;

export const customAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// KMS api 전용 axios
export const customCommonAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL_COMMON,
  headers: { "Content-Type": "application/json" },
});

customAxios.interceptors.request.use(
  function (request) {
    const auth = getAuthInfo();

    if (!auth) return request;

    const { token, sessionKey, userInfo } = auth;

    const userId = userInfo?.userId;

    if (sessionKey && userId) {
      const editedUrl = request.url?.trim().includes("?")
        ? request.url.trim().split("?")[0]
        : request.url?.trim();

      const url = "/ictk/issue/admin" + editedUrl;
      const timestamp = (
        new Date(new Date().toUTCString()).getTime() / 1000
      ).toString();

      const filteredData = request.data || {};
      const jsonBody = JSON.stringify(filteredData);
      const message = url + "::" + timestamp + userId + jsonBody;

      request.headers["X-Authorization"] = HmacSHA256(
        message,
        enc.Hex.parse(sessionKey),
      ).toString(enc.Hex);
      request.headers["timestamp"] = timestamp;
    }

    if (token?.accessToken) {
      request.headers["Authorization"] = `Bearer ${token?.accessToken}`;
    }

    // Language
    request.headers["Accept-Language"] = localStorage.i18nextLng || "ko";

    // Timezone
    request.headers["X-Timezone"] =
      Intl.DateTimeFormat().resolvedOptions().timeZone;

    return request;
  },
  function (error) {
    return Promise.reject(error);
  },
);

customCommonAxios.interceptors.request.use(
  function (request) {
    if (request?.url?.includes("/public/login")) return request;

    const auth = getAuthInfo();

    if (!auth) return request;

    const { token, sessionKey, userInfo } = auth;

    const userId = userInfo?.userId;

    if (sessionKey && userId) {
      const editedUrl = request.url?.trim().includes("?")
        ? request.url.trim().split("?")[0]
        : request.url?.trim();

      const url = "/kms/admin" + editedUrl;
      const timestamp = (
        new Date(new Date().toUTCString()).getTime() / 1000
      ).toString();

      const filteredData = request.data || {};
      const jsonBody = JSON.stringify(filteredData);
      const message = url + "::" + timestamp + userId + jsonBody;

      request.headers["X-Authorization"] = HmacSHA256(
        message,
        enc.Hex.parse(sessionKey),
      ).toString(enc.Hex);
      request.headers["timestamp"] = timestamp;
    }

    if (token?.accessToken) {
      request.headers["Authorization"] = `Bearer ${token?.accessToken}`;
    }

    // Language
    request.headers["Accept-Language"] = localStorage.i18nextLng || "ko";

    // Timezone
    request.headers["X-Timezone"] =
      Intl.DateTimeFormat().resolvedOptions().timeZone;

    return request;
  },
  function (error) {
    return Promise.reject(error);
  },
);
