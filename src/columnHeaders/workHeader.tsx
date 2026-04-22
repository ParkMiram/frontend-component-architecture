import { Snippet } from "@heroui/snippet";

import { allDateFormat } from "@/utils/dateFormat.ts";
import { DetailHeaderInterface } from "@/types/interface/HeaderInterface.ts";
import { ActiveChip, WorkStatusChip } from "@/atoms/Chips.tsx";
import { addComma } from "@/utils/addComma.ts";

export const workHeader = [
  {
    keyName: "wki_uid",
    name: "wki_uid",
    isDisplay: false,
  },
  {
    keyName: "work_no",
    name: "작업 번호",
    isDisplay: false,
  },
  {
    keyName: "tag_name",
    name: "작업명",
    isDisplay: true,
  },
  {
    keyName: "prj_title",
    name: "프로그램명",
    isDisplay: true,
  },
  {
    keyName: "customer",
    name: "customer",
    isDisplay: false,
  },
  {
    keyName: "order_no",
    name: "order_no",
    isDisplay: false,
  },
  {
    keyName: "status",
    name: "상태",
    isDisplay: true,
  },
  {
    keyName: "target_size",
    name: "목표량 / 완성 / 잔여 / 실패",
    isDisplay: true,
  },
  {
    keyName: "completed_size",
    name: "완료 수량",
    isDisplay: false,
  },
  {
    keyName: "real_fail",
    name: "실제 실패 수량",
    isDisplay: false,
  },
  {
    keyName: "work_proces_rate",
    name: "진행율",
    isDisplay: true,
  },
  {
    keyName: "success_ok",
    name: "성공 수량",
    isDisplay: false,
  },
  {
    keyName: "total_fail",
    name: "총 실패 수량",
    isDisplay: false,
  },
  {
    keyName: "yield_rate",
    name: "수율",
    isDisplay: true,
  },
  {
    keyName: "snr_name",
    name: "시리얼명",
    isDisplay: false,
  },
  {
    keyName: "mcn_name",
    name: "장비명",
    isDisplay: false,
  },
  {
    keyName: "work_start_time",
    name: "작업 시작 시간",
    isDisplay: true,
  },
  {
    keyName: "due_date",
    name: "마감일",
    isDisplay: true,
  },
  {
    keyName: "reg_date",
    name: "등록일",
    isDisplay: true,
  },
];

