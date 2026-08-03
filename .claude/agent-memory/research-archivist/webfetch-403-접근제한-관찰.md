---
name: webfetch-403-접근제한-관찰
description: WebFetch가 다수의 학술/블로그 도메인에서 HTTP 403을 반환하는 현상 최초 관찰 (2026-08-03) — 아직 단일 세션 관찰이므로 향후 재현 여부 확인 필요, 잠정적으로 WebSearch 간접 확인에 의존 권장
metadata:
  type: project
---

2026-08-03 라즈베리파이 OpenCV 차선 인식 리서치([[라즈베리파이-opencv-차선인식-리서치-2026-08-03]]) 중 관찰된 현상:

**관찰 내용:** WebFetch 도구가 arxiv.org, nature.com, researchgate.net, dl.acm.org, pmc.ncbi.nlm.nih.gov, mdpi.com, web.archive.org, tumblr.com, circuitdigest.com, zbotic.in, hackster.io, docs.donkeycar.com 등 다수의 학술/블로그 도메인에서 반복적으로 HTTP 403(접근 거부)을 반환함. 이 때문에 원문 직접 대조가 불가능해 WebSearch가 제공하는 스니펫/캐시 정보에 크게 의존해야 했음(예: CircuitDigest 발행일 추정 시 Wayback Machine 직접 대조를 시도했으나 403으로 실패, Tumblr 재게시 URL 패턴이라는 간접 근거로 대체함).

**주의:** 현재까지는 **단일 세션(2026-08-03) 관찰**이며, 이전 리서치 세션([[rc카-자율주행-리서치-2026-07-19]], [[초음파-센서-장애물회피-리서치-2026-07-20]])에서는 이런 현상이 기록되지 않았음. 세션/환경 특성(예: 프록시, 일시적 차단, 네트워크 설정)일 가능성이 있으므로 아직 일반화하지 말 것.

**Why:** WebFetch 접근 실패가 반복되면 source-verifier의 원문 직접 대조 검증이 구조적으로 어려워지고, WebSearch 간접 확인에만 의존하게 되어 검증 신뢰도가 낮아질 위험이 있음.
**How to apply:** 
- 향후 리서치에서도 동일한 도메인 군에서 WebFetch 403이 재현되는지 계속 관찰하고, 재현될 경우 이 메모에 "재확인" 기록을 추가할 것 (기존 [[리서치-발행일-검증-방법론]], [[arxiv-논문공장-탐지-방법론]] 사례처럼 세션 간 재확인 누적 방식을 따름).
- 재현이 확인되면 source-verifier에게 "원문 접근 불가 시 WebSearch 스니펫 기반 판단임을 명시적으로 표기"하도록 안내하는 것을 표준 절차로 승격 고려.
- 2회 이상 세션에서 재현되지 않으면 이 메모는 세션 특이적 노이즈로 간주하고 우선순위를 낮출 것.

Related: [[라즈베리파이-opencv-차선인식-리서치-2026-08-03]], [[리서치-발행일-검증-방법론]]
