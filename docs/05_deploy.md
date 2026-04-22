# Deploy (배포)

---

## Nginx 배포

### 1. 서버 접속
1. **MobaXterm 실행**
2. `189 Server (192.168.1.222:22189)` 접속
3. 로그인 계정: `pqc`

### 2. 배포 경로 이동
/data/issuer/server/nginx/html/

### 3. 기존 파일 정리
/assets 경로의 기존 파일을 삭제합니다.

### 4. 빌드 파일 업로드
로컬에서 프로젝트를 **build**한 후 생성된 파일을 서버에 업로드합니다.

업로드 대상 파일:

- `/dist/assets/*` → 서버의 `/assets` 폴더로 업로드
- `/dist/index.html` → 기존 `index.html` 덮어쓰기

### 5. 배포 확인 (Ctrl + F5)
https://issuer-dev.ictk.com/