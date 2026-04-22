# Folder Structure (프로젝트 구조)

```dotenv
src
 ├─ assets
 ├─ atoms
 ├─ columnHeaders
 ├─ components
 ├─ hooks
 ├─ molecules
 ├─ organisms
 ├─ pages
 ├─ providers
 ├─ recoil
 ├─ styles
 ├─ template
 ├─ types
 └─ utils

```
---

## 설명
| 폴더            | 설명                            |
|---------------|-------------------------------|
| assets        | 폰트, 아이콘 등 정적 파일               |
| atoms         | 작은 UI로 구성된 컴포넌트 계층            |
| molecules     | 중간 UI로 구성된 컴포넌트 계층            |
| organisms     | 큰 블록으로 구성된 컴포넌트 계층            |
| components    | 재사용 컴포넌트                      |
| columnHeaders | 테이블/그리드 컬럼 정의 모음              |
| hooks         | 커스텀 React 훅                   |
| pages         | 단위 페이지                        |
| providers     | 라우트 단위 페이지                    |
| recoil        | Recoil 전역 상태(atoms/selectors) |
| styles        | 전역 스타일/Tailwind/SCSS          |
| template      | 페이지/코드 템플릿                    |
| types         | TypeScript 타입 정의              |
| utils         | 포맷터 등 순수 유틸 함수                |