import { atom } from "recoil";

export const expiredDismissedState = atom<boolean | null>({
  key: "expiredDismissedState",
  default: null,
});

export const authErrorState = atom<boolean>({
  key: "authErrorState",
  default: false,
});
