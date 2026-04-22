import { allDateFormat } from "@/utils/dateFormat.ts";

export const machineHeader = [
  {
    keyName: "mcn_uid",
    name: "장비 식별자",
    isDisplay: true,
  },
  {
    keyName: "seq",
    name: "seq",
    isDisplay: false,
  },
  {
    keyName: "name",
    name: "발급장비명",
    isDisplay: true,
  },
  {
    keyName: "updt_date",
    name: "수정 일시",
    isDisplay: true,
  },
  {
    keyName: "reg_date",
    name: "등록 일시",
    isDisplay: true,
  },
];

export const machineDetailHeader = [
  {
    keyName: "updt_date",
    name: "수정 일시",
    isDisplay: true,
    formatter: (value: string) => allDateFormat(value),
  },
  {
    keyName: "reg_date",
    name: "등록 일시",
    isDisplay: true,
    formatter: (value: string) => allDateFormat(value),
  },
  {
    keyName: "seq",
    name: "seq",
    isDisplay: false,
  },
  {
    keyName: "name",
    name: "발급장비명",
    isDisplay: true,
  },
  {
    keyName: "etc",
    name: "기타사항",
    isDisplay: true,
  },
  {
    keyName: "comment",
    name: "comment",
    isDisplay: false,
  },
  {
    keyName: "mcn_uid",
    name: "장비 식별자",
    isDisplay: true,
  },
];
