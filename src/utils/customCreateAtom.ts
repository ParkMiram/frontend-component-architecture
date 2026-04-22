import { atom } from "recoil";

import { persistAtom } from "./recoilPersistEffect";

type AtomListBody = { headerInfos: boolean; items: any[]; totCnt: number };
export type AtomListState = {
  data: AtomListBody | null;
  loading: boolean;
  error: null | { code: string | number; message?: string; details?: string };
};

export const customCreateAtom = (key: string) => {
  return atom<AtomListState>({
    key,
    default: { data: null, loading: false, error: null },
    effects_UNSTABLE: [persistAtom],
  });
};
