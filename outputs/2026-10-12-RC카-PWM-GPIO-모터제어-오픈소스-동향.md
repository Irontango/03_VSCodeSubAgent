# RC카 PWM/GPIO 모터 제어 오픈소스 프로젝트 동향 — 2026-10-12 격주 리서치

> 이전 회차: 2026-08-17 / 이번 회차: 2026-10-12 (약 8주 경과, 첫 후속 회차)

## 핵심 요약 (3줄)

1. 지난 회차 발견 사항은 대부분 **유지됨** — gpiozero는 2.0.1.post3(2026-07-27) 이후 안정 상태, RpiMotorLib는 2026-05-11 이후 정체 지속, pigpio는 Pi5 구조적 미지원 상태로 변화 없음.
2. 지난 회차 "미확인 공백"으로 남겼던 **pigpio-rp5(kshetline)**와 **nick-hunter TB6612FNG 프로젝트**는 이번 회차 GitHub 프로필 직접 열람으로 **실체가 확인**되었고, pid_py(ThunderTecke)의 스타/최종커밋 수치는 기존 캐시 수치(2023-08/4★)에서 **2024-05-27/13★로 정정**됨.
3. **PID 제어 루프 전용 활발 라이브러리는 3회차 연속 공백** — 신규 대안 GPIO/모터 제어 라이브러리도 8주간 등장 증거 없음. 다음 회차는 검색 전략 전환(Hackster.io, Instructables, ROS 생태계) 및 pigpio-rp5 활동 재확인이 과제로 이월됨.

---

## 1. RpiMotorLib — 변화 없음(정체 지속)

- **유지됨**: 최종 커밋 **2026-05-11** 확인(GitHub 공식 레포 페이지, 1차 소스). 이후 5개월간 신규 커밋 없음.
- 3rd-party 애그리게이터(gittrend.io: 2026-03-29 표기, ecosyste.ms: 2024-03-28 표기)는 서로 날짜가 불일치하며 모두 **stale 캐시**로 확인되어 신뢰 불가 — "애그리게이터보다 GitHub 1차 소스 직접 확인을 우선한다"는 지난 회차 방법론 교훈이 이번 회차에도 재확인됨.
- 라이선스: GPLv3 원문 재대조 결과 **변화 없음**.
- 결론: gavinlyonsrepo/RpiMotorLib(GPLv3, ~330★)은 여전히 조사 대상 중 "가장 활발했던" 프로젝트이지만, 5개월 무활동으로 "활발"이라는 표현은 재평가가 필요한 시점.

## 2. gpiozero — 안정, 신규 이슈 없음

- **유지됨**: PyPI 최신 버전 **2.0.1.post3**(2026-07-27) 이후 8주간 신규 릴리스 없음.
- Issue #1166(Pi5 lgpio 핀 chip 번호 버그) 수정 내역을 GitHub raw `changelog.rst` 원문으로 1차 확인 — 2.0.1.post1(2026-07-25)에서 수정, post3(2026-07-27)까지 패치 완료된 지난 회차 결론과 일치.
- GitHub Issues에서 "pi5" 키워드 검색 결과, 최근 8주 내 신규 회귀 이슈 **없음**(검색된 이슈는 모두 2025년 이전 건).
- **환경 제약**: gpiozero.readthedocs.io는 이번 세션에서 DNS 해석 실패(ENOTFOUND)로 접근 불가 — GitHub raw changelog.rst 직접 조회로 대체 검증함.
- 결론: GPIO 라이브러리 계층 구조(gpiozero 최상위·활발 / rpi-lgpio·lgpio 하위호환·정체 / pigpio 사실상 폐기·Pi5 미지원)는 **변화 없음**.

## 3. ★정정: pigpio-rp5(kshetline) 실체 확인됨

- 지난 회차 "미확인 공백"이었던 항목. 이번 회차 **GitHub 프로필 직접 열람**으로 **github.com/kshetline/pigpio-rp5** 확인.
- joan2937/pigpio의 포크, 설명: "Experimental variant aiming at Raspberry Pi 5 compatibility".
- 라이선스: Unlicense. 스타 0개.
- 최근 업데이트: **2024-06-24로 추정**(레포 상세 페이지의 날짜 렌더링을 완전히 확인하지 못해 **부분확인** 상태임을 명시).
- **미확인 사항(이월)**: 2024-06 이후 추가 활동 여부는 다음 회차에 재확인 필요.
- 방법론 교훈: web-researcher의 "전혀 못 찾음" 결론은 GitHub API/검색 인덱싱 한계에 따른 **검색 누락**이 원인이었음. GitHub 프로필 직접 열람이 WebSearch보다 신뢰도가 높다는 교훈이 재확인됨.

