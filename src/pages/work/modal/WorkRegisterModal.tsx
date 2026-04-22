import { useState } from "react";

import { LabeledInput, LabeledSelect } from "@/molecules/StyledForm.tsx";
import { SelectType } from "@/types/type/LayoutForm.ts";

const WorkRegisterForm = ({}: { success: () => void }) => {
  // state
  const [workName, setWorkName] = useState<string>("");
  const [workDesc, setWorkDesc] = useState<string>("");
  const [activationStatus, setActivationStatus] = useState<SelectType>({
    value: "",
    label: "",
  });
  const [workType, setWorkType] = useState<SelectType>({
    value: "",
    label: "",
  });
  const [salesManagementInfo, setSalesManagementInfo] = useState<SelectType>({
    value: "",
    label: "",
  });
  const [programInfo, setProgramInfo] = useState<SelectType>({
    value: "",
    label: "",
  });
  const [machineInfo, setMachineInfo] = useState<SelectType>({
    value: "",
    label: "",
  });
  const [snRule, setSnRule] = useState<SelectType>({ value: "", label: "" });
  const [lockStatus, setLockStatus] = useState<SelectType>({
    value: "",
    label: "",
  });
  const [targetQuantity, setTargetQuantity] = useState<number>(0);
  const [issuedQuantity, setIssuedQuantity] = useState<number>(0);
  const [author, setAuthor] = useState<string>("");
  const [regDate, setRegDate] = useState();
  const [operatorId, setOperatorId] = useState<string>("");
  const [note, setNote] = useState<string>("");

  // 활성화 상태 options
  const activationStatusOptions = [
    { value: "active", label: "활성 (사용중)" },
    { value: "inactive", label: "비활성" },
  ];

  // 작업 종류 options
  const workTypeOptions = [
    { value: "ES", label: "ES(개발샘플)" },
    { value: "EV", label: "EV(평가용샘플)" },
    { value: "MP", label: "MP(양산제품-대량)" },
    { value: "PP", label: "PP(양산제품-소량)" },
  ];

  // 영업 관리 정보 options
  const salesManagementInfoOptions = [
    { value: "1", label: "G3 ES 샘플 (예제)" },
    { value: "2", label: "MTB PP (예제)" },
    { value: "3", label: "MTR EV 샘플 (예제)" },
  ];

  // 프로그램 정보 options
  const programInfoOptions = [
    { value: "1", label: "G3_PGM" },
    { value: "2", label: "MTB_PGM" },
    { value: "3", label: "MTR_PGM_NEW" },
  ];

  // 발급 장비 정보 options
  const machineInfoOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
  ];

  // SN 규칙 options
  const snRuleOptions = [{ value: "NO", label: "NO_SN" }];

  // LOCK 수행 options
  const lockStatusOptions = [
    { value: "LOCK", label: "활성 (LOCK)" },
    { value: "UNLOCK", label: "비활성 (UNLOCK)" },
  ];

  // @ts-ignore
  return (
    <form id="work-register-form">
      <ul className="modal-form">
        <li>
          <LabeledInput
            label="작업 이름"
            name="workName"
            required={true}
            setValue={setWorkName}
            value={workName}
          />
        </li>
        <li>
          <LabeledInput
            label="작업 설명"
            name="workDesc"
            required={true}
            setValue={setWorkDesc}
            useTextarea={true}
            value={workDesc}
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
            label="작업 종류"
            options={workTypeOptions}
            required={true}
            select={workType}
            setSelect={setWorkType}
          />
        </li>
        <li>
          <LabeledSelect
            label="영업 관리 정보"
            options={salesManagementInfoOptions}
            required={true}
            select={salesManagementInfo}
            setSelect={setSalesManagementInfo}
          />
        </li>
        <li>
          <LabeledSelect
            label="프로그램 정보"
            options={programInfoOptions}
            required={true}
            select={programInfo}
            setSelect={setProgramInfo}
          />
        </li>
        <li>
          <LabeledSelect
            label="발급 장비 정보"
            options={machineInfoOptions}
            required={true}
            select={machineInfo}
            setSelect={setMachineInfo}
          />
        </li>
        <li>
          <LabeledSelect
            label="SN 규칙"
            options={snRuleOptions}
            required={true}
            select={snRule}
            setSelect={setSnRule}
          />
        </li>
        <li>
          <LabeledSelect
            label="LOCK 수행"
            options={lockStatusOptions}
            required={true}
            select={lockStatus}
            setSelect={setLockStatus}
          />
        </li>
        <li>
          <LabeledInput
            label="목표 수량"
            placeholder="0"
            required={false}
            setValue={setTargetQuantity}
            useNumber={true}
            value={targetQuantity}
          />
        </li>
        <li>
          <LabeledInput
            label="현재 발급 수량"
            placeholder="0"
            required={false}
            setValue={setIssuedQuantity}
            useNumber={true}
            value={issuedQuantity}
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

export const WorkRegisterModal = ({ success }: { success: () => void }) => ({
  title: "새 작업 등록",
  content: <WorkRegisterForm success={success} />,
  confirmButton: "등록",
  formId: "work-register-form",
});
