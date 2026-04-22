import { atom, selectorFamily, useRecoilCallback } from "recoil";

import { customCreateAtom } from "@/utils/customCreateAtom.ts";
import { customAxios } from "@/utils/customAxios.ts";
import {
  CreateMachineBody,
  UpdateMachineBody,
} from "@/types/interface/MachineInterface.ts";

// refetch
export const machineListRefreshKeyAtom = atom<number>({
  key: "machineListRefreshKeyAtom",
  default: 0,
});

// 발급장비 - 발급장비 목록 조회 API
export const machineListAtom = customCreateAtom("machineList");
export const fetchMachineListSelector = selectorFamily({
  key: "fetchMachineListSelector",
  get:
    ({ search }: { search?: string }) =>
    async () => {
      const res = await customAxios.get("/machines/", {
        params: {
          search: search ?? "",
        },
      });

      return res.data;
    },
});

// 발급장비 - 발급장비 상세 조회 API
export const machineDetailInfoAtom = customCreateAtom("machineDetailInfo");
export const fetchMachineDetailInfoSelector = selectorFamily({
  key: "fetchMachineDetailInfoSelector",
  get: (id: number | string) => async () => {
    const res = await customAxios.get(`/machines/${id}`);

    return res.data;
  },
});

// 발급장비 - 해당 발급장비의 디바이스 조회 API
export const fetchDeviceByMachineSelector = selectorFamily({
  key: "fetchDeviceByMachineSelector",
  get:
    ({ machineId, enabled }: { machineId: string; enabled: boolean }) =>
    async () => {
      if (!enabled) return [];

      const res = await customAxios.get(`/devices/by-machine/${machineId}`);

      return res.data;
    },
});

// 발급장비 - 추가 API
export const useCreateMachineSelector = () =>
  useRecoilCallback(({ refresh, set }) => async (data: CreateMachineBody) => {
    await customAxios.post("/machines/", data);

    refresh(fetchMachineListSelector({}));
    set(machineListRefreshKeyAtom, (v) => v + 1);
  });

// 디바이스 - 수정 API
export const useUpdateDeviceSelector = () =>
  useRecoilCallback(
    ({ refresh, set }) =>
      async (id: string, data: UpdateMachineBody) => {
        await customAxios.put(`/devices/${id}`, data);

        refresh(
          fetchDeviceByMachineSelector({
            machineId: data.mcn_uid,
            enabled: true,
          }),
        );
        set(machineListRefreshKeyAtom, (v) => v + 1);
      },
  );
