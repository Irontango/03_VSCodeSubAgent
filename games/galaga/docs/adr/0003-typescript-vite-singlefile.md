# ADR-0003: TypeScript + Vite + 단일 파일 번들

날짜: 2026-09-16
상태: 채택

## 맥락

모듈로 분리하면(ADR-0002) 브라우저가 여러 파일을 로드해야 한다. "파일을 더블클릭해서 바로 실행"(NFR-1)을 유지하려면 번들이 필요하다.
적 객체의 `dive` 필드처럼 상태에 따라 존재 여부가 달라지는 속성을 타입으로 표현해 실수를 줄이고 싶다.

## 결정

- 언어: TypeScript (`strict: true`).
- 빌드: Vite + `vite-plugin-singlefile`로 JS·CSS를 `dist/index.html` 하나에 인라인한다.
- 테스트: Vitest(단위·통합), Playwright(E2E, 빌드 산출물 대상).
- 정적 분석: ESLint(typescript-eslint) + Prettier.

## 결과

- `npm run build` 결과물 하나만 배포하면 된다. GitHub Pages에도 그대로 올린다.
- 개발 중에는 `npm run dev`로 핫 리로드를 쓴다.
- 기여자는 Node 20 이상이 필요하다. 런타임 사용자에게는 영향이 없다.
