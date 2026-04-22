import { atom } from "recoil";
import pkg from "crypto-js";
import axios from "axios";

import { customCommonAxios } from "@/utils/customAxios.ts";
import { AuthInfo } from "@/types/interface/AuthData.ts";
import { persistAtom } from "@/utils/recoilPersistEffect.ts";
const { SHA512 } = pkg;

// 사용자 로그인
const defaultAuth: AuthInfo = {
  token: null,
  sessionKey: null,
  userInfo: null,
  timeOver: undefined,
};

export const authAtom = atom<AuthInfo>({
  key: "authAtom",
  default: defaultAuth,
  effects_UNSTABLE: [persistAtom],
});

export const login = async (
  userId: string,
  password: string,
): Promise<AuthInfo> => {
  try {
    // 1. Salt & UUID 요청
    const dataForSaltAndUuid = {
      header: {
        trId: import.meta.env.VITE_TRID_PUBLIC_SALTUUID,
      },
      body: { userId },
    };

    const { data: saltResponse } = await customCommonAxios.post(
      "/public/login/challenge",
      dataForSaltAndUuid,
    );

    if (
      saltResponse?.header?.rtnCode !== import.meta.env.VITE_SUCCESS_RTN_CODE
    ) {
      throw new Error(
        saltResponse?.header?.rtnMessage || "Salt/UUID 요청 실패",
      );
    }

    const { salt, uuid, mfaOption } = saltResponse.body;
    // let uId;

    if (
      mfaOption === import.meta.env.VITE_TRID_PUBLIC_LOGIN_MFA_REGISTER ||
      mfaOption === import.meta.env.VITE_TRID_PUBLIC_LOGIN_MFA_AUTHENTICATE ||
      mfaOption === import.meta.env.VITE_TRID_PUBLIC_LOGIN_MFA_RESET
    ) {
      try {
        const { data: responseUid } = await axios.post(
          "https://pc-agent.ictk.com:8082/puf/get-information",
          {
            header: {
              trId: import.meta.env.VITE_TRID_PC_AGENT_PUF_GET_INFORMATION,
              rtnCode: "000000",
              rtnMessage: "",
              userId: userId,
            },
            body: {
              mfa: {
                challenge: null,
                sessionId: null,
                mfaOption: 1,
                token: {
                  accessToken: null,
                  expired: null,
                  expiredCount: null,
                },
              },
            },
          },
        );

        if (
          responseUid?.header.rtnCode !== import.meta.env.VITE_SUCCESS_RTN_CODE
        ) {
          throw new Error(responseUid?.header.rtnMessage || "2차 인증 실패");
        }
        // uId = responseUid?.body.uid;
      } catch (err: any) {
        debugger;

        return err;
      }
    }

    const passwordHash = SHA512(uuid + SHA512(password + salt)).toString();

    // 2. 로그인 요청
    const dataForLogin = {
      header: {
        trId: import.meta.env.VITE_TRID_PUBLIC_LOGIN,
      },
      body: {
        userId,
        passwordHash,
        uuid,
      },
    };

    const { data: loginResponse } = await customCommonAxios.post(
      "/public/login/req",
      dataForLogin,
    );

    if (loginResponse?.header?.rtnCode !== "000000") {
      throw new Error(loginResponse?.header?.rtnMsg || "Login failed");
    }

    const { token } = loginResponse.body;

    return {
      ...loginResponse.body,
      timeOver: Date.now() + parseInt(String(token.expiredCount * 1000)),
    };
  } catch (error: any) {
    throw new Error(
      error?.message || error?.response?.data?.message || "Login failed",
    );
  }
};

// 로그인 시간 연장
export const extendLogin = async () => {
  try {
    const data = {
      header: { trId: import.meta.env.VITE_TRID_USER_LOGIN_EXTENSION },
      body: {},
    };

    const { data: response } = await customCommonAxios.post(
      "/login/extend",
      data,
    );

    if (response?.header.rtnCode !== import.meta.env.VITE_SUCCESS_RTN_CODE) {
      throw { customError: true, payload: response };
    }

    return response;
  } catch (err: any) {
    if (err.customError) {
      return err.payload;
    } else {
      return {
        error: {
          code: err?.response.data.error.code ?? err?.code ?? "UNKNOWN_ERROR",
          message:
            err?.response.data.error.message ??
            err?.message ??
            "An unknown error occurred",
          details: "An unexpected error occurred. Please try again later.",
        },
      };
    }
  }
};

// 로그아웃
export const logout = async () => {
  try {
    const data = {
      header: {
        trId: import.meta.env.VITE_TRID_USER_LOGOUT,
      },
      body: {},
    };
    const { data: response } = await customCommonAxios.post(
      "/public/logout",
      data,
    );

    if (response?.header?.rtnCode !== import.meta.env.VITE_SUCCESS_RTN_CODE) {
      throw { customError: true, payload: response };
    }

    return response;
  } catch (err: any) {
    if (err.customError) {
      return err.payload;
    } else {
      return {
        error: {
          code: err?.response.data.error.code ?? err?.code ?? "UNKNOWN_ERROR",
          message:
            err?.response.data.error.message ??
            err?.message ??
            "An unknown error occurred",
          details: "An unexpected error occurred. Please try again later.",
        },
      };
    }
  }
};

// OTP 코드
// TODO 이메일 적용이 되면 OTP 구현하기
