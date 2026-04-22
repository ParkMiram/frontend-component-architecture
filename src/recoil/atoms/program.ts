import { selectorFamily } from "recoil";

import { customAxios } from "@/utils/customAxios.ts";
import { customCreateAtom } from "@/utils/customCreateAtom.ts";

// 프로그램 - 프로그램 목록 조회 API
export const fetchProgramListSelector = selectorFamily({
  key: "fetchProgramListSelector",
  get:
    ({
      orderBy,
      orderDirection,
      search,
    }: {
      orderBy?: string;
      orderDirection?: "asc" | "desc";
      search?: string;
    }) =>
    async () => {
      const res = await customAxios.get("/projects/view/", {
        params: {
          order_by: orderBy ?? "reg_date",
          order_direction: orderDirection ?? "desc",
          search: search ?? "",
        },
      });

      return res.data;
    },
});

// 프로그램 - 프로그램 상세 조회 API
export const programDetailInfoAtom = customCreateAtom("programDetailInfo");
export const fetchProgramDetailInfoSelector = selectorFamily({
  key: "fetchProgramDetailInfoSelector",
  get: (id: number | string) => async () => {
    const res = await customAxios.get(`/projects/view/${id}`);

    return res.data;
  },
});

// 프로그램 - 상태 확인 API
export const programStatusIsActive = selectorFamily({
  key: "programStatusIsActive",
  get:
    (id: string) =>
    ({ get }) => {
      const detail = get(fetchProgramDetailInfoSelector(id));

      if (!detail) return false;

      return detail.status === "ACTIVE";
    },
});
