import pkg from "crypto-js";

import { customCreateAtom } from "@/utils/customCreateAtom.ts";
import { customCommonAxios } from "@/utils/customAxios.ts";
const { SHA512 } = pkg;

// 사용자 그룹 목록
export const userGroupListAtom = customCreateAtom("userGroup");
export const fetchUserGroupList = async (body: { [key: string]: any }) => {
  try {
    const data = {
      header: { trId: import.meta.env.VITE_TRID_USER_GROUP_LIST! },
      body: body,
    };

    const { data: response } = await customCommonAxios.post(
      "/user-group/list",
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

// 사용자 그룹 목록 > 그룹 등록
export const createUserGroupAtom = customCreateAtom("createUserGroup");
export const fetchCreateUserGroup = async (body: { [key: string]: any }) => {
  try {
    const data = {
      header: { trId: import.meta.env.VITE_TRID_USER_GROUP_CREATE! },
      body: body,
    };
    const { data: response } = await customCommonAxios.post(
      "/user-group/create",
      data,
    );

    if (response?.header?.rtnCode !== import.meta.env.VITE_SUCCESS_RTN_CODE) {
      throw new Error(
        response?.header?.rtnMsg || "User group creation request failed",
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

// 사용자 그룹 목록 > 그룹 삭제
export const removeUserGroupAtom = customCreateAtom("removeUserGroup");
export const fetchRemoveUserGroup = async (body: { [key: string]: any }) => {
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
      header: { trId: import.meta.env.VITE_TRID_USER_GROUP_REMOVE! },
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
        "/user-group/remove",
        data,
      );

      if (response?.header?.rtnCode !== import.meta.env.VITE_SUCCESS_RTN_CODE) {
        throw new Error(
          response?.header?.rtnMsg || "User group removal request failed",
        );
      }

      return response;
    } catch (err: any) {
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

// 사용자 그룹 목록 > 그룹 상세 > 사용자 > 목록
export const userGroupUserListAtom = customCreateAtom("userGroupUserList");
export const fetchUserGroupUserList = async (body: { [key: string]: any }) => {
  try {
    const data = {
      header: { trId: import.meta.env.VITE_TRID_USER_GROUP_USER_LIST! },
      body: body,
    };
    const { data: response } = await customCommonAxios.post(
      "/user-group/user/list",
      data,
    );

    if (response?.header?.rtnCode !== import.meta.env.VITE_SUCCESS_RTN_CODE) {
      throw new Error(
        response?.header?.rtnMsg || "User group info request failed",
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

// 사용자 그룹 목록 > 그룹 상세 > 사용자 > 사용자 추가 > 목록
export const userGroupUserAddListAtom = customCreateAtom(
  "userGroupUserAddList",
);
export const fetchUserGroupUserAddList = async (body: {
  [key: string]: any;
}) => {
  try {
    const data = {
      header: { trId: import.meta.env.VITE_TRID_USER_GROUP_USER_ADD_LIST! },
      body: body,
    };
    const { data: response } = await customCommonAxios.post(
      "/user-group/user/add/list",
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

// 사용자 그룹 목록 > 그룹 상세 > 사용자 > 사용자 추가 > 추가
export const userGroupUserAdd = customCreateAtom("userGroupUserAdd");
export const fetchUserGroupAdd = async (body: { [key: string]: any }) => {
  try {
    const data = {
      header: { trId: import.meta.env.VITE_TRID_USER_GROUP_USER_ADD_REQ! },
      body: body,
    };
    const { data: response } = await customCommonAxios.post(
      "/user-group/user/add/req",
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

// 사용자 그룹 목록 > 그룹 상세 > 사용자 > 사용자 추가 > 삭제
export const userGroupUserDeleteAtom = customCreateAtom("userGroupUserDelete");
export const fetchUserGroupUserDelete = async (body: {
  [key: string]: any;
}) => {
  try {
    const data = {
      header: { trId: import.meta.env.VITE_TRID_USER_GROUP_USER_REMOVE! },
      body: body,
    };
    const { data: response } = await customCommonAxios.post(
      "/user-group/user/remove",
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

// 사용자 그룹 목록 > 그룹 상세 > 권한 > 목록
export const userGroupPolicyListAtom = customCreateAtom("userGroupPolicyList");
export const fetchUserGroupPolicyList = async (body: {
  [key: string]: any;
}) => {
  try {
    const data = {
      header: { trId: import.meta.env.VITE_TRID_USER_GROUP_POLICY_LIST! },
      body: body,
    };
    const { data: response } = await customCommonAxios.post(
      "/user-group/policy/list",
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

// 사용자 그룹 목록 > 그룹 상세 > 권한 > 추가 > 목록
export const userGroupPolicyAddListAtom = customCreateAtom(
  "userGroupPolicyAddList",
);
export const fetchUserGroupPolicyAddList = async (body: {
  [key: string]: any;
}) => {
  try {
    const data = {
      header: { trId: import.meta.env.VITE_TRID_USER_GROUP_POLICY_ADD_LIST! },
      body: body,
    };
    const { data: response } = await customCommonAxios.post(
      "/user-group/policy/add/list",
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

// 사용자 그룹 목록 > 그룹 상세 > 권한 > 추가
export const userGroupPolicyAddAtom = customCreateAtom("userGroupPolicyAdd");
export const fetchUserGroupPolicyAdd = async (body: { [key: string]: any }) => {
  try {
    const data = {
      header: { trId: import.meta.env.VITE_TRID_USER_GROUP_POLICY_ADD_REQ! },
      body: body,
    };
    const { data: response } = await customCommonAxios.post(
      "/user-group/policy/add/req",
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

// 사용자 그룹 목록 > 그룹 상세 > 권한 > 삭제
export const userGroupPolicyDeleteAtom = customCreateAtom(
  "userGroupPolicyDelete",
);
export const fetchUserGroupPolicyDelete = async (body: {
  [key: string]: any;
}) => {
  try {
    const data = {
      header: { trId: import.meta.env.VITE_TRID_USER_GROUP_POLICY_REMOVE! },
      body: body,
    };
    const { data: response } = await customCommonAxios.post(
      "/user-group/policy/remove",
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
