import { selector, selectorFamily } from "recoil";

import { customCreateAtom } from "@/utils/customCreateAtom.ts";
import { customAxios } from "@/utils/customAxios.ts";

// 세션 - 세션 목록 조회 API
export const sessionListAtom = customCreateAtom("sessionList");
export const fetchSessionSelector = selector({
  key: "fetchSessionSelector",
  get: async () => {
    const res = await customAxios.get("/sessions/view/");

    return res.data;
  },
});

// 세션 - 세션 상세 조회 API
export const sessionDetailInfoAtom = customCreateAtom("sessionDetailInfo");
export const fetchSessionDetailInfoSelector = selectorFamily({
  key: "fetchSessionDetailInfoSelector",
  get: (id: number | string) => async () => {
    const res = await customAxios.get(`/sessions/view/${id}`);

    return res.data;
  },
});
