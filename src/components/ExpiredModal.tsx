import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDraggable,
} from "@heroui/react";
import { useCallback, useMemo, useRef, useState } from "react";
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";

import { ExpiredType } from "@/types/type/ModalType.ts";
import { expiredState } from "@/recoil/modalState.ts";
import { authAtom, extendLogin } from "@/recoil/atoms/auth.ts";

function countdown(expired: ExpiredType) {
  if (!expired) return { time: "", expiredDismissed: null };

  return {
    time: expired.time ?? "",
    expiredDismissed: expired.expiredDismissed,
  };
}

const ExpiredModal = () => {
  // recoil
  const resetExpired = useResetRecoilState(expiredState);
  const expired = useRecoilValue(expiredState);

  const setAuth = useSetRecoilState(authAtom);

  // modal config
  const targetRef = useRef(null);
  const isOpen = !!expired;
  const { moveProps } = useDraggable({ targetRef, isDisabled: !isOpen });

  // state
  const { time, expiredDismissed } = useMemo(
    () => countdown(expired),
    [expired],
  );
  const [loading, setLoading] = useState(false);

  // fn
  // close
  const handleClose = useCallback(() => {
    if (expiredDismissed) sessionStorage.setItem("expiredDismissed", "1");
    resetExpired();
  }, [expiredDismissed, resetExpired]);

  // submit
  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
      const result = await extendLogin();

      if (result?.header?.rtnCode === "000000") {
        const token = result?.body?.accessToken;

        if (token) {
          setAuth((prev) => ({
            ...prev,
            token: {
              ...prev.token,
              accessToken: token.accessToken,
              expiredCount: Number(token.expiredCount),
            },
            timeOver: Number(token.expired),
          }));
        }

        sessionStorage.removeItem("expiredDismissed");
        setLoading(false);

        addToast({
          title: "로그인 시간이 연장되었습니다.",
          color: "success",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });

        handleClose();
        resetExpired();
      } else {
        setLoading(false);
        handleClose();
        addToast({
          title: `Error Code: ${result.header.rtnCode}`,
          description: result.header.rtnMessage,
          color: "danger",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
      }
    } catch (err: any) {
      setLoading(false);
      addToast({
        title: `Error`,
        description: err,
        color: "danger",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });

      handleClose();
    }
  }, [handleClose, setAuth]);

  return (
    <Modal
      ref={targetRef}
      classNames={{
        wrapper: "z-[9999]",
        backdrop: "z-[9998]",
      }}
      isDismissable={false}
      isOpen={isOpen}
      scrollBehavior={"inside"}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader {...moveProps} className="flex flex-col gap-1">
              로그인 시간 연장
            </ModalHeader>
            <ModalBody>
              {time ? <div className="timer">{time}</div> : null}
              <p>로그인 시간을 연장하시겠습니까?</p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onPress={() => {
                  onClose();
                  handleClose();
                }}
              >
                닫기
              </Button>
              <Button
                color="primary"
                disabled={loading}
                type="submit"
                onPress={handleSubmit}
              >
                연장하기
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ExpiredModal;
