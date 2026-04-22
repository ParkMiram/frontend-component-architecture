import React, { useCallback } from "react";

import { Refreshable } from "../types/type/refresh";

export function useParamsRefetch<T extends Refreshable<object>>(
  setParams: React.Dispatch<React.SetStateAction<T>>,
) {
  return useCallback(() => {
    setParams((prev) => ({
      ...prev,
      __refresh: Date.now(), // 타입 강제 캐스팅 없이 안전
    }));
  }, [setParams]);
}
