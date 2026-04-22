import React, { useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useResetRecoilState } from "recoil";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDraggable,
} from "@heroui/react";

import { AppError } from "../types/type/ModalType";
import { errorState } from "../recoil/modalState";

// 에러 메시지
function buildErrorMessage(error: AppError) {
  if (!error) return { title: "", code: "", body: "" };
  const title = error.url ?? "";
  const code = String(error.code ?? error.rtnCode ?? "");
  const body = String(error.message ?? error.rtnMessage ?? "");

  return { title, code, body };
}
// 토큰 만료
function isTokenExpired(error: AppError) {
  if (!error) return false;

  return (
    error.url === "Authentication token expired" ||
    error.url === "OTP code expired"
  );
}
// 401 error
function is401(error: AppError) {
  if (!error) return false;

  return String(error.code ?? "").includes("401");
}

const ErrorModal: React.FC = () => {
  // var
  const navigate = useNavigate();
  // recoil
  const resetError = useResetRecoilState(errorState);
  const error = useRecoilValue(errorState);
  const useSession = true;
  // error
  const { title, code, body } = useMemo(
    () => buildErrorMessage(error),
    [error],
  );

  // modal config
  const targetRef = useRef(null);
  const { moveProps } = useDraggable({ targetRef, isDisabled: false });

  // fn
  const handleClose = useCallback(() => {
    // 1) 로그인 에러: 즉시 새로고침
    if (error?.rtnCode === "020011") {
      resetError();
      window.location.reload();

      return;
    }

    // 2) 토큰/OTP 만료 → 홈으로
    if (isTokenExpired(error)) {
      resetError();
      navigate("/");

      return;
    }

    // 3) 401류 → 스토리지 정리 + 홈으로
    if (is401(error)) {
      if (useSession) sessionStorage.clear();
      else localStorage.clear();
      resetError();
      navigate("/");

      return;
    }

    // 4) 특정 코드에서 전체 리로드 필요
    if (error?.code === "SP8001" || error?.code === "000019") {
      resetError();
      window.location.reload();

      return;
    }

    // 5) 그 외
    resetError();
  }, [error, resetError, navigate, useSession]);

  if (!error) return null;

  return (
    <Modal
      ref={targetRef}
      classNames={{
        wrapper: "z-[999]",
        backdrop: "z-[998]",
      }}
      isDismissable={false}
      isOpen={true}
      scrollBehavior={"inside"}
      // onOpenChange={(open) => {
      //   if (!open) handleClose();
      // }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader {...moveProps}>
              {title ? `${title} ERROR` : "ERROR"}
            </ModalHeader>
            <ModalBody>
              {code ? (
                <p className="error-code">
                  Error Code: <span>{code}</span>
                </p>
              ) : null}
              <p className="error-message">{body || error.message}</p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                // variant="flat"
                type="submit"
                onPress={() => {
                  onClose();
                  handleClose();
                }}
              >
                확인
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ErrorModal;
