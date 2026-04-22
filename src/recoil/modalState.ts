import { atom } from "recoil";

import {
  AppError,
  ExpiredType,
  LoadingType,
  NotifyType,
  SuccessType,
} from "../types/type/ModalType";

export const errorState = atom<AppError>({
  key: "errorState",
  default: null,
});

export const successState = atom<SuccessType>({
  key: "successState",
  default: null,
});

export const notifyState = atom<NotifyType>({
  key: "notifyState",
  default: null,
});

export const expiredState = atom<ExpiredType>({
  key: "expiredState",
  default: null,
});

export const loadingState = atom<LoadingType>({
  key: "loadingState",
  default: null,
});
