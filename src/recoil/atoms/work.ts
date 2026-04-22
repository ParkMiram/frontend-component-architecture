import { atom, selectorFamily, useRecoilCallback } from "recoil";

import { customCreateAtom } from "@/utils/customCreateAtom.ts";
import { customAxios } from "@/utils/customAxios.ts";
import { UpdateWorkDetailBody } from "@/types/interface/WorkInterface.ts";

// refetch
export const workListRefreshKeyAtom = atom<number>({
  key: "workListRefreshKeyAtom",
  default: 0,
});

// 작업 - 작업 목록 조회 API
export const workListAtom = customCreateAtom("workList");
export const fetchWorkListSelector = selectorFamily({
  key: "fetchWorkListSelector",
  get:
    ({
      orderBy,
      orderDirection,
      status,
      search,
      _refreshKey,
    }: {
      orderBy?: string | undefined;
      orderDirection?: "asc" | "desc";
      status: "ON_STOP|RUNNING" | "FINISHED";
      search?: string;
      _refreshKey?: number;
    }) =>
    async () => {
      const res = await customAxios.get("/workinfos/view/", {
        params: {
          order_by: orderBy ?? "reg_date",
          order_direction: orderDirection ?? "desc",
          status: status,
          search: search ?? "",
          _refreshKey: _refreshKey,
        },
      });

      return res.data;
    },
});

// 작업 - 작업 상세 조회 API
export const workDetailInfoAtom = customCreateAtom("workDetailInfo");
export const fetchWorkDetailInfoSelector = selectorFamily({
  key: "fetchWorkDetailInfoSelector",
  get: (id: string) => async () => {
    const res = await customAxios.get(`/workinfos/view/${id}`);

    return res.data;
  },
});

// 작업 - 상태 확인 API
export const workStatusIsRunning = selectorFamily({
  key: "workStatusIsRunning",
  get:
    (id: string) =>
    ({ get }) => {
      const detail = get(fetchWorkDetailInfoSelector(id));

      if (!detail) return false;

      // return detail.status === "RUNNING" || detail.status === "FINISHED";
      return detail.status;
    },
});

// 작업 - 상태 변경 API
export const workChangeStatusAtom = customCreateAtom("workChangeStatus");
export const useUpdateWorkStatus = () =>
  useRecoilCallback(({ refresh, set }) => async (id: string) => {
    await customAxios.patch(`/workinfos/${id}/status`, {
      status: "FINISHED",
      detail_msg: "",
    });

    refresh(fetchWorkDetailInfoSelector(id));
    set(workListRefreshKeyAtom, (v) => v + 1);
    refresh(workStatusIsRunning(id));
  });

// 작업 - 수정 API
export const workUpdateAtom = customCreateAtom("workUpdate");
export const useUpdateWorkDetailInfo = () =>
  useRecoilCallback(
    ({ refresh, set }) =>
      async (id: string, data: UpdateWorkDetailBody) => {
        await customAxios.put(`/workinfos/${id}`, data);

        refresh(fetchWorkDetailInfoSelector(id));
        set(workListRefreshKeyAtom, (v) => v + 1);
      },
  );
