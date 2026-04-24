# 🔍 리스트 조회 로직 구조 개선

## 1. 프로젝트 개요

> 분산되어 있던 데이터 조회 로직을 상태 기반 아키텍처로 재설계하여  
> 재사용성과 유지보수성을 동시에 개선한 프로젝트

기존에는 각 View 페이지마다 데이터 조회 로직이 중복 구현되어 있었으며,  
이를 Custom Hook과 params 기반 구조로 통합하여 공통화했습니다.

- 역할: 프론트엔드 개발
- 기술: React, TypeScript, Recoil
- 대상: 리스트 조회 기능이 포함된 여러 View 페이지

---

## 2. 문제 상황 (Before)

기존 구조에서는 각 View 페이지마다  
데이터 조회 및 상태 관리 로직이 **중복 구현**되어 있었습니다.

### 주요 문제

- 동일한 API 호출 로직이 여러 파일에 반복
- 페이지네이션 / 검색 / 정렬 로직 중복
- dispatch 기반 상태 처리 코드 반복
- 코드 길이 증가로 가독성 저하
- 수정 시 여러 파일을 함께 수정해야 하는 구조

👉 결과적으로 **유지보수가 어려운 구조**

---

## 3. 해결 과정 (How)

### 3.1 공통 fetch 로직을 Custom Hook으로 분리

데이터 조회 로직을 `useFetchList` hook으로 분리하여  
API 호출, 상태 관리, 에러 처리를 한 곳에서 관리하도록 개선했습니다.  

#### 핵심 설계

- API 요청 구조 통일
- params 기반 동작 → 재사용성 확보
- loading / error / data 상태 일관되게 관리

(관련 코드: `src/hooks/fetchListData.ts`의 `useFetchList`)

---

### 3.2 에러 처리 구조 표준화

서버 에러 형식이 일정하지 않은 문제를 해결하기 위해  
`toAppError` 유틸을 도입하여 에러를 표준화했습니다.  

#### 개선 내용

- 다양한 에러 형식을 하나의 구조로 변환
- 전역 에러 상태 관리 (Recoil)
- ErrorModal을 통한 공통 UI 처리

#### 구조

- Local Error → 컴포넌트 내부 처리
- Global Error → 공통 UI 표시


(관련 코드: `src/hooks/fetchListData.ts`의 `toAppError`)

---

### 3.3 상태 변경 기반 재조회 구조 설계

기존에는 fetch 함수를 직접 호출하는 방식이었지만,  
이를 **params 상태 변경 기반 구조**로 변경했습니다.

```ts
setParams(prev => ({ ...prev, filter: value }))
```
#### 개선 효과
- 페이지 / 검색 / 정렬 변경 시 부분 업데이트 가능
- 불필요한 로직 제거
- 데이터 흐름 단순화

---

### 3.4 재조회 트리거 Hook 추가

강제 재조회가 필요한 경우를 위해
`useParamsRefetch` hook을 추가했습니다.

```ts
export function useParamsRefetch<T extends object>(
  setParams: React.Dispatch<React.SetStateAction<T>>
) {
  return useCallback(() => {
    setParams(prev => ({
      ...prev,
      __refresh: Date.now(), // 값 변경을 통해 강제 재조회 트리거
    }));
  }, [setParams]);
}
```

#### 특징

* 기존 params 기반 구조를 유지하면서 재조회 가능
* fetch 함수를 직접 호출하지 않아도 됨
* 상태 변경 흐름을 깨지 않는 일관된 구조 유지

(관련 코드: `src/hooks/useParamRefetch.ts`)

---

### 3.5 검색 UI 컴포넌트 분리

검색 영역 (input / 검색 / 초기화)을
`Search` 컴포넌트로 분리했습니다.

#### 개선 효과

* View 코드에서 비즈니스 로직 감소
* UI 재사용성 증가
* 컴포넌트 구조 단순화

(관련 코드: `src/molecules/Search.tsx`)

---

## 4. 결과 (After)

### ✅ 개선 결과

* 동일 로직을 여러 페이지에서 재사용 가능하도록 구조 개선
* 데이터 조회 관련 코드가 View에서 제거되어 역할 분리 명확화

---

## 5. Before vs After 비교

| 항목     | Before        | After        |
| ------ | ------------- | ------------ |
| 데이터 조회 | 각 페이지마다 개별 구현 | 공통 hook으로 통합 |
| 재조회 방식 | fetch 직접 호출   | params 변경 기반 |
| 에러 처리  | 페이지별 개별 처리    | 표준화 + 전역 관리  |
| 코드 구조  | 중복 많음         | 재사용 구조       |

---

## 6. 핵심 인사이트

이 작업을 통해 얻은 가장 큰 인사이트:

> 데이터 흐름을 "함수 호출"이 아니라 "상태 변화" 중심으로 설계하면  
> 구조가 단순해지고 재사용성이 크게 향상된다.

또한,

- 반복되는 로직은 Custom Hook으로 추상화해야 한다
- UI와 비즈니스 로직을 분리하면 유지보수가 쉬워진다
- 에러 처리 구조는 초기에 통일하는 것이 중요하다

---

## 7. 요약

* 중복되던 데이터 조회 로직을 Custom Hook으로 통합
* params 기반 상태 관리로 데이터 흐름 단순화
* 에러 처리 구조 표준화
* 재사용성과 유지보수성 크게 향상