import React, { useCallback, useEffect, useMemo } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

import { ModalTitle } from "../molecules/Title";
import { SuccessType } from "../types/type/ModalType";
import { Button, ModalButton } from "../atoms/Button";
import { successState } from "../recoil/modalState";

// 성공 메시지
function buildSuccessMessage(success: SuccessType) {
  if (!success) return { title: "", body: "" };
  const title = success.url ?? "";
  const body = success.message ?? "";

  return { title, body };
}

const SuccessModal: React.FC = () => {
  // recoil
  const resetSuccess = useResetRecoilState(successState);
  const success = useRecoilValue(successState);
  // success
  const { title, body } = useMemo(
    () => buildSuccessMessage(success),
    [success],
  );

  // fn
  const onClose = useCallback(() => {
    resetSuccess();
  }, [resetSuccess]);

  // ESC로 닫기
  useEffect(() => {
    if (!success) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [success, onClose]);

  // 배경 클릭으로 닫기
  const onBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.currentTarget === e.target) onClose();
    },
    [onClose],
  );

  if (!success) return null;

  return (
    <div
      className="modal-backdrop"
      style={{ zIndex: 1 }}
      onClick={onBackdropClick}
    >
      <div className="modal-container">
        <div className="modal-header">
          <ModalTitle>
            <FontAwesomeIcon color="var(--color-green)" icon={faCircleCheck} />
            {title ? `${title} SUCCESS` : "SUCCESS"}
          </ModalTitle>
          <Button color="#adb5bd" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </div>
        <div className="modal-content">
          <p className="success-message">{body || success.message}</p>
        </div>

        <div className="modal-button-box">
          <ModalButton
            className="close"
            style={{
              marginRight: 0,
              backgroundColor: "rgba(28, 168, 132, 0.1)",
              color: "var(--color-green)",
            }}
            onClick={onClose}
          >
            닫기
          </ModalButton>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
