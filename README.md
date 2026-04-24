# Frontend Component Architecture

## 1️⃣ Overview

이 프로젝트는 **재사용 가능한 컴포넌트 구조 설계와 UI/UX 개선**을 목표로 한 프론트엔드 아키텍처 프로젝트입니다.

실제 서비스에서 사용하던 구조를 기반으로,  
불필요한 의존성을 제거하고 **재사용성과 유지보수성을 강화하는 방향으로 재설계**했습니다.

👉 UI 미리보기: [UI Overview](./docs/ui-overview.md)

---

## 2️⃣ Goals

이 프로젝트에서 집중한 핵심 목표:

- 컴포넌트 재사용성 극대화
- UI 구조의 일관성 확보
- 비즈니스 로직과 UI의 명확한 분리
- 유지보수 비용 감소

---

## 3️⃣ Key Improvements

기존 구조 대비 개선된 점:

- 중복 컴포넌트 제거 → **재사용 가능한 공통 컴포넌트로 통합**
- UI 변경 시 영향 범위 축소 → **유지보수 용이성 개선**
- 비즈니스 로직 분리 → **Custom Hook 기반 구조로 재사용성 확보**
- 상태 관리 구조 정리 → **컴포넌트 간 결합도 감소**

### 🔍 List Fetching Logic Refactor

분산되어 있던 데이터 조회 로직을  
**Custom Hook + params 기반 상태 구조로 재설계**하여

- API 호출 로직 중복 제거
- 페이지네이션 / 검색 / 정렬 로직 통합
- 상태 기반 데이터 흐름으로 단순화
- 에러 처리 표준화

👉 자세히 보기: [List Fetch Architecture](./docs/list-fetch-architecture.md)

---

## 4️⃣ Architecture

본 프로젝트는 **Atomic Design 패턴**을 기반으로 구성되어 있습니다.

| Layer     | Description |
|----------|------------|
| atoms     | 버튼, 입력창 등 최소 단위 UI |
| molecules | atoms를 조합한 중간 단위 |
| organisms | 복합적인 UI 블록 |
| pages     | 실제 화면 단위 |

👉 각 계층을 분리하여  
**UI 재사용성과 변경 영향 최소화**를 목표로 설계했습니다.

---

## 5️⃣ Design Strategy

### Component Design

- props 설계를 통해 다양한 상황에서 재사용 가능하도록 설계
- 특정 도메인에 종속되지 않도록 **비즈니스 로직 분리**
- atoms → molecules → organisms 단계로 점진적 확장

---

### Custom Hooks

- UI와 비즈니스 로직 분리
- API 호출, 상태 처리 로직을 Hook으로 추상화
- 동일한 로직을 여러 컴포넌트에서 재사용 가능

---

### State Management (Recoil)

- 전역 상태를 역할별로 분리 (atoms / selectors)
- 컴포넌트 간 불필요한 props 전달 제거
- 상태 의존성 최소화로 유지보수성 향상

---

### HeroUI 기반 UI 시스템

- 공통 UI 컴포넌트 기반으로 빠른 개발
- 디자인 일관성 유지
- 커스터마이징을 통해 프로젝트 요구사항 반영

---

## 6️⃣ UI/UX Considerations

- 반복되는 사용자 액션 최소화 (간결한 인터랙션 설계)
- 동일한 패턴의 UI를 공통 컴포넌트로 통일 → 학습 비용 감소
- 로딩 / 에러 상태를 명확히 표현하여 사용자 피드백 강화
- 일관된 디자인 시스템으로 예측 가능한 사용자 경험 제공

---

## 7️⃣ Folder Structure

| 폴더            | 설명 |
|----------------|------|
| assets         | 폰트, 아이콘 등 정적 파일 |
| atoms          | 최소 단위 UI 컴포넌트 |
| molecules      | 중간 단위 UI |
| organisms      | 복합 UI 블록 |
| components     | 공통 재사용 컴포넌트 |
| hooks          | 커스텀 React Hooks |
| pages          | 페이지 단위 |
| recoil         | 전역 상태 관리 |
| styles         | 전역 스타일 |
| types          | TypeScript 타입 정의 |
| utils          | 순수 유틸 함수 |

---

## ⚙️ Tech Stack

| 구분         | 기술                |
|------------|-------------------|
| Framework  | React             |
| Build Tool | Vite              |
| Language   | TypeScript        |
| State      | Recoil            |
| HTTP       | Axios             |
| Styling    | TailwindCSS, SCSS |
| UI         | HeroUI            |
| Lint       | ESLint            |
| Format     | Prettier          |

---

## 🧪 Code Quality

코드 품질 유지를 위해 **ESLint + Prettier**를 사용합니다.

```bash
npm run lint
