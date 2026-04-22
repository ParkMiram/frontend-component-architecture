/**
 * KMS api에 맞춰 만든 훅입니다.
 * 현재는 로그인, 사용자 목록 조회에서만 사용되고 있습니다.
 */

import { useCallback, useEffect } from "react";
import { SetterOrUpdater, useSetRecoilState } from "recoil";

import { AtomListState } from "../utils/customCreateAtom";
import { AppError, LocalError } from "../types/type/ModalType";
import { errorState } from "../recoil/modalState";

// 1) 서버 응답에 맞게 Err 변환
const toAppError = (err: any): Exclude<AppError, null> => {
  if (!err) return { code: "UNKNOWN_ERROR", message: "알 수 없는 오류 발생" };
  if (typeof err === "string") return { message: err };

  const status = err?.response?.status ?? err?.status;
  const data = err?.response?.data ?? {};

  return {
    url: err?.url ?? err?.response?.url,
    code: err?.code ?? status ?? err?.rtnCode,
    rtnCode: err?.rtnCode,
    message:
      err?.message ??
      data?.message ??
      err?.rtnMessage ??
      "알 수 없는 오류 발생",
    rtnMessage: err?.rtnMessage,
  };
};

export function useFetchList(
  params: Record<string, any>,
  ops: {
    setState: SetterOrUpdater<AtomListState>;
    fetchList: (p: Record<string, any>) => Promise<any>;
    setHeaderInfos: any;
    setList: any;
    setTotCnt?: (v: number) => void;
  },
  opts?: {
    // params 변경 시 자동 호출 (기본 true)
    auto?: boolean;
    deps?: any[];
    notifyError?: boolean;
  },
  items?: string,
) {
  const { setState, fetchList, setHeaderInfos, setList, setTotCnt } = ops;
  const auto = opts?.auto ?? true;
  const deps = opts?.deps ?? [params];
  const notifyError = opts?.notifyError ?? true;

  const setGlobalError = useSetRecoilState(errorState);

  const run = useCallback(
    async (p: Record<string, any> = params) => {
      // 로딩 시작
      setState((s) => ({ ...s, loading: true, error: null }));
      const fail = (errObj: any) => {
        const appErr = toAppError(errObj);

        // 로컬 상태용
        const localErr: LocalError = {
          code:
            (appErr?.code as string | number | undefined) ??
            (appErr?.rtnCode as string | number | undefined) ??
            "UNKNOWN_ERROR",
          message: appErr?.message ?? appErr?.rtnMessage,
          details: appErr?.url,
        };

        // 로컬 상태 리셋
        setState({ data: null, loading: false, error: localErr });
        setHeaderInfos([]);
        setList([]);
        setTotCnt?.(0);

        // 전역 모달
        if (notifyError) setGlobalError(appErr);
      };

      try {
        const res = await fetchList(p);

        const hasErrorField = typeof res === "object" && res && "error" in res;

        if (hasErrorField && (res as any).error) {
          fail((res as any).error);

          return;
        }

        const body = (res as any)?.body ?? (res as any)?.data ?? res;

        if (!body) {
          fail({ code: "UNKNOWN_ERROR", message: "Unknown error" });

          return;
        }

        // 성공
        const headerInfos = body.headerInfos ?? [];
        const list =
          items != null ? body[items] : (body.items ?? body.list ?? []);
        const totalCnt = body.totalCnt ?? body.totCnt ?? body.total ?? 0;

        setHeaderInfos(headerInfos);
        setList(list);
        setTotCnt?.(Number(totalCnt));
        setState({ data: body, loading: false, error: null });
      } catch (e: any) {
        fail(e);
      }
    },
    [
      params,
      setState,
      setHeaderInfos,
      setList,
      setTotCnt,
      notifyError,
      setGlobalError,
      fetchList,
      items,
    ],
  );

  useEffect(() => {
    if (auto) run();
  }, deps);

  return { refetch: run };
}
