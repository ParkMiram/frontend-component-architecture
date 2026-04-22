import { recoilPersist } from "recoil-persist";

export const { persistAtom } = recoilPersist({
  key: "recoil-persist",
  storage: typeof window !== "undefined" ? sessionStorage : undefined,
  /**
   * localStorage가 아닌 sessionStorage에 저장하는 이유
   * 1. 로그인 중이던 탭을 닫으면 데이터 사라짐
   * 2. local은 같은 도메인을 가진 모든 탭에 공유를 하기 때문에 상태가 섞일 수 있지만,
   *    session은 탭 단위로 분리(공유X)하기 때문에 여러 탭을 띄워도 상태가 섞이지 않음
   * 3. local은 상태가 오랫동안 쌓이기 때문에 어제 값이 남아있을 수 있지만,
   *    session은 새로 시작함
   */
});

export const persistAtomWithStorage = JSON.parse(
  sessionStorage.getItem("recoil-persist") as string,
);
