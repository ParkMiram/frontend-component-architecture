import { useRecoilValueLoadable } from "recoil";
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Snippet,
  Spinner,
} from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsStaggered,
  faCircleChevronDown,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";

import { fetchDeviceByMachineSelector } from "@/recoil/atoms/machine.ts";

const DeviceByMachine = React.memo(function DeviceByMachine({
  mcnName,
  addModal,
  editModal,
  expandedKeys,
  setExpandedKeys,
}: {
  mcnName: string;
  addModal: (uid: string, ips: string[]) => void;
  editModal: (info: any) => void;
  expandedKeys: Set<string>;
  setExpandedKeys: React.Dispatch<React.SetStateAction<Set<string>>>;
}) {
  const isOpen = expandedKeys.has(mcnName);

  // recoil
  const deviceLoadable = useRecoilValueLoadable(
    fetchDeviceByMachineSelector({ machineId: mcnName, enabled: isOpen }),
  );

  // accordion 펼침
  const handleChange = () => {
    setExpandedKeys((prev) => {
      const newSet = new Set(prev);

      newSet.has(mcnName) ? newSet.delete(mcnName) : newSet.add(mcnName);

      return newSet;
    });
  };

  // ip 목록
  const existingIps =
    deviceLoadable.state === "hasValue" &&
    Array.isArray(deviceLoadable.contents)
      ? deviceLoadable.contents.map((d: any) => d.ip)
      : [];

  const renderContent = () => {
    if (!isOpen) return null;

    if (deviceLoadable.state === "loading") {
      return <Spinner />;
    }

    if (deviceLoadable.state === "hasError") {
      return <div className="text-gray-500">불러오기 실패</div>;
    }

    if (deviceLoadable.state === "hasValue") {
      const devices = deviceLoadable.contents;

      if (Array.isArray(devices) && devices.length > 0) {
        return (
          <ul className="list-disc pl-1 space-y-3 text-sm">
            {devices.map((device: any, index: number) => (
              <li
                key={device.id ?? device.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="device-count">{index + 1}</span>
                  <span className="mr-1">디바이스명:</span>
                  <Snippet hideCopyButton symbol="" variant="flat">
                    {device.name}
                  </Snippet>
                  <span className="ml-3">IP:</span>
                  <Snippet
                    classNames={{
                      copyButton: "h-4 w-4 min-w-4",
                      copyIcon: "text-2xs",
                    }}
                    symbol=""
                    variant="flat"
                  >
                    {device.ip}
                  </Snippet>
                </div>
                <Button
                  isIconOnly
                  className="min-w-8"
                  size="sm"
                  variant="light"
                  onPress={() => editModal(device)}
                >
                  <FontAwesomeIcon icon={faPen} size="xs" />
                </Button>
              </li>
            ))}
          </ul>
        );
      }

      return <div className="text-gray-400">디바이스 없음</div>;
    }

    return null;
  };

  return (
    <Accordion
      className="device-accordion"
      selectedKeys={isOpen ? new Set([mcnName]) : new Set()}
      onSelectionChange={handleChange}
    >
      <AccordionItem
        key={mcnName}
        indicator={<></>}
        startContent={
          <FontAwesomeIcon
            color="var(--color-secondary)"
            icon={faCircleChevronDown}
          />
        }
        subtitle="클릭하여 디바이스 목록 보기"
        title={mcnName}
      >
        <Card className="shadow-small">
          <CardHeader className="flex gap-2 justify-between">
            <div className="flex gap-2 items-center">
              <FontAwesomeIcon color="var(--gray-600)" icon={faBarsStaggered} />
              <p>디바이스 목록</p>
            </div>
            <Button
              color="primary"
              size="sm"
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onPress={() => addModal(mcnName, existingIps)}
            >
              디바이스 추가
            </Button>
          </CardHeader>
          <Divider />
          <CardBody>{renderContent()}</CardBody>
        </Card>
      </AccordionItem>
    </Accordion>
  );
});

export default DeviceByMachine;