## 4. ★정정: nick-hunter TB6612FNG 프로젝트 실존 확인됨

- github.com/nick-hunter/Raspberry_Pi_TB6612FNG_Python **실존 확인** — 10★, 6 forks.
- WebSearch로는 검출되지 않았으나 GitHub 프로필 직접 열람으로 확인됨.
- 방법론 교훈: "검색 결과 부재 ≠ 실재 부재". 소규모 개인 프로젝트는 검색엔진/API 인덱싱에서 누락될 수 있으므로, 특정 개발자/레포가 의심될 경우 프로필 직접 열람 절차를 표준화할 필요.
- 최근 활동 여부(최종 커밋 날짜 등)는 이번 회차 자료에 명시되지 않아 **미확인** — 다음 회차 확인 과제로 남김.

## 5. pigpio Pi5 미지원 — 1차 소스로 재확인

- **유지됨**: GitHub Issue joan2937/pigpio#589 직접 열람 결과, 2023-11-07 오픈 후 현재(2026-10-12)도 **Open** 상태.
- 메인테이너 답변: "DMA 기반 기능이 Pi5의 VideoCore mailbox 부재로 포팅이 어렵다"는 내용을 명시.
- 결론: pigpio의 Pi5 구조적 미지원은 **확정적**이며 단기간 내 해소 가능성 낮음.

## 6. PID 제어 루프 — 공백 지속 + pid_py 수치 정정

- **유지됨(공백)**: 전용으로 활발히 유지되는 PID 제어 루프 라이브러리는 여전히 발견되지 않음 — **3회차 연속 공백**.
- 발견된 3건은 모두 사실상 비활동 상태:

| 프로젝트 | 최종 커밋 | 스타 | 비고 |
|---|---|---|---|
| 360pibot (choeffer) | 2022-12-13 | 3★ | pigpio 기반 → Pi5 미지원 가능성(§5 참조) |
| pid_py (ThunderTecke) | **2024-05-27** (정정) | **13★** (정정) | 3rd-party 캐시의 "2023-08 / 4★"는 stale 수치였음 |
| pi-pid (Sebdar) | 2021-01-24 | 0★ | WiringPi 기반(이미 단종된 라이브러리) |

- **★수치 정정**: pid_py는 이전 참고 자료에서 "2023-08, 4★"로 캐시되어 있었으나, 이번 회차 1차 소스 확인 결과 **최종 커밋 2024-05-27, 13★**로 정정됨. RpiMotorLib 사례(§1)와 마찬가지로 애그리게이터 캐시의 신뢰도 문제가 재확인된 사례.
- 다음 회차 검토 과제: 검색 전략 자체를 GitHub 중심에서 **Hackster.io, Instructables, ROS 생태계** 등으로 확장할 필요.

## 7. 신규 대안 라이브러리 — 발견 안 됨

- 8주간 신규 GPIO/모터 제어 라이브러리 등장 증거 **없음**.
- raspberry-i2c-tb6612fng(PyPI): 최종 릴리스 **2025-10-13**(2026년이 아님 — 연도착오 함정을 통과하여 재확인). 1년 이상 업데이트 없음.
- RaspberryMotors(PyPI): 최종 릴리스 2021-04-04 — 완전 비활성.

---

## 지난 회차 대비 연속성 정리

| 항목 | 2026-08-17 상태 | 2026-10-12 상태 | 변화 |
|---|---|---|---|
| gpiozero Issue #1166 | 2.0.1.post3까지 패치 완료 | 8주간 신규 릴리스/회귀 없음 | 유지됨 |
| RpiMotorLib | 가장 활발한 프로젝트로 평가 | 2026-05-11 이후 5개월 무커밋 | 유지(정체 지속, 평가 재검토 필요) |
| pigpio Pi5 미지원 | 구조적 미지원 | Issue #589 여전히 Open, 메인테이너 입장 불변 | 유지됨 |
| pigpio-rp5(kshetline) | 미확인 공백 | 실체 확인(부분확인, Unlicense, 0★) | **정정/신규 확인** |
| nick-hunter TB6612FNG | 미확인 공백 | 실존 확인(10★, 6 forks) | **정정/신규 확인** |
| PID 제어 루프 | 공백(2회차) | 공백 지속(3회차), pid_py 수치 정정 | 공백 유지 + 수치 정정 |
| 신규 대안 라이브러리 | — | 발견 안 됨 | 공백 유지 |

