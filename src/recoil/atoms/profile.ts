import { selectorFamily } from "recoil";

import { customCreateAtom } from "@/utils/customCreateAtom.ts";
import { customAxios } from "@/utils/customAxios.ts";

// ======= 프로파일 =======
// 프로파일 - 프로파일 목록 조회 API
export const profileListAtom = customCreateAtom("profileList");
export const fetchProfileListSelector = selectorFamily({
  key: "fetchProfileListSelector",
  get:
    ({ type, search }: { type: string; search?: string }) =>
    async () => {
      const res = await customAxios.get("/contents/", {
        params: {
          type: type,
          search: search ?? "",
        },
      });

      return res.data;
    },
});

// ======= 스크립트 =======
// 프로파일 - 스크립트 목록 조회 API
export const scriptListAtom = customCreateAtom("scriptList");
export const fetchScriptListSelector = selectorFamily({
  key: "fetchScriptListSelector",
  get:
    ({ type, search }: { type: string; search?: string }) =>
    async () => {
      const res = await customAxios.get("/contents/", {
        params: {
          type: type,
          search: search ?? "",
        },
      });

      return res.data;
    },
});

// 프로파일 - 스크립트 상세 조회 API
export const scriptDetailInfoAtom = customCreateAtom("scriptDetailInfo");
export const fetchScriptDetailInfoSelector = selectorFamily({
  key: "fetchScriptDetailInfoSelector",
  get: (id: number | string) => async () => {
    const res = await customAxios.get(`/contents/${id}`);

    return res.data;
  },
});

// ======= 기타 정보 =======
export const extraListAtom = customCreateAtom("extraList");
export const fetchExtraListSelector = selectorFamily({
  key: "fetchExtraListSelector",
  get:
    ({ type, search }: { type: string; search?: string }) =>
    async () => {
      const res = await customAxios.get("/contents/", {
        params: {
          type: type,
          search: search ?? "",
        },
      });

      return res.data;
    },
});
