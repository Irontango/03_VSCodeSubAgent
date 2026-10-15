# 변경 이력

형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/)를 따르고, 버전은 [시맨틱 버저닝](https://semver.org/lang/ko/)을 따른다.

## [Unreleased]

## [1.0.0] - 2026-09-16

### Added

- 요구사항 명세(FR/NFR/AC), 상태 기계 문서, ADR 3건
- TypeScript + Vite 프로젝트 골격, 단일 파일 빌드
- 도메인/어댑터 계층 분리 (`game.ts` ↔ `renderer.ts`, `audio.ts`, `input.ts`, `storage.ts`)
- 주입식 난수 생성기와 결정성 보장
- 단위·통합 테스트 45건, E2E 테스트 7건
- GitHub Actions CI(lint·typecheck·test·build·e2e)와 GitHub Pages 배포
- `?debug` 오버레이(fps, 상태, 엔티티 수)
- CONTRIBUTING, 리뷰 체크리스트, 이슈·PR 템플릿

### Fixed

- 무적 상태의 플레이어가 급강하 적을 들이받아 점수를 얻던 허점 (FR-P5)

## [0.1.0] - 2026-09-15

### Added

- 단일 HTML 프로토타입: 적 3종, 진입·대형·급강하 패턴, 웨이브, 목숨, 최고 점수, 터치 조작, 합성 효과음
