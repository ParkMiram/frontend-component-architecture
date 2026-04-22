import React, { createContext, useCallback, useContext, useState } from "react";
import { RecoilRoot } from "recoil";

const RecoilResetContext = createContext<() => void>(() => {});

export const useRecoilRootReset = () => useContext(RecoilResetContext);

export function RecoilRootWithReset({
  children,
}: {
  children: React.ReactNode;
}) {
  const [key, setKey] = useState(0);
  const reset = useCallback(() => setKey((k) => k + 1), []);

  return (
    <RecoilResetContext.Provider value={reset}>
      <RecoilRoot key={key}>{children}</RecoilRoot>
    </RecoilResetContext.Provider>
  );
}
