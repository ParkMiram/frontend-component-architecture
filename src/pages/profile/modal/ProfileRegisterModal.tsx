import { useState } from "react";
import { now, getLocalTimeZone } from "@internationalized/date";

import { SelectType } from "@/types/type/LayoutForm.ts";
import {
  LabeledFileUpload,
  LabeledInput,
  LabeledSelect,
} from "@/molecules/StyledForm.tsx";

const ProfileRegisterForm = ({}: { success: () => void }) => {
  // state
  const [scriptName, setScriptName] = useState<string>("");
  const [scriptDesc, setScriptDesc] = useState<string>("");
  const [activationStatus, setActivationStatus] = useState<SelectType>({
    value: "",
    label: "",
  });
  const [targetChip, setTargetChip] = useState<SelectType>({
    value: "",
    label: "",
  });
  const [scriptVersion, setScriptVersion] = useState<string>("");
  const [scriptInfoFile, setScriptInfoFile] = useState<string[]>([]);
  const [scriptFile, setScriptFile] = useState<string[]>([]);
  const [issueFw, setIssueFw] = useState<SelectType>({
    value: "",
    label: "",
  });
  const [issueFwVersion, setIssueFwVersion] = useState<string>("");
  const [issueSwVersion, setIssueSwVersion] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [regDate, setRegDate] = useState(now(getLocalTimeZone()));
  const [note, setNote] = useState<string>("");

  // 활성화 상태 options
  const activationStatusOptions = [
    { value: "active", label: "활성 (사용중)" },
    { value: "inactive", label: "비활성" },
  ];

  // 타겟 Chip options
  const targetChipOptions = [
    { value: "1", label: "G1" },
    { value: "2", label: "G3" },
    { value: "3", label: "G5eSIM" },
    { value: "4", label: "G5USIM" },
    { value: "5", label: "MTB" },
    { value: "6", label: "MTR" },
    { value: "7", label: "STR" },
  ];

  // 발급 FW options
  const issueFwOptions = [
    { value: "1", label: "G3 FW Pack" },
    { value: "2", label: "MTB FW Pack" },
    { value: "3", label: "MTR FW Pack" },
  ];

  return (
    <form id="script-register-form">
      <ul className="modal-form">
        <li>
          <LabeledInput
            label="스크립트 이름"
            name="scriptName"
            required={true}
            setValue={setScriptName}
            value={scriptName}
          />
        </li>
        <li>
          <LabeledInput
            label="스크립트 설명"
            name="scriptDesc"
            required={false}
            setValue={setScriptDesc}
            useTextarea={true}
            value={scriptDesc}
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
            label="타겟 Chip"
            options={targetChipOptions}
            required={true}
            select={targetChip}
            setSelect={setTargetChip}
          />
        </li>
        <li>
          <LabeledInput
            label="스크립트 버전"
            name="scriptVersion"
            required={true}
            setValue={setScriptVersion}
            value={scriptVersion}
          />
        </li>
        <li>
          <LabeledFileUpload
            // error={"에러~"}
            label="스크립트 정보 파일 (JSON.TXT)"
            multiple={true}
            name="scriptInfoFile"
            required={true}
            setValue={setScriptInfoFile}
            value={scriptInfoFile}
            onChange={(fileList) => console.log(fileList)}
          />
        </li>
        <li>
          <LabeledFileUpload
            label="스크립트 파일"
            multiple={false}
            name="scriptFile"
            required={false}
            setValue={setScriptFile}
            value={scriptFile}
            onChange={(file) => console.log(file)}
          />
        </li>
        <li>
          <LabeledSelect
            label="발급 FW"
            options={issueFwOptions}
            required={true}
            select={issueFw}
            setSelect={setIssueFw}
          />
        </li>
        <li>
          <LabeledInput
            label="발급보드 FW 버전"
            name="issueFwVersion"
            required={true}
            setValue={setIssueFwVersion}
            value={issueFwVersion}
          />
        </li>
        <li>
          <LabeledInput
            label="발급보드 FW 버전"
            name="issueSwVersion"
            required={true}
            setValue={setIssueSwVersion}
            value={issueSwVersion}
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
            label="등록일"
            name="workName"
            required={true}
            setValue={setRegDate}
            useDatePicker={true}
            value={regDate}
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

export const ProfileRegisterModal = ({ success }: { success: () => void }) => ({
  title: "새 스크립트 등록",
  content: <ProfileRegisterForm success={success} />,
  confirmButton: "등록",
  formId: "script-register-form",
});
