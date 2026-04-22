import React, { useCallback, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useRecoilValue, useResetRecoilState } from "recoil";

import { Button, ModalButton } from "../atoms/Button";
import { ModalTitle } from "../molecules/Title";
import { notifyState } from "../recoil/modalState";

const NotifyModal = () => {
  // recoil
  const resetNotify = useResetRecoilState(notifyState);
  const notify = useRecoilValue(notifyState);

  // value
  const url = String(notify?.url ?? "");
  const message = String(notify?.message ?? "");

  // fn
  // onClose
  const onClose = useCallback(() => {
    resetNotify();
  }, [resetNotify]);

  // ESC로 닫기
  useEffect(() => {
    if (!notify) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [notify, onClose]);

  // 배경 클릭으로 닫기
  const onBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.currentTarget === e.target) onClose();
    },
    [onClose],
  );

  if (!notify) return null;

  return (
    <div
      className="modal-backdrop"
      style={{ zIndex: 1 }}
      onClick={onBackdropClick}
    >
      <div className="modal-container">
        <div className="modal-header">
          <ModalTitle>
            <FontAwesomeIcon
              color="var(--color-yellow)"
              icon={faCircleExclamation}
            />
            {url ?? "NOTIFY"}
          </ModalTitle>
          <Button color="#adb5bd" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </div>

        <div className="modal-content">
          <p className="error-message">{message}</p>
        </div>

        <div className="modal-button-box">
          <ModalButton
            className="close"
            style={{
              marginRight: 0,
              backgroundColor: "rgba(255, 165, 0, 0.1)",
              color: "var(--color-yellow)",
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

export default NotifyModal;
