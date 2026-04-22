import { useEffect, useState } from "react";
import { addToast } from "@heroui/react";

import { LabeledInput } from "@/molecules/StyledForm.tsx";
import { useCreateMachineSelector } from "@/recoil/atoms/machine.ts";

const RegisterMachineForm = ({
  setIsDirty,
  setRegisterLoading,
  success,
}: {
  setIsDirty: (v: boolean) => void;
  setRegisterLoading: (v: boolean) => void;
  success: () => void;
}) => {
  // recoil
  const createMachine = useCreateMachineSelector();

  // state
  const [machineName, setMachineName] = useState<string>("");
  const [machineEtc, setMachineEtc] = useState<string>("");

  // fn
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const body = {
      name: machineName,
      etc: machineEtc,
      comment: "",
    };

    setRegisterLoading(true);

    try {
      await createMachine(body);
      success();
      addToast({
        title: "추가되었습니다.",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error: any) {
      addToast({
        title: "Error",
        description: `Error Message: ${error.message}`,
        color: "danger",
      });
    } finally {
      setRegisterLoading(false);
    }
  };

  // 변경 내역 확인
  useEffect(() => {
    setIsDirty(machineName.trim() !== "");
  }, [machineName]);

  return (
    <form id="register-machine-form" onSubmit={handleSubmit}>
      <ul className="modal-form">
        <li>
          <LabeledInput
            label="장비명"
            required={true}
            setValue={setMachineName}
            value={machineName}
          />
        </li>
        <li>
          <LabeledInput
            label="기타사항"
            required={false}
            setValue={setMachineEtc}
            value={machineEtc}
          />
        </li>
      </ul>
    </form>
  );
};

export const RegisterMachineModal = ({ success }: { success: () => void }) => {
  // loading
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);
  // 변경 사항
  const [isDirty, setIsDirty] = useState<boolean>(false);

  return {
    title: "발급장비 등록",
    content: (
      <RegisterMachineForm
        setIsDirty={setIsDirty}
        setRegisterLoading={setRegisterLoading}
        success={success}
      />
    ),
    confirmButton: "등록",
    formId: "register-machine-form",
    loading: registerLoading,
    disabled: !isDirty,
    onRequestClose: () => {
      if (!isDirty) return true;
    },
    closePopover: {
      title: "변경된 내역이 있습니다.",
      description: "닫으시겠습니까?",
    },
  };
};
