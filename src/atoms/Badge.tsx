import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleExclamation,
  faCircleMinus,
  faCircleStop,
  faCircleXmark,
  faMinus,
  faPlay,
  faRepeat,
  faStop,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

export const HmacBadge = (hmac: any) => {
  return (
    <div>
      {hmac ? (
        <>
          <FontAwesomeIcon className="true-icon" icon={faCircleCheck} /> OK
        </>
      ) : (
        <>
          <FontAwesomeIcon className="false-icon" icon={faCircleXmark} />{" "}
          NONE{" "}
        </>
      )}
    </div>
  );
};

export const UserStatusBadge = (item: any) => {
  const status = item?.status;

  return (
    <div className={`status-badge`}>
      <FontAwesomeIcon
        className={status.toLowerCase()}
        icon={
          status === "ACTIVE"
            ? faCircleCheck
            : status === "INACTIVE"
              ? faCircleMinus
              : status === "EXPIRED"
                ? faCircleExclamation
                : status === "LOCKED"
                  ? faCircleStop
                  : faTriangleExclamation
        }
      />
      <p>
        {status === "ACTIVE"
          ? "활성화"
          : status === "INACTIVE"
            ? "비활성화"
            : status === "EXPIRED"
              ? "만료"
              : status === "LOCKED"
                ? "잠김"
                : "Error"}
      </p>
    </div>
  );
};

export const WorkStatusBadge = (item: any) => {
  const status = item?.status;
  const statusCss = status?.toLowerCase() ?? "none";

  return (
    <div className={`status-badge ${statusCss}`}>
      <FontAwesomeIcon
        icon={
          status === "START"
            ? faPlay
            : status === "STOP"
              ? faStop
              : status === "RESTORE"
                ? faRepeat
                : faMinus
        }
      />
      <p>{status}</p>
    </div>
  );
};
