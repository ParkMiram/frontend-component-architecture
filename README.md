# 발급장비 리뉴얼 Frontend

---
### 기존 발급장비 url
http://192.168.1.17:7777/work_info.do

### 현재 리뉴얼 url
https://issuer-dev.ictk.com/
<br/>
백엔드 API Docs: http://192.168.20.189:8874/docs

---

## 문서

- [Setup (초기 세팅)](docs/01_setup.md)
- [Environment (환경 변수 관리)](docs/02_environment.md)
- [Run (실행)](docs/03_run.md)
- [Build (빌드)](docs/04_build.md)
- [Deploy (배포)](docs/05_deploy.md)
- [Folder (프로젝트 구조)](docs/06_folder_structure.md)
- [Feature Status (기능 구현 현황)](docs/07_feature_status.md)

---

## Tech Stack
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
| Format     | Pretter           |
| Server     | Nginx             |
 
### Code Quality
이 프로젝트는 코드 품질 유지를 위해 **ESLint + Prettier**를 사용합니다.

#### Lint 실행

```bash
npm run lint
```

ESLint 규칙에 따라 코드가 자동으로 수정됩니다.