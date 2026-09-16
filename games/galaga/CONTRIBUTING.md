# 기여 안내

## 준비

Node 20 이상이 필요하다.

```bash
cd games/galaga
npm ci
npx playwright install chromium   # E2E 최초 1회
```

## 명령

| 명령                | 설명                                          |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | 개발 서버 (핫 리로드)                         |
| `npm run build`     | 타입 검사 후 `dist/index.html` 단일 파일 생성 |
| `npm run lint`      | ESLint + Prettier 검사                        |
| `npm run format`    | Prettier로 자동 정렬                          |
| `npm run typecheck` | `tsc --noEmit`                                |
| `npm test`          | 단위·통합 테스트 (Vitest)                     |
| `npm run test:e2e`  | E2E 테스트 (Playwright, 빌드 산출물 대상)     |
| `npm run check`     | 위 전부를 CI와 같은 순서로 실행               |

## 작업 흐름

1. 요구사항을 먼저 정한다. 새 동작이면 `docs/requirements.md`에 FR/AC를 추가하고, 상태 전이가 바뀌면 `docs/state-machine.md`를 고친다. 구조적 결정은 `docs/adr/`에 기록한다.
2. 테스트를 먼저 쓴다. 규칙은 `test/`에 Vitest로, 브라우저 동작은 `e2e/`에 Playwright로 작성하고 테스트 이름에 FR/AC 식별자를 붙인다.
3. 구현한다. 계층 규칙(ADR-0002)을 지킨다. 수치는 `src/config.ts`에만 둔다.
4. `npm run check`를 통과시킨다.
5. PR을 연다. 템플릿의 항목을 채우고 `docs/review-checklist.md`로 자가 점검한다.

## 커밋 메시지

Conventional Commits 형식을 따른다. 범위는 `galaga`로 고정한다.

```
feat(galaga): 보너스 스테이지 추가
fix(galaga): 무적 중 충돌 무시
test(galaga): 급강하 점수 회귀 테스트
docs(galaga): FR-E9 추가
build(galaga): vitest 3으로 상향
```

## 디버깅

URL에 `?debug`를 붙이거나 게임 중 `` ` `` 키를 누르면 fps, 화면 상태, 엔티티 수가 표시된다.
브라우저 콘솔에서 `window.__galaga.game.state`로 현재 상태를 볼 수 있다.

## 버전과 변경 이력

시맨틱 버전을 따른다. 사용자에게 보이는 변경(밸런스 포함)은 `CHANGELOG.md`에 적는다.
