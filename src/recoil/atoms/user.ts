import pkg from "crypto-js";

import { customCreateAtom } from "@/utils/customCreateAtom.ts";
import { customCommonAxios } from "@/utils/customAxios.ts";
const { SHA512 } = pkg;

// 사용자 목록
export const userListAtom = customCreateAtom("userList");
export const fetchUserList = async (body: { [key: string]: any }) => {
  try {
    const data = {
      header: { trId: import.meta.env.VITE_TRID_USER_LIST! },
      body: body,
    };

    const { data: response } = await customCommonAxios.post("/user/list", data);

    if (response?.header?.rtnCode !== import.meta.env.VITE_SUCCESS_RTN_CODE) {
      throw { customError: true, payload: response };
    }

    return response;
  } catch (err: any) {
    if (err.customError) {
      return {
        error: {
          code: err.payload.header.rtnCode,
          message: err.payload.header.rtnMessage,
        },
      };
    } else {
      console.log(err);

      return {
        error: {
          code: err?.response?.data.error.code ?? err?.code ?? "UNKNOWN_ERROR",
          message:
            err?.response?.data.error.message ??
            err?.message ??
            "An unknown error occurred",
          details: "An unexpected error occurred. Please try again later.",
        },
      };
    }
  }
};

// 사용자 목록 > 등록 > 아이디, 이메일 중복 확인
export const userInfoCheckResultAtom = customCreateAtom("validateUserId");
export const fetchUserInfoCheckResult = async (body: {
  [key: string]: any;
}) => {
  try {
    const data = {
      header: { trId: import.meta.env.VITE_TRID_USER_REGISTER_VALIDATE! },
      body: body,
    };
    const { data: response } = await customCommonAxios.post(
      "/user/register/valid",
      data,
    );

    if (response?.header?.rtnCode !== import.meta.env.VITE_SUCCESS_RTN_CODE) {
      throw { customError: true, payload: response };
    }

    return response;
  } catch (err: any) {
    if (err.customError) {
      return {
        error: {
          code: err.payload.header.rtnCode,
          message: err.payload.header.rtnMessage,
        },
      };
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

// 사용자 목록 > 사용자 등록
export const registerUserAtom = customCreateAtom("registerUser");
export const fetchRegisterUser = async (body: { [key: string]: any }) => {
  try {
    const data = {
      header: { trId: import.meta.env.VITE_TRID_USER_REGISTER! },
      body: body,
    };
    const { data: response } = await customCommonAxios.post(
      "/user/register",
      data,
    );

    if (response?.header?.rtnCode !== import.meta.env.VITE_SUCCESS_RTN_CODE) {
      throw { customError: true, payload: response };
    }

    return response;
  } catch (err: any) {
    if (err.customError) {
      return {
        error: {
          code: err.payload.header.rtnCode,
          message: err.payload.header.rtnMessage,
        },
      };
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

// 사용자 목록 > 삭제
export const removeUserAtom = customCreateAtom("deleteUser");
export const fetchRemoveUser = async (body: { [key: string]: any }) => {
  const dataForRemoveChallenge = {
    header: {
      trId: import.meta.env.VITE_TRID_REMOVE_CHALLENGE,
      isEncyrpt: false,
    },
    body: {
      userId: body.regUserId,
    },
  };

  let saltAndUuid;

  try {
    const { data: response } = await customCommonAxios.post(
      "/remove/challenge",
      dataForRemoveChallenge,
    );

    if (response?.header.rtnCode !== import.meta.env.VITE_SUCCESS_RTN_CODE) {
      throw { customError: true, payload: response };
    }

    saltAndUuid = response;

    const { salt, uuid } = saltAndUuid?.body;
    const passwordHash = SHA512(uuid + SHA512(body.password + salt)).toString();
    const { password, ...bodyWithoutPassword } = body;
    const data = {
      header: { trId: import.meta.env.VITE_TRID_USER_REMOVE },
      body: {
        ...bodyWithoutPassword,
        passInfo: {
          userId: body.regUserId,
          uuid: uuid,
          passwordHash: passwordHash,
        },
      },
    };

    try {
      const { data: response } = await customCommonAxios.post(
        "/user/remove",
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

// 사용자 목록 > 상세
export const userInfoAtom = customCreateAtom("userInfo");
export const fetchUserInfo = async (body: { [key: string]: any }) => {
  try {
    const data = {
      header: { trId: import.meta.env.VITE_TRID_USER_INFO! },
      body: body,
    };
    const { data: response } = await customCommonAxios.post(
      "/user/detail/info",
      data,
    );

    if (response?.header?.rtnCode !== import.meta.env.VITE_SUCCESS_RTN_CODE) {
      throw new Error(response?.header?.rtnMsg || "User info request failed");
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

// 사용자 목록 > 상세 > 정보 변경
export const userInfoEditAtom = customCreateAtom("userInfoEdit");
export const fetchUserInfoEdit = async (body: { [key: string]: any }) => {
  try {
    const data = {
      header: { trId: import.meta.env.VITE_TRID_USER_DETAIL_MODIFY! },
      body: body,
    };
    const { data: response } = await customCommonAxios.post(
      "/user/detail/modify",
      data,
    );

    if (response?.header?.rtnCode !== import.meta.env.VITE_SUCCESS_RTN_CODE) {
      throw new Error(response?.header?.rtnMsg || "User modify request failed");
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

// 사용자 목록 > 상세 > 상태 변경
export const userStatusChangeAtom = customCreateAtom("userStatusChange");
export const fetchUserStatusChange = async (body: { [key: string]: any }) => {
  try {
    const data = {
      header: { trId: import.meta.env.VITE_TRID_USER_STATUS_CHANGE! },
      body: body,
    };
    const { data: response } = await customCommonAxios.post(
      "/user/status/change",
      data,
    );

    if (response?.header?.rtnCode !== import.meta.env.VITE_SUCCESS_RTN_CODE) {
      throw new Error(
        response?.header?.rtnMsg || "User status change request failed",
      );
    }

    return response;
  } catch (err: any) {
    console.log(err);
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

// 사용자 목록 > 상세 > 2차 인증 변경
export const userMfaChangeAtom = customCreateAtom("userMfaChange");
export const fetchUserMfaChange = async (body: { [key: string]: any }) => {
  try {
    const data = {
      header: {
        trId: import.meta.env.VITE_TRID_USER_CHANGE_MFA!,
        isEncyrpt: false,
      },
      body: body,
    };
    const { data: response } = await customCommonAxios.post(
      "/user/change/mfa",
      data,
    );

    if (response?.header?.rtnCode !== import.meta.env.VITE_SUCCESS_RTN_CODE) {
      throw new Error(
        response?.header?.rtnMsg || "User MFA change request failed",
      );
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

// 사용자 목록 > 상세 > 비밀번호 초기화
export const userPasswordResetAtom = customCreateAtom("userPasswordReset");
export const fetchUserPasswordReset = async (body: { [key: string]: any }) => {
  try {
    const data = {
      header: {
        trId: import.meta.env.VITE_TRID_USER_PASSWORD_INIT!,
        isEncyrpt: false,
      },
      body: body,
    };
    const { data: response } = await customCommonAxios.post(
      "/user/password/init",
      data,
    );

    if (response?.header?.rtnCode !== import.meta.env.VITE_SUCCESS_RTN_CODE) {
      throw new Error(
        response?.header?.rtnMsg || "User password reset request failed",
      );
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

// 사용자 목록 > 상세 > 권한 목록
export const userPolicyListAtom = customCreateAtom("userPolicyList");
export const fetchUserPolicyList = async (body: { [key: string]: any }) => {
  try {
    const data = {
      header: { trId: import.meta.env.VITE_TRID_USER_POLICY_LIST! },
      body: body,
    };
    const { data: response } = await customCommonAxios.post(
      "/user/detail/policy/list",
      data,
    );

    if (response?.header?.rtnCode !== import.meta.env.VITE_SUCCESS_RTN_CODE) {
      throw new Error(response?.header?.rtnMsg || "User policy request failed");
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

// 사용자 목록 > 상세 > 권한 > 추가 목록
export const userPolicyAddListAtom = customCreateAtom("userPolicyAddList");
export const fetchUserPolicyAddList = async (body: { [key: string]: any }) => {
  try {
    const data = {
      header: { trId: import.meta.env.VITE_TRID_USER_DETAIL_ADD_POLICY_LIST! },
      body: body,
    };
    const { data: response } = await customCommonAxios.post(
      "/user/detail/add-policy/list",
      data,
    );

    if (response?.header?.rtnCode !== import.meta.env.VITE_SUCCESS_RTN_CODE) {
      throw new Error(
        response?.header?.rtnMsg || "User policy list request failed",
      );
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

// 사용자 목록 > 상세 > 권한 > 추가
export const userPolicyAddAtom = customCreateAtom("userPolicyAdd");
export const fetchUserPolicyAdd = async (body: { [key: string]: any }) => {
  try {
    const data = {
      header: { trId: import.meta.env.VITE_TRID_USER_DETAIL_ADD_POLICY_ADD! },
      body: body,
    };
    const { data: response } = await customCommonAxios.post(
      "/user/detail/add-policy/add",
      data,
    );

    if (response?.header?.rtnCode !== import.meta.env.VITE_SUCCESS_RTN_CODE) {
      throw new Error(
        response?.header?.rtnMsg || "User policy add request failed",
      );
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

// 사용자 목록 > 상세 > 권한 > 삭제
export const userPolicyDeleteAtom = customCreateAtom("userPolicyDelete");
export const fetchUserPolicyDelete = async (body: { [key: string]: any }) => {
  try {
    const data = {
      header: { trId: import.meta.env.VITE_TRID_USER_DETAIL_POLICY_REMOVE! },
      body: body,
    };
    const { data: response } = await customCommonAxios.post(
      "/user/detail/policy/remove",
      data,
    );

    if (response?.header?.rtnCode !== import.meta.env.VITE_SUCCESS_RTN_CODE) {
      throw new Error(
        response?.header?.rtnMsg || "User policy delete request failed",
      );
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

// 사용자 목록 > 상세 > 사용자 그룹
export const userGroupListAtom = customCreateAtom("userGroupList");
export const fetchUserGroupList = async (body: { [key: string]: any }) => {
  try {
    const data = {
      header: { trId: import.meta.env.VITE_TRID_USER_DETAIL_GROUP_LIST! },
      body: body,
    };
    const { data: response } = await customCommonAxios.post(
      "/user/detail/group/list",
      data,
    );

    if (response?.header?.rtnCode !== import.meta.env.VITE_SUCCESS_RTN_CODE) {
      throw new Error(response?.header?.rtnMsg || "User group request failed");
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

// 사용자 목록 > 상세 > 사용자 그룹 > 추가 > 목록
export const userGroupAddListAtom = customCreateAtom("userGroupAddList");
export const fetchUserGroupAddList = async (body: { [key: string]: any }) => {
  try {
    const data = {
      header: { trId: import.meta.env.VITE_TRID_USER_DETAIL_ADD_GROUP_LIST! },
      body: body,
    };
    const { data: response } = await customCommonAxios.post(
      "/user/detail/add-group/list",
      data,
    );

    if (response?.header?.rtnCode !== import.meta.env.VITE_SUCCESS_RTN_CODE) {
      throw new Error(
        response?.header?.rtnMsg || "User group list request failed",
      );
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

// 사용자 목록 > 상세 > 사용자 그룹 > 추가
export const userGroupAddAtom = customCreateAtom("userGroupAdd");
export const fetchUserGroupAdd = async (body: { [key: string]: any }) => {
  try {
    const data = {
      header: { trId: import.meta.env.VITE_TRID_USER_DETAIL_ADD_GROUP_ADD! },
      body: body,
    };
    const { data: response } = await customCommonAxios.post(
      "/user/detail/add-group/add",
      data,
    );

    if (response?.header?.rtnCode !== import.meta.env.VITE_SUCCESS_RTN_CODE) {
      throw new Error(
        response?.header?.rtnMsg || "User group add request failed",
      );
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

// 사용자 목록 > 상세 > 사용자 그룹 > 삭제
export const deleteUserGroupAtom = customCreateAtom("deleteUserGroup");
export const fetchDeleteUserGroup = async (body: { [key: string]: any }) => {
  try {
    const data = {
      header: { trId: import.meta.env.VITE_TRID_USER_DETAIL_GROUP_REMOVE! },
      body: body,
    };
    const { data: response } = await customCommonAxios.post(
      "/user/detail/group/remove",
      data,
    );

    if (response?.header?.rtnCode !== import.meta.env.VITE_SUCCESS_RTN_CODE) {
      throw new Error(
        response?.header?.rtnMsg || "User group delete request failed",
      );
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

// 사용자 목록 > 상세 > 사용자 그룹 > 그룹 목록
export const addableUserGroupsListAtom = customCreateAtom(
  "getAddableUserGroups",
);
export const fetchAddableUserGroupsList = async (body: {
  [key: string]: any;
}) => {
  try {
    const data = {
      header: { trId: import.meta.env.VITE_TRID_USER_DETAIL_ADD_GROUP_LIST! },
      body: body,
    };
    const { data: response } = await customCommonAxios.post(
      "/user/detail/add-group/list",
      data,
    );

    if (response?.header?.rtnCode !== import.meta.env.VITE_SUCCESS_RTN_CODE) {
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

// 사용자 목록 > 상세 > 사용자 그룹 > 추가
export const addUserGroupsAtom = customCreateAtom("addGroupToUser");
export const fetchAddUserGroups = async (body: { [key: string]: any }) => {
  try {
    const data = {
      header: { trId: import.meta.env.VITE_TRID_USER_DETAIL_ADD_GROUP_ADD! },
      body: body,
    };
    const { data: response } = await customCommonAxios.post(
      "/user/detail/add-group/add",
      data,
    );

    if (response?.header?.rtnCode !== import.meta.env.VITE_SUCCESS_RTN_CODE) {
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