export const workDetailHeader: DetailHeaderInterface[] = [
  {
    keyName: "seq",
    name: "seq",
    isDisplay: false,
  },
  {
    keyName: "wki_uid",
    name: "작업 식별자",
    isDisplay: true,
    formatter: (value: string) => (
      <Snippet
        classNames={{
          base: "p-0 bg-transparent",
          copyButton: "h-4 w-4 min-w-4",
          copyIcon: "text-2xs",
        }}
        symbol=""
      >
        {value}
      </Snippet>
    ),
  },
  {
    keyName: "cur_uid",
    name: "cur_uid",
    isDisplay: false,
  },
  {
    keyName: "work_no",
    name: "작업 번호",
    isDisplay: false,
  },
  {
    keyName: "tag_name",
    name: "태그명",
    isDisplay: true,
    formatter: (value: string) => (
      <Snippet
        classNames={{
          base: "p-0 bg-transparent",
          copyButton: "h-4 w-4 min-w-4",
          copyIcon: "text-2xs",
        }}
        symbol=""
      >
        {value}
      </Snippet>
    ),
  },
  {
    keyName: "customer",
    name: "고객사 담당자",
    isDisplay: true,
  },
  {
    keyName: "device_name",
    name: "장치명",
    isDisplay: true,
  },
  {
    keyName: "order_no",
    name: "주문 번호",
    isDisplay: true,
  },
  {
    keyName: "pji_uid",
    name: "프로젝트 항목 식별자",
    isDisplay: true,
    formatter: (value: string) => (
      <Snippet
        classNames={{
          base: "p-0 bg-transparent",
          copyButton: "h-4 w-4 min-w-4",
          copyIcon: "text-2xs",
        }}
        symbol=""
      >
        {value}
      </Snippet>
    ),
  },
  {
    keyName: "snr_uid",
    name: "시리얼 식별자",
    isDisplay: false,
  },
  {
    keyName: "mcn_uid",
    name: "장비 식별자",
    isDisplay: true,
  },
  {
    keyName: "work_start_time",
    name: "작업 시작 시간",
    isDisplay: true,
    formatter: (value: string) => allDateFormat(value),
  },
  {
    keyName: "param_ext",
    name: "확장 파라미터",
    isDisplay: true,
  },
  {
    keyName: "snr_name",
    name: "시리얼명",
    isDisplay: false,
  },
  {
    keyName: "mcn_name",
    name: "장비명",
    isDisplay: true,
  },
  {
    keyName: "target_size",
    name: "목표 수량",
    isDisplay: true,
    formatter: (value: string) => addComma(value) ?? 0,
  },
  {
    keyName: "completed_size",
    name: "완료 수량",
    isDisplay: true,
    formatter: (value: string) => addComma(value) ?? 0,
  },
  {
    keyName: "success_ok",
    name: "성공 수량",
    isDisplay: true,
    formatter: (value: string) => addComma(value) ?? 0,
  },
  {
    keyName: "total_fail",
    name: "총 실패 수량",
    isDisplay: true,
    formatter: (value: string) => addComma(value) ?? 0,
  },
  {
    keyName: "real_fail",
    name: "실제 실패 수량",
    isDisplay: true,
    formatter: (value: string) => addComma(value) ?? 0,
  },
  {
    keyName: "yield_rate",
    name: "수율",
    isDisplay: true,
    formatter: (value: string) => value ?? 0,
  },
  {
    keyName: "failed_size",
    name: "실패 수량",
    isDisplay: true,
    formatter: (value: string) => addComma(value) ?? 0,
  },
  {
    keyName: "check_size",
    name: "확인 수량",
    isDisplay: false,
    formatter: (value: string) => addComma(value) ?? 0,
  },
  {
    keyName: "due_date",
    name: "마감 기한",
    isDisplay: true,
    formatter: (value: string) => allDateFormat(value),
  },
  {
    keyName: "description",
    name: "상세 설명",
    isDisplay: true,
  },
  {
    keyName: "result",
    name: "작업 결과",
    isDisplay: false,
  },
  {
    keyName: "prj_title",
    name: "프로젝트 제목",
    isDisplay: true,
  },
  {
    keyName: "session_handler",
    name: "세션 핸들러",
    isDisplay: true,
  },
  {
    keyName: "prj_description",
    name: "프로젝트 설명",
    isDisplay: true,
  },
  {
    keyName: "etc_option",
    name: "기타 옵션",
    isDisplay: true,
  },
  {
    keyName: "test_code",
    name: "테스트 코드",
    isDisplay: false,
  },
  {
    keyName: "product",
    name: "제품명",
    isDisplay: true,
  },
  {
    keyName: "snr_test_code",
    name: "시리얼 테스트 코드",
    isDisplay: false,
  },
  {
    keyName: "sn_rule",
    name: "시리얼 규칙",
    isDisplay: false,
  },
  {
    keyName: "company_code",
    name: "회사 코드",
    isDisplay: false,
  },
  {
    keyName: "country_code",
    name: "국가 코드",
    isDisplay: false,
  },
  {
    keyName: "interface_type",
    name: "인터페이스 타입",
    isDisplay: false,
  },
  {
    keyName: "package_type",
    name: "패키지 타입",
    isDisplay: false,
  },
  {
    keyName: "location",
    name: "위치",
    isDisplay: false,
  },
  {
    keyName: "is_encrypted_sn",
    name: "시리얼 암호화 여부",
    isDisplay: true,
  },
  {
    keyName: "is_lock",
    name: "잠금 여부",
    isDisplay: true,
  },
  {
    keyName: "status",
    name: "상태",
    isDisplay: true,
    formatter: (value: string) => <WorkStatusChip value={value} />,
  },
  {
    keyName: "prj_status",
    name: "프로젝트 상태",
    isDisplay: true,
    formatter: (value: string) => <ActiveChip value={value} />,
  },
  {
    keyName: "detail_status",
    name: "상세 상태",
    isDisplay: true,
  },
  {
    keyName: "updt_date",
    name: "수정 일시",
    isDisplay: true,
    formatter: (value: string) => allDateFormat(value),
  },
  {
    keyName: "reg_date",
    name: "등록 일시",
    isDisplay: false,
    formatter: (value: string) => allDateFormat(value),
  },
  {
    keyName: "comment",
    name: "주석",
    isDisplay: false,
  },
];
