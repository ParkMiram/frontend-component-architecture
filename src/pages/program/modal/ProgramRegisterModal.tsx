import { useState } from "react";

import { LabeledInput, LabeledSelect } from "@/molecules/StyledForm.tsx";
import { SelectType } from "@/types/type/LayoutForm.ts";

const ProgramRegisterForm = ({}: { success: () => void }) => {
  // state
  const [programName, setProgramName] = useState<string>("");
  const [programDesc, setProgramDesc] = useState<string>("");
  const [activationStatus, setActivationStatus] = useState<SelectType>({
    value: "",
    label: "",
  });
  const [issueData, setIssueData] = useState<SelectType>({
    value: "",
    label: "",
  });
  const [profile, setProfile] = useState<SelectType>({
    value: "",
    label: "",
  });
  const [encryptedSN, setEncryptedSN] = useState<SelectType>({
    value: "",
    label: "",
  });
  const [packageType, setPackageType] = useState<SelectType>({
    value: "",
    label: "",
  });
  const [author, setAuthor] = useState<string>("");
  const [regDate, setRegDate] = useState();
  const [operatorId, setOperatorId] = useState<string>("");
  const [note, setNote] = useState<string>("");

  // 활성화 상태 options
  const activationStatusOptions = [
    { value: "active", label: "활성 (사용중)" },
    { value: "inactive", label: "비활성" },
  ];

  // 발급데이터 options
  const issueDataOptions = [
    { value: "1", label: "G3 발급데이터 Pack" },
    { value: "2", label: "MTB 발급데이터 Pack" },
    { value: "3", label: "MTR 발급데이터 Pack" },
  ];

  // 프로파일(스크립트) options
  const profileOptions = [
    { value: "1", label: "G3_EV" },
    { value: "2", label: "MTB_EV1" },
    { value: "3", label: "MTR_EV3" },
  ];

  // SN 암호화
  const encryptedSNOptions = [
    { value: "active", label: "활성(암호화수행)" },
    { value: "inactive", label: "비활성(암호화수행안함)" },
  ];

  // 패키지 종류
  const packageTypeOptions = [
    { value: "e7816", label: "e7816" },
    { value: "SOIC", label: "SOIC" },
    { value: "SOT-23", label: "SOT-23" },
    { value: "uDFN", label: "uDFN" },
  ];

  return (
    <form id="program-register-form">
      <ul className="modal-form">
        <li>
          <LabeledInput
            label="프로그램(PGM) 이름"
            name="programName"
            required={true}
            setValue={setProgramName}
            value={programName}
          />
        </li>
        <li>
          <LabeledInput
            label="프로그램(PGM) 설명"
            name="workDesc"
            required={false}
            setValue={setProgramDesc}
            useTextarea={true}
            value={programDesc}
          />
        </li>
        <li>
          <LabeledSelect
            label="활성화 상태"
            options={activationStatusOptions}
            required={true}
            select={activationStatus}
            setSelect={setActivationStatus}
          />
        </li>
        <li>
          <LabeledSelect
            label="발급 데이터"
            options={issueDataOptions}
            required={true}
            select={issueData}
            setSelect={setIssueData}
          />
        </li>
        <li>
          <LabeledSelect
            label="프로파일(스크립트)"
            options={profileOptions}
            required={true}
            select={profile}
            setSelect={setProfile}
          />
        </li>
        <li>
          <LabeledSelect
            label="SN 암호화"
            options={encryptedSNOptions}
            required={true}
            select={encryptedSN}
            setSelect={setEncryptedSN}
          />
        </li>
        <li>
          <LabeledSelect
            label="패키지 종류"
            options={packageTypeOptions}
            required={true}
            select={packageType}
            setSelect={setPackageType}
          />
        </li>
        <li>
          <LabeledInput
            label="작성자"
            name="author"
            required={true}
            setValue={setAuthor}
            value={author}
          />
        </li>
        <li>
          <LabeledInput
            label="작성 일시"
            name="workName"
            required={true}
            setValue={setRegDate}
            useDatePicker={true}
            value={regDate}
          />
        </li>
        <li>
          <LabeledInput
            label="운영자"
            name="operatorId"
            required={true}
            setValue={setOperatorId}
            value={operatorId}
          />
        </li>
        <li>
          <LabeledInput
            label="비고"
            name="note"
            required={false}
            setValue={setNote}
            useTextarea={true}
            value={note}
          />
        </li>
      </ul>
    </form>
  );
};

export const ProgramRegisterModal = ({ success }: { success: () => void }) => ({
  title: "새 프로그램 등록",
  content: <ProgramRegisterForm success={success} />,
  confirmButton: "등록",
  formId: "program-register-form",
});
