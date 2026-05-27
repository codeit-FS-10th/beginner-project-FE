# 📗 Forest of Study (공부의 숲) — Frontend

스터디 생성·상세·습관·집중·이모지 반응을 제공하는 **React + Vite** 프론트엔드입니다.  
백엔드 API·비즈니스 규칙은 **beginner-project-BE** README 및 Swagger를 기준으로 합니다.

---

# 🚀 배포 URL

| 구분 | URL |
|------|-----|
| **프론트 (Vercel)** | `https://beginner-project-fe.vercel.app` |
| **백엔드 (Render)** | `https://beginner-project-be.onrender.com` |
| **Swagger** | `https://beginner-project-be.onrender.com/api-docs` |
| **로컬 FE** | `http://localhost:5173` |
| **로컬 BE** | `http://localhost:3000` |

---

# 🛠 기술 스택

| 구분 | 사용 |
|------|------|
| 프레임워크 | React 19 |
| 빌드 | Vite |
| 라우팅 | react-router-dom v7 |
| HTTP | axios (`src/api/axiosInstance.js`) |
| UI | react-toastify, emoji-picker-react |
| 배포 | Vercel (`vercel.json` SPA rewrite) |

---

# 🧱 화면·라우트

| 경로 | 페이지 | 기능 |
|------|--------|------|
| `/` | Home | 스터디 목록·검색·정렬·더보기·최근 본 스터디 |
| `/detail?id={studyId}` | Detail | 상세·이모지·비밀번호 모달 |
| `/study` | Study | 생성·수정 (`?mode=edit&id=`) |
| `/habit?id={studyId}` | Habit | 오늘 습관·체크 |
| `/focus?id={studyId}` | Focus | 집중 타이머·포인트 API |

공통: GNB, 전역 로딩 바(`axiosInstance`), Toast.

---

# 🔗 백엔드 연동

## 환경 변수

```env
VITE_API_URL=https://beginner-project-be.onrender.com/api
```

로컬:

```env
VITE_API_URL=http://localhost:3000/api
```

## API 모듈

- `src/api/axiosInstance.js` — `baseURL = import.meta.env.VITE_API_URL`
- `studyservice.js` — 스터디·비밀번호·포인트
- `habitservice.js` — 습관
- `focusApi.js` — 집중
- `Emojiservice.js` — 이모지 (code hex)

| BE | FE |
|----|-----|
| Study | Home, Study, Detail |
| Habit | Habit, Detail |
| Focus | Focus |
| Emoji | Detail |
| Point | Detail, Focus |

상세 규칙·에러·주차 계산은 **BE README** + **Swagger** 참고.

---

# 🔐 인증 (스터디 비밀번호)

전역 회원 JWT가 아니라 **스터디별 비밀번호**입니다.

1. 수정·삭제·습관·집중 시 `ModalPwd`
2. `POST /api/studies/{studyId}/verify-password`
3. 성공: `{ verified, token }` → `sessionStorage` (`study_token_{studyId}`, `tokenStorage.js`)
4. axios가 URL의 `/studies/{id}`에서 Bearer 토큰 자동 첨부

목록·상세 조회는 비밀번호 없이 가능합니다.

---

# 📚 프론트 규칙

- `studyId`는 쿼리 `?id=` 로 페이지 간 이동
- `recentStudy.js` — localStorage 최근 본 스터디
- 이모지: `useEmojiReactions.js`는 `fetch('/api/...')` 상대 경로 → Vercel만으로는 BE에 연결되지 않을 수 있음. 운영에서는 `Emojiservice` + `VITE_API_URL` 권장

---

# 🛠 로컬 실행

```bash
npm install
# .env: VITE_API_URL=http://localhost:3000/api
npm run dev
```

BE를 먼저 실행하고, BE CORS에 `http://localhost:5173` 을 허용해야 합니다.

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 빌드 |
| `npm run preview` | 미리보기 |
| `npm run lint` | ESLint |

---

# 📁 폴더 구조

```
src/
├── api/axiosInstance.js, service/
├── pages/           Home, Detail, Study, Habit, Focus
├── components/      atoms, molecule, organism
├── hooks/
├── utils/           tokenStorage, recentStudy
└── styles/
```

Alias: `@pages`, `@api`, `@molecule`, `@utils` (`vite.config.js`)

---

# ✅ 배포 체크리스트

- [ ] Vercel `VITE_API_URL` = `{BE}/api`
- [ ] BE CORS에 Vercel 도메인
- [ ] 비밀번호 검증 후 습관·집중·수정 동작
- [ ] `vercel.json` SPA rewrite

---

# 👥 관련 저장소

| Repo | 역할 |
|------|------|
| beginner-project-FE | React UI (본 repo) |
| beginner-project-BE | Express + Prisma API |
