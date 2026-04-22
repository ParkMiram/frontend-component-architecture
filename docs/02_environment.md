# Environment Variables (환경 변수 관리)

---

## .env 설정

### 개요
- Vite 기반 환경 변수는 VITE_ 접두어가 있어야 클라이언트에서 접근 가능합니다.

### 로컬
```dotenv
VITE_API_URL=http://192.168.20.189:8874/api/v1
```


### 빌드
```dotenv
VITE_API_URL=/api/v1
```

---