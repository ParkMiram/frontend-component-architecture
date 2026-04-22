import React, { useEffect, useState } from "react";
import {
  addToast,
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Key } from "@react-types/shared";

import {
  LabeledInput,
  LabeledInputWithButton,
} from "@/molecules/StyledForm.tsx";
import { allowIpInput, increaseIp, isValidIp } from "@/utils/ipUtils.ts";

// data
type Device = {
  name: string;
  ip: string;
};

const AddDeviceForm = ({
  mcnUid,
  ips = [],
  setAddLoading,
  setIsDirty,
  success,
}: {
  mcnUid: string;
  ips: string[];
  setAddLoading: (v: boolean) => void;
  setIsDirty: (v: boolean) => void;
  success: () => void;
}) => {
  // state
  const [deviceCount, setDeviceCount] = useState<number>(1);
  const [deviceStartIp, setDeviceStartIp] = useState<string>("");
  const [deviceList, setDeviceList] = useState<Device[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Set<Key>>(new Set());

  // fn
  // 디바이스 추가
  const addDevice = () => {
    if (!deviceStartIp) {
      addToast({
        title: "IP를 입력해 주세요.",
        color: "warning",
        timeout: 3000,
      });

      return;
    }

    const newDevices: Device[] = [];

    for (let i = 0; i < deviceCount; i++) {
      const ip = increaseIp(deviceStartIp, i);

      if (!ip) {
        addToast({
          title: "생성 가능한 IP 범위를 초과했습니다.",
          description: `255.255.255.255 이후 IP는 생성할 수 없습니다.`,
          color: "warning",
          timeout: 3000,
        });

        return;
      }

      // 중복 IP 검사
      // TODO 다른 디바이스의 IP는 중복 검사 안 함 => 백엔드와 논의 필요
      const isDuplicate =
        deviceList.some((d) => d.ip === ip) || ips.includes(ip);

      if (isDuplicate) {
        addToast({
          title: "이미 등록된 IP입니다.",
          description: `IP: ${ip}`,
          color: "warning",
          timeout: 3000,
        });

        return;
      }

      const lastIp = ip.split(".").pop();
      const name = `dve_${deviceList.length + i + 1}_ip_${lastIp}_${mcnUid}`;

      newDevices.push({
        name,
        ip,
      });
    }

    if (!isValidIp(deviceStartIp)) {
      addToast({
        title: "IP를 올바르게 입력해 주세요.",
        color: "warning",
        timeout: 3000,
      });

      return;
    }

    setDeviceList((prev) => [...prev, ...newDevices]);
  };

  // Device 이름 규칙: dve_{index}_ip_{lastIp}_{mcn_uid}
  // ip 입력 input 제한
  const handleIpChange = (value: string) => {
    if (allowIpInput(value)) {
      setDeviceStartIp(value);
    }
  };

  // 디바이스 삭제 목록
  const removeSelectedDevices = () => {
    setDeviceList((prev) =>
      prev.filter((device) => !selectedKeys.has(device.name)),
    );

    setSelectedKeys(new Set());
  };

  // 저장
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setAddLoading(true);

    try {
      // 테스트용 await (api 제대로 만들어지면 삭제)
      await new Promise((r) => setTimeout(r, 1000));
      success();
      addToast({
        title: "백엔드 구현 필요",
        description: "dev_{num}을 어떻게 넣어야 할지 논의 필요",
        color: "danger",
        timeout: 3000,
      });
    } catch (error: any) {
      addToast({
        title: "Error",
        description: `Error Message: ${error.message}`,
        color: "danger",
      });
    } finally {
      setAddLoading(false);
    }
  };

  // useEffect
  useEffect(() => {
    setIsDirty(deviceList.length !== 0);
  }, [deviceList]);

  return (
    <form id="add-device-form" onSubmit={handleSubmit}>
      <ul className="modal-form">
        <li className="flex justify-between gap-3 items-center">
          <div className="flex-2">
            <LabeledInput
              label="IP"
              placeholder="IP 입력"
              required={false}
              setValue={handleIpChange}
              value={deviceStartIp}
            />
          </div>
          <div className="flex-1">
            <LabeledInputWithButton
              buttonText="추가"
              handleButton={async () => addDevice()}
              label="개수"
              min={1}
              required={false}
              setValue={setDeviceCount}
              useNumber={true}
              value={deviceCount}
            />
          </div>
        </li>
        <li className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">추가 목록</span>
            <Button
              isIconOnly
              color="danger"
              isDisabled={selectedKeys.size === 0}
              radius="md"
              size="sm"
              variant="flat"
              onPress={removeSelectedDevices}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </Button>
          </div>
          <Table
            removeWrapper
            classNames={{
              emptyWrapper: "text-sm h-9",
            }}
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            onSelectionChange={(keys) => setSelectedKeys(keys as Set<Key>)}
          >
            <TableHeader>
              <TableColumn className="w-1/2">디바이스명</TableColumn>
              <TableColumn className="w-1/2">IP</TableColumn>
            </TableHeader>
            <TableBody emptyContent="IP를 추가해 주세요." items={deviceList}>
              {(item) => (
                <TableRow key={item.name}>
                  <TableCell className="w-1/2">{item.name}</TableCell>
                  <TableCell className="w-1/2">{item.ip}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </li>
      </ul>
    </form>
  );
};

export const AddDeviceModal = ({
  mcnUid,
  ips = [],
  success,
}: {
  mcnUid: string;
  ips: string[];
  success: () => void;
}) => {
  // loading
  const [addLoading, setAddLoading] = useState<boolean>(false);
  // 변경 사항
  const [isDirty, setIsDirty] = useState<boolean>(false);

  return {
    title: "디바이스 추가",
    content: (
      <AddDeviceForm
        ips={ips}
        mcnUid={mcnUid}
        setAddLoading={setAddLoading}
        setIsDirty={setIsDirty}
        success={success}
      />
    ),
    confirmButton: "저장",
    formId: "add-device-form",
    loading: addLoading,
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