## 환경 제약사항 (이번 세션)

- **api.github.com(GitHub REST API)**이 이번 세션에서 403으로 전면 차단됨 → GitHub HTML 페이지를 WebFetch로 직접 열람해 우회 확인.
- **gpiozero.readthedocs.io**는 DNS 해석 실패(ENOTFOUND) → GitHub raw changelog.rst로 대체 검증.
- **PyPI JSON API**(pypi.org/pypi/.../json)는 정상 작동, 버전/릴리스 날짜 확인에 활용.

이러한 제약으로 인해 본 회차 조사는 GitHub REST API 기반 자동화 검증 대신 **HTML 페이지 직접 열람(1차 소스)** 위주로 수행되었으며, 이는 오히려 애그리게이터 캐시의 stale 데이터를 걸러내는 데 기여함(§1, §6 참조).

## 이월할 공백 (다음 회차, 2026-10-26 예정)

1. **pigpio-rp5(kshetline)**의 2024-06-24 이후 최신 활동 여부 재확인 — 현재 "부분확인" 상태(날짜 렌더링 미확인).
2. **PID 제어 루프 전용 활발 라이브러리** — 4회차째 탐색. 검색 전략 전환 검토(Hackster.io, Instructables, ROS 생태계 등).
3. **nick-hunter TB6612FNG 프로젝트**의 최근 활동(최종 커밋일 등) 미확인 — 다음 회차 확인 필요.

---

## 출처 목록

### 1차 소스 (GitHub/PyPI 공식)
- github.com/gavinlyonsrepo/RpiMotorLib — 레포 커밋 로그(최종 커밋 2026-05-11), 라이선스(GPLv3) 확인
- github.com/gpiozero/gpiozero — raw changelog.rst (Issue #1166 수정 내역, 2.0.1.post1/post3)
- pypi.org/pypi/gpiozero/json — 최신 버전 2.0.1.post3(2026-07-27) 확인
- GitHub Issues 검색("pi5" 키워드, gpiozero 레포) — 신규 회귀 이슈 부재 확인
- github.com/kshetline/pigpio-rp5 — 레포 프로필(Unlicense, 0★, 추정 최근 업데이트 2024-06-24, 부분확인)
- github.com/nick-hunter/Raspberry_Pi_TB6612FNG_Python — 레포 프로필(10★, 6 forks)
- github.com/joan2937/pigpio, Issue #589 — Pi5 DMA/VideoCore mailbox 미지원 메인테이너 답변, 현재 Open 상태(2023-11-07 오픈)
- github.com/choeffer/360pibot — 최종 커밋 2022-12-13, 3★
- github.com/ThunderTecke/pid_py — 최종 커밋 2024-05-27, 13★ (수치 정정)
- github.com/Sebdar/pi-pid — 최종 커밋 2021-01-24, 0★, WiringPi 기반
- pypi.org/pypi/raspberry-i2c-tb6612fng/json — 최종 릴리스 2025-10-13
- pypi.org/pypi/RaspberryMotors/json — 최종 릴리스 2021-04-04

### 2차 소스 (애그리게이터/캐시 — 신뢰도 낮음, 대조용으로만 참고)
- gittrend.io — RpiMotorLib 활동 표기 2026-03-29 (stale 캐시로 확인됨, 1차 소스와 불일치)
- ecosyste.ms — RpiMotorLib 활동 표기 2024-03-28 (stale 캐시로 확인됨, 1차 소스와 불일치)
- pid_py 관련 기존 캐시 수치 "2023-08 / 4★" (1차 소스 확인 결과 "2024-05-27 / 13★"로 정정됨)

### 비고
- 본 보고서의 "부분확인" 표기 항목(pigpio-rp5 최근 업데이트 날짜 등)은 추가 검증이 필요한 미확정 사항이며, 추정과 확정 사실을 혼동하지 않도록 유의할 것.
