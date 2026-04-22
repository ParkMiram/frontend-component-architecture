import { Chip } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faCircleCheck,
  faCircleExclamation,
  faCircleMinus,
  faCirclePause,
  faCirclePlay,
  faCircleStop,
  faLock,
  faLockOpen,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

export const BasicChip = ({ value }: { value: string }) => {
  return (
    <Chip color="default" radius="md" variant="bordered">
      {value}
    </Chip>
  );
};

export const StatusChip = ({ value }: { value: any }) => {
  return (
    <Chip
      className="status-chip"
      color={
        value.status === "ACTIVE"
          ? "success"
          : value.status === "INACTIVE"
            ? "danger"
            : value.status === "EXPIRED"
              ? "warning"
              : value.status === "LOCKED"
                ? "default"
                : undefined
      }
      radius="md"
      startContent={
        <FontAwesomeIcon
          icon={
            value.status === "ACTIVE"
              ? faCircleCheck
              : value.status === "INACTIVE"
                ? faCircleMinus
                : value.status === "EXPIRED"
                  ? faCircleExclamation
                  : value.status === "LOCKED"
                    ? faCircleStop
                    : faTriangleExclamation
          }
        />
      }
      variant="flat"
    >
      {value.status === "ACTIVE" || value === "활성 (사용중)"
        ? "활성화"
        : value.status === "INACTIVE" || value === "비활성"
          ? "비활성화"
          : value.status === "EXPIRED"
            ? "만료됨"
            : value.status === "LOCKED"
              ? "잠김"
              : "-"}
    </Chip>
  );
};

export const WorkStatusChip = ({ value }: { value: any }) => {
  return (
    <Chip
      className="status-chip"
      color={
        value === "RUNNING" || value === "Active"
          ? "primary"
          : value === "ON_STOP" || value === "Paused"
            ? "warning"
            : value === "NONE" || value === "Error"
              ? "danger"
              : value === "FINISHED"
                ? "success"
                : undefined
      }
      radius="md"
      startContent={
        <FontAwesomeIcon
          icon={
            value === "RUNNING" || value === "Active"
              ? faCirclePlay
              : value === "ON_STOP" || value === "Paused"
                ? faCirclePause
                : value === "NONE" || value === "Error"
                  ? faCircleMinus
                  : value === "FINISHED"
                    ? faCircleStop
                    : faTriangleExclamation
          }
        />
      }
      variant="flat"
    >
      {value === "RUNNING" || value === "Active"
        ? "발급 중"
        : value === "ON_STOP" || value === "Paused"
          ? "중지"
          : value === "FINISHED" || value === "Error"
            ? "종료"
            : "에러"}
    </Chip>
  );
};

export const LockChip = ({ value }: { value: string }) => {
  return (
    <Chip
      className="status-chip"
      color="default"
      radius="md"
      startContent={
        <FontAwesomeIcon
          color={value === "TRUE" ? "#888" : "#CCC"}
          icon={value === "TRUE" ? faLock : faLockOpen}
          size="xs"
        />
      }
      variant="light"
    >
      {value}
    </Chip>
  );
};

export const ProgramStatusChip = ({ value }: { value: string }) => {
  return (
    <Chip
      className="status-chip"
      color={
        value === "ACTIVE"
          ? "success"
          : value === "INACTIVE"
            ? "danger"
            : "default"
      }
      radius="md"
      startContent={
        <FontAwesomeIcon
          icon={
            value === "ACTIVE"
              ? faCircleCheck
              : value === "INACTIVE"
                ? faCircleMinus
                : faTriangleExclamation
          }
        />
      }
      variant="flat"
    >
      {value === "ACTIVE"
        ? "활성화"
        : value === "INACTIVE"
          ? "비활성화"
          : "NONE"}
    </Chip>
  );
};

export const ActiveChip = ({ value }: { value: string }) => {
  return (
    <>
      <FontAwesomeIcon
        color={value || value === "ACTIVE" ? "#17C964" : "#F31260"}
        icon={faCircle}
        size="2xs"
      />
      <span className="pl-1">
        {value === "ACTIVE"
          ? "활성화"
          : value === "INACTIVE"
            ? "비활성화"
            : String(value).toUpperCase()}
      </span>
    </>
  );
};
