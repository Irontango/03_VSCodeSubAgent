# 갤러그 (Galaga) 웹 게임

브라우저에서 바로 실행되는 갤러그 스타일 슈팅 게임. 런타임 의존성 없이 HTML 파일 하나로 동작한다.

## 바로 실행

두 가지 방법이 있다.

1. **빌드 산출물 열기**: `npm run build` 후 생성되는 `dist/index.html`을 브라우저에서 연다.
2. **GitHub Pages**: `main`에 머지되면 자동 배포된다(저장소 Settings → Pages → Source를 "GitHub Actions"로 설정 필요).

개발 중에는 `npm run dev`로 핫 리로드 서버를 띄운다.

## 조작법

| 키             | 동작                 |
| -------------- | -------------------- |
| ← → 또는 A / D | 좌우 이동            |
| SPACE 또는 Z   | 발사                 |
| ENTER          | 게임 시작 / 재시작   |
| P 또는 ESC     | 일시정지             |
| `              | 디버그 오버레이 토글 |

터치 기기에서는 화면 하단에 좌·우·발사 버튼이 나타난다.

## 게임 규칙 요약

- 적은 보스(초록, 150점, 2발), 나비(빨강, 80점), 벌(파랑, 50점) 세 종류.
- 급강하 중인 적을 격추하면 점수가 2배 이상(보스 400, 나비 160, 벌 100).
- 웨이브마다 속도·급강하 빈도·사격 빈도가 올라간다.
- 목숨 3개, 최고 점수는 브라우저에 저장된다.

전체 규칙은 [`docs/requirements.md`](docs/requirements.md)에 있다.

## 프로젝트 구조

```
games/galaga/
├─ index.html            Vite 진입 HTML
├─ src/
│  ├─ config.ts          밸런스·레이아웃 수치 (단일 진실 공급원)
│  ├─ types.ts           도메인 타입
│  ├─ rng.ts             주입식 난수 생성기
│  ├─ entities.ts        대형 생성, 베지어, 충돌 판정
│  ├─ game.ts            규칙과 상태 기계 (브라우저 API 비의존)
│  ├─ renderer.ts        Canvas 2D 렌더링
│  ├─ audio.ts           Web Audio 효과음 합성
│  ├─ input.ts           키보드·터치 입력
│  ├─ storage.ts         최고 점수 저장
│  └─ main.ts            조립과 게임 루프
├─ test/                 Vitest 단위·통합 테스트
├─ e2e/                  Playwright E2E 테스트
└─ docs/
   ├─ requirements.md    요구사항(FR/NFR/AC)
   ├─ state-machine.md   상태 전이 정의
   ├─ review-checklist.md
   └─ adr/               설계 결정 기록
```

## 개발

```bash
cd games/galaga
npm ci
npm run check     # lint · typecheck · unit · build · e2e
```

자세한 절차는 [`CONTRIBUTING.md`](CONTRIBUTING.md), 변경 이력은 [`CHANGELOG.md`](CHANGELOG.md)를 본다.
