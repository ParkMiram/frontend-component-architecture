import { allDateFormat } from "@/utils/dateFormat.ts";
import { DetailHeaderInterface } from "@/types/interface/HeaderInterface.ts";
import { ActiveChip, ProgramStatusChip } from "@/atoms/Chips.tsx";

export const programHeader = [
  {
    keyName: "pji_uid",
    name: "프로젝트 식별자",
    isDisplay: false,
  },
  {
    keyName: "seq",
    name: "seq",
    isDisplay: false,
  },
  {
    keyName: "name",
    name: "프로젝트명",
    isDisplay: true,
  },
  {
    keyName: "product",
    name: "제품명",
    isDisplay: true,
  },
  {
    keyName: "session_handler",
    name: "핸들러 이름",
    isDisplay: true,
  },
  {
    keyName: "status",
    name: "상태",
    isDisplay: true,
  },
  {
    keyName: "profile_name",
    name: "프로필명",
    isDisplay: true,
  },
  {
    keyName: "test_code",
    name: "테스트 코드",
    isDisplay: true,
  },
  {
    keyName: "profile_ctn_uid",
    name: "profile_ctn_uid",
    isDisplay: false,
  },
  {
    keyName: "company_code",
    name: "회사 코드",
    isDisplay: false,
  },
  {
    keyName: "updt_date",
    name: "updt_date",
    isDisplay: false,
  },
  {
    keyName: "reg_date",
    name: "등록일",
    isDisplay: true,
  },
];

export const programDetailHeader: DetailHeaderInterface[] = [
  {
    keyName: "seq",
    name: "seq",
    isDisplay: false,
  },
  {
    keyName: "pji_uid",
    name: "프로젝트 식별자",
    isDisplay: true,
  },
  {
    keyName: "cur_uid",
    name: "현재 식별자",
    isDisplay: false,
  },
  {
    keyName: "name",
    name: "프로젝트명",
    isDisplay: true,
  },
  {
    keyName: "product",
    name: "제품명",
    isDisplay: true,
  },
  {
    keyName: "prj_status",
    name: "프로젝트 상태",
    isDisplay: false,
    formatter: (value: string) => <ActiveChip value={value} />,
  },
  {
    keyName: "status",
    name: "상태",
    isDisplay: true,
    formatter: (value: string) => <ProgramStatusChip value={value} />,
  },
  {
    keyName: "session_handler",
    name: "세션 핸들러",
    isDisplay: true,
  },
  {
    keyName: "param",
    name: "파라미터",
    isDisplay: true,
  },
  {
    keyName: "param_ext",
    name: "확장 파라미터",
    isDisplay: true,
  },
  {
    keyName: "profile_name",
    name: "프로필명",
    isDisplay: true,
  },
  {
    keyName: "extra_test_code_name",
    name: "추가 테스트 코드명",
    isDisplay: true,
  },
  {
    keyName: "description",
    name: "상세 설명",
    isDisplay: true,
  },
  {
    keyName: "test_code",
    name: "테스트 코드",
    isDisplay: true,
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
    isDisplay: true,
  },
  {
    keyName: "package_type",
    name: "패키지 타입",
    isDisplay: true,
  },
  {
    keyName: "profile_ctn_uid",
    name: "프로필 컨텐츠 식별자",
    isDisplay: true,
  },
  {
    keyName: "extra_test_code_ctn_uid",
    name: "추가 테스트 코드\n컨텐츠 식별자",
    isDisplay: true,
  },
  {
    keyName: "is_encrypted_sn",
    name: "시리얼 암호화 여부",
    isDisplay: true,
  },
  {
    keyName: "etc_option",
    name: "기타 옵션",
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
    isDisplay: true,
    formatter: (value: string) => allDateFormat(value),
  },
];
