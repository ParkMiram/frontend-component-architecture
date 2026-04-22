import { useResetRecoilState, useSetRecoilState } from "recoil";
import { useCallback } from "react";

import {
  errorState,
  expiredState,
  notifyState,
  successState,
} from "../recoil/modalState";
import {
  AppError,
  ExpiredType,
  NotifyType,
  SuccessType,
} from "../types/type/ModalType";

// error
export function useErrorModal() {
  const setError = useSetRecoilState(errorState);

  const openError = useCallback(
    (err: Partial<AppError>) => {
      setError(err as AppError);
    },
    [setError],
  );

  const closeError = useCallback(() => setError(null), [setError]);

  return { openError, closeError };
}

// notify
export function useNotifyModal() {
  const setNotify = useSetRecoilState(notifyState);
  const resetNotify = useResetRecoilState(notifyState);

  const openNotify = useCallback(
    (data: Partial<NotifyType>) => {
      setNotify(data as NotifyType);
    },
    [setNotify],
  );

  const closeNotify = useCallback(() => {
    resetNotify();
  }, [resetNotify]);

  return { openNotify, closeNotify };
}

// success
export function useSuccessModal() {
  const setSuccess = useSetRecoilState(successState);
  const resetSuccess = useResetRecoilState(successState);

  const openSuccess = useCallback(
    (data: Partial<SuccessType>) => {
      setSuccess(data as SuccessType);
    },
    [setSuccess],
  );

  const closeSuccess = useCallback(() => {
    resetSuccess();
  }, [resetSuccess]);

  return { openSuccess, closeSuccess };
}

// expired
export function useExpiredModal() {
  // const setExpired = useSetRecoilState(expiredState);
  // const resetExpired = useResetRecoilState(expiredState);
  // const [isOpen, setIsOpen] = useRecoilState(expiredModalOpenState);
  //
  // // 모달 열기 + 데이터 세팅
  // const openExpired = useCallback(
  //   (data: Partial<ExpiredType>) => {
  //     setExpired(data as ExpiredType);
  //     setIsOpen(true);
  //   },
  //   [setExpired, setIsOpen],
  // );
  //
  // // 모달 강제 닫기 (카운트다운에서 사용)
  // const closeExpired = useCallback(() => {
  //   setIsOpen(false);
  //   resetExpired();
  // }, [resetExpired, setIsOpen]);
  //
  // // HeroUI Modal onOpenChange에 연결할 함수
  // const onOpenChange = useCallback(
  //   (open: boolean) => {
  //     setIsOpen(open);
  //     if (!open) {
  //       resetExpired();
  //     }
  //   },
  //   [resetExpired, setIsOpen],
  // );
  //
  // return { openExpired, closeExpired, isOpen, onOpenChange };

  const setExpired = useSetRecoilState(expiredState);
  const resetExpired = useResetRecoilState(expiredState);

  const openExpired = useCallback(
    (data: Partial<ExpiredType>) => {
      setExpired(data as ExpiredType);
    },
    [setExpired],
  );

  const closeExpired = useCallback(() => {
    resetExpired();
  }, [resetExpired]);

  return { openExpired, closeExpired };
}
