import { Button } from "@heroui/react";

import { DetailHeaderInterface } from "@/types/interface/HeaderInterface.ts";
import { allDateFormat } from "@/utils/dateFormat.ts";

export const profileHeader = [
  {
    keyName: "ctn_uid",
    name: "ctn_uid",
    isDisplay: false,
  },
  {
    keyName: "seq",
    name: "seq",
    isDisplay: false,
  },
  {
    keyName: "name",
    name: "name",
    isDisplay: true,
  },
  {
    keyName: "description",
    name: "설명",
    isDisplay: true,
  },
  {
    keyName: "type",
    name: "타입",
    isDisplay: false,
  },
  {
    keyName: "version",
    name: "버전",
    isDisplay: true,
  },
  {
    keyName: "hash",
    name: "hash",
    isDisplay: true,
  },
  {
    keyName: "updt_date",
    name: "수정일",
    isDisplay: true,
  },
  {
    keyName: "reg_date",
    name: "등록일",
    isDisplay: true,
  },
];

export const profileDetailHeader = (
  openContentsModal: () => void,
): DetailHeaderInterface[] => [
  {
    keyName: "updt_date",
    name: "수정일",
    isDisplay: true,
    formatter: (value: string) => allDateFormat(value),
  },
  {
    keyName: "reg_date",
    name: "등록일",
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
    name: "프로파일명",
    isDisplay: true,
  },
  {
    keyName: "description",
    name: "설명",
    isDisplay: true,
  },
  {
    keyName: "type",
    name: "타입",
    isDisplay: true,
  },
  {
    keyName: "version",
    name: "버전",
    isDisplay: true,
  },
  {
    keyName: "contents",
    name: "contents",
    isDisplay: true,
    formatter: () => {
      return <Button onPress={openContentsModal}>내용 보기</Button>;
    },
  },
  {
    keyName: "hash",
    name: "hash",
    isDisplay: false,
  },
  {
    keyName: "comment",
    name: "comment",
    isDisplay: false,
  },
  {
    keyName: "ctn_uid",
    name: "ctn_uid",
    isDisplay: true,
  },
];
