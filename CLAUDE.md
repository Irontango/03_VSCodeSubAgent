# 리서치 서브에이전트 프로젝트

이 프로젝트는 반복적인 리서치 업무를 위한 클로드 코드 서브에이전트 파이프라인입니다.

## 구성

- `web-researcher` — 웹에서 원자료 수집
- `source-verifier` — 수집된 주장/수치 교차 검증
- `report-writer` — 최종 보고서 작성 및 저장
- `research-archivist` — 프로젝트 메모리에 과거 리서치 기록/조회 (memory: project)

## 공통 규칙

- 최종 보고서는 항상 `outputs/` 폴더에 마크다운으로 저장한다 (파일명: `YYYY-MM-DD-주제명.md`).
- 검증되지 않은 내용과 추정은 반드시 구분해서 표기한다.
- 새 리서치 시작 전에는 `research-archivist`에게 과거 관련 기록이 있는지 먼저 확인시킨다.

## 기본 워크플로우 예시

```
web-researcher와 source-verifier로 "주제"를 조사하고,
끝나면 report-writer로 종합해줘. 완료 후 research-archivist에 기록해줘.
```
