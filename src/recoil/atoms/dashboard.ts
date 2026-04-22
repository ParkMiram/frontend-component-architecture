import { selector } from "recoil";

import { customAxios } from "@/utils/customAxios.ts";

// 대시보드 - 오늘의 수율 조회 API
export const todayRateSelector = selector({
  key: "todayRate",
  get: async () => {
    const res = await customAxios.get("/dashboard/yield/today");

    return res.data;
  },
});

// 대시보드 - 정보 | 서버 상태 조회 API
export const serverInfoSelector = selector({
  key: "serverInfo",
  get: async () => {
    const res = await customAxios.get("/dashboard/server-status");

    return res.data;
  },
});

// 대시보드 - 실시간 발급 현황
export const realtimeIssueStatusSelector = selector({
  key: "realtimeIssueStatus",
  get: async () => {
    const res = await customAxios.get("/dashboard/works/realtime", {
      params: {
        status: "RUNNING",
      },
    });

    return res.data;
  },
});
