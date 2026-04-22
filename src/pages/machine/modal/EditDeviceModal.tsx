import React, { useEffect, useState } from "react";
import { addToast } from "@heroui/react";

import { LabeledInput } from "@/molecules/StyledForm.tsx";
import { allowIpInput, increaseIp, isValidIp } from "@/utils/ipUtils.ts";
import { useUpdateDeviceSelector } from "@/recoil/atoms/machine.ts";

const EditDeviceForm = ({
  info,
  setEditLoading,
  setIsDirty,
  success,
}: {
  info: any;
  setEditLoading: (v: boolean) => void;
  setIsDirty: (v: boolean) => void;
  success: () => void;
}) => {
  // recoil
  const updateDevice = useUpdateDeviceSelector();

  // state
  const [deviceIp, setDeviceIp] = useState<string>(info.ip);

  useEffect(() => {
    setIsDirty(deviceIp !== info.ip);
  }, [deviceIp, info.ip]);

  // ip 입력 input 제한
  const handleIpChange = (value: string) => {
    if (allowIpInput(value)) {
      setDeviceIp(value);
    }
  };

  // 수정
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setEditLoading(true);

    const body = {
      name: info.name,
      mcn_uid: info.mcn_uid,
      ip: deviceIp,
      rom_ver: info.rom_ver,
      comment: "",
    };

    try {
      if (!deviceIp) {
        addToast({
          title: "IP를 입력해 주세요.",
          color: "warning",
          timeout: 3000,
        });

        return;
      }

      const editIp = increaseIp(deviceIp, 0);

      if (!editIp) {
        addToast({
          title: "생성 가능한 IP 범위를 초과했습니다.",
          description: `255.255.255.255 이후 IP는 생성할 수 없습니다.`,
          color: "warning",
          timeout: 3000,
        });

        return;
      }

      if (!isValidIp(deviceIp)) {
        addToast({
          title: "IP를 올바르게 입력해 주세요.",
          color: "warning",
          timeout: 3000,
        });

        return;
      }

      // TODO 중복된 IP일 경우 막아야 함 (백엔드 필요)
      await updateDevice(info.dve_uid, body);
      success();
      addToast({
        title: "수정되었습니다.",
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
      setEditLoading(false);
    }
  };

  return (
    <form id="edit-device-form" onSubmit={handleSubmit}>
      <ul className="modal-form">
        <li>
          <LabeledInput
            disabled={true}
            label="디바이스명"
            required={false}
            value={info.name}
          />
        </li>
        <li>
          <LabeledInput
            label="IP"
            required={false}
            setValue={handleIpChange}
            value={deviceIp}
          />
        </li>
      </ul>
    </form>
  );
};

export const EditDeviceModal = ({
  info,
  success,
}: {
  info: any;
  success: () => void;
}) => {
  // loading
  const [editLoading, setEditLoading] = useState<boolean>(false);
  // 변경 사항
  const [isDirty, setIsDirty] = useState<boolean>(false);

  return {
    title: "디바이스 수정",
    content: (
      <EditDeviceForm
        info={info}
        setEditLoading={setEditLoading}
        setIsDirty={setIsDirty}
        success={success}
      />
    ),
    confirmButton: "수정",
    formId: "edit-device-form",
    loading: editLoading,
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
