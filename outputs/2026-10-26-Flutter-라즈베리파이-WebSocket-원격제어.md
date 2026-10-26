# Flutter + 라즈베리파이 WebSocket 원격 제어 사례 — 격주 업데이트 리서치 (2026-10-26)

> 이전 회차: 2026-08-31 / 이번 회차 성격: 후속·업데이트 리서치 (변경사항 및 신규 발견 중심)

## 핵심 결론 (3줄 요약)

1. 전회차 유일한 완성형 사례였던 `Nerdy-Things/raspberry-pi-5-pwm-motor-control`은 여전히 2024-05-09 이후 완전 비활성 상태이며 라이선스 미지정이 지속됨(확인됨) — 이 사례만으로는 더 이상 "활발한 레퍼런스"로 보기 어려움.
2. 이번 회차 신규 발견한 `IliaLarchenko/lerobot_phone_teleop`(Flutter+WebSocket, Apache-2.0, 2025-06-20 최종 커밋)은 Flutter/WebSocket 조건은 확실히 충족하나, "라즈베리파이"가 전용 호스트인지는 부분 확인에 그침(상위 LeKiwi 생태계 문서상 "대체 가능한 표준 구성"으로만 간접 언급).
3. 라이브러리 생태계는 꾸준히 전진 중(web_socket_channel 3.0.3 고정, Python websockets 17.3 신규, Flutter stable 3.47 확정)이나, "Flutter+WebSocket+라즈베리파이+모터제어" 4조건을 모두 충족하는 완성형 공개 사례는 이번 회차에도 신규로 확인되지 않음.

---

## 1. 기존 핵심 사례 현황 업데이트

### 1-1. Nerdy-Things/raspberry-pi-5-pwm-motor-control

- 전회차(2026-08-31) 기준: Flutter + web_socket_channel ^2.4.5 + Python websockets 서버(포트 8765) 구성, 2024년 제작, 라이선스 미지정, Flutter/WebSocket/RPi모터제어 3조건을 모두 충족하는 유일한 완성형 사례.
- 이번 회차 재확인 결과(**확인됨**): 2024-04-26~2024-05-09 커밋 이후 완전 비활성 지속. 라이선스 여전히 미지정. star 1 / fork 1로 변동 없음.
- 평가: 신규 활동이나 포크·기여 증가 없이 2년 가까이 정지된 상태로, 재현/참고용 자료로는 유효하지만 "유지보수되는 레퍼런스"로 보기는 어려움.

---

## 2. 이번 회차 신규 발견

### 2-1. IliaLarchenko/lerobot_phone_teleop (신규 핵심 발견)

- 개요: Hugging Face LeRobot 생태계의 LeKiwi 로봇을 Flutter 기반 Android 앱 + WebSocket으로 원격 조종하는 프로젝트.
- 라이선스: Apache License 2.0.
- 최종 커밋: 2025-06-20.
- 판정(**부분 확인**): Flutter 사용, WebSocket 사용, 라이선스, 최종 커밋일 등 앱 자체에 대한 사항은 확인됨. 그러나 저장소 README 자체에는 "Raspberry Pi"에 대한 직접 언급이 없음. 라즈베리파이는 LeKiwi 상위 생태계 문서(LeRobot 예제 가이드, Seeed Studio 공식 위키)에서 "통상적 권장 구성(5V 구동, USB 포트가 충분하면 다른 PC로 대체 가능)"으로만 간접 언급되어 있어, "라즈베리파이 전용" 구성이 아니라 교체 가능한 표준 구성 중 하나로 봐야 함.
- 모터제어 여부: LeKiwi는 서보/구동계를 가진 모바일 로봇이므로 넓은 의미의 "모터제어"에는 해당하나, PWM 모터 직접 제어라는 전회차 사례와는 결이 다름(로봇 플랫폼 전체 원격조종).
- 종합 평가: 4조건(Flutter+WebSocket+라즈베리파이+모터제어)을 모두 명시적으로 충족한다고 단정하기는 어려우나, 현재까지 발견된 사례 중 가장 활발(2025년 커밋)하고 라이선스가 명확한 사례.

### 2-2. 조건 일부만 충족하는 인접 사례

| 저장소/자료 | 내용 | 미충족 조건 |
|---|---|---|
| sxfrul/Video-Streaming-Using-WebSockets | Flutter+WebSocket으로 라즈베리파이 카메라 영상 스트리밍 | 모터제어 없음 |
| shaanCh/Flutter-App-Control-LED | Flutter+Flask로 LED 제어 | HTTP 통신(WebSocket 아님) |
| pub.dev `raspi_gpio` 패키지 | GPIO 제어 패키지 | Android Things 타겟, WebSocket 무관, health score 낮음 |
| ela.kpi.ua 학술 논문 (2026년 신규) | Flutter+WebSocket+ESP32 로봇팔 제어 | 라즈베리파이가 아닌 ESP32 — 아키텍처 참고 자료로만 활용 |

### 2-3. 기타 2026년 신규 자료 (추정/참고 수준, 미검증)

- Zenn 블로그(일본어): 라즈베리파이 상태 모니터링+제어 관련 포스팅 — **미확인**(WebSocket/Flutter 여부 포함 세부 내용 미검증).
- Skool.com 서보모터 튜토리얼 — WebSocket 사용 여부 **불명**.
- Aalto 대학 교육자료 — WebSocket 아키텍처 패턴 일반론, 특정 사례 아님(참고용).
- FlutterFlow IoT 가이드 — 일반 아키텍처 참고 자료, 특정 라즈베리파이 사례 아님.

이 네 자료는 이번 회차에서 상세 검증을 거치지 않았으며, 다음 회차에서 구체적 사례 여부를 추가 확인할 필요가 있음.

---

## 3. 라이브러리·버전 동향

| 항목 | 내용 | 판정 |
|---|---|---|
| `web_socket_channel` (Dart/Flutter) | 최신 3.0.3, 게시일 2025-04-17, 이후 신규 릴리즈 없음 | **확인됨**(날짜까지 완전 확인) |
| Python `websockets` | 최신 17.3, 릴리즈 2026-10-19, Python 3.11~3.15 지원 | **확인됨** |
| Flutter stable 버전 | 자료 간 3.44/3.47/3.50 상충 → **정답은 3.47**(2026-08-12 stable 출시, Dart 3.13.0 동반). 3.44는 2026-06 기준 outdated, 3.50은 미출시(2026년 11월 예정, 브랜치 컷오프 10-06) | **확인됨** |

평가: WebSocket 관련 핵심 라이브러리(`web_socket_channel`, Python `websockets`)는 안정적으로 유지보수되고 있으나, Flutter+라즈베리파이 모터제어라는 특정 응용 분야의 완성형 오픈소스 사례 자체는 여전히 희소함.

---

## 4. 이월 과제 현황

- Hackster.io, 라즈베리파이 공식 포럼: 전회차부터 이월된 과제로, 이번 회차에도 재조사하였으나 관련 사례를 **발견하지 못함**. 다음 회차에서도 지속 모니터링 필요.

---

## 5. 한계 및 다음 회차 제안

### 조사 환경 한계

- 일부 1차 도메인(`huggingface.co`, `flutter.dev` 계열, `wiki.seeedstudio.com` 등)은 이번 조사 환경에서 직접 fetch가 되지 않아, 검색 스니펫으로 대체 교차검증한 부분이 있음. 이는 2-1(`lerobot_phone_teleop`)의 라즈베리파이 연관성 판정이 "부분 확인"에 그친 주된 이유임.

### 다음 회차 제안

1. `lerobot_phone_teleop`과 LeKiwi 생태계 문서(Hugging Face, Seeed Studio)를 1차 도메인 직접 접근이 가능한 환경에서 재검증하여 라즈베리파이 연관성을 "확인됨" 수준으로 끌어올릴 수 있는지 확인.
2. Zenn 블로그, Skool.com 튜토리얼 등 2026년 신규 발견 자료를 상세 조사하여 조건 충족 여부를 명확히 판정.
3. Hackster.io, 라즈베리파이 공식 포럼의 이월 과제를 계속 추적.
4. `Nerdy-Things` 저장소가 장기간 비활성 상태이므로, 포크나 대체 레퍼런스가 등장하는지 모니터링.

---

## 출처 목록

1. github.com/Nerdy-Things/raspberry-pi-5-pwm-motor-control (commits/master.atom, branches 페이지)
2. pub.dev/packages/web_socket_channel/versions, pub.dev API
3. pypi.org/project/websockets/, pypi.org/project/websockets/17.3/
4. github.com/IliaLarchenko/lerobot_phone_teleop
5. wiki.seeedstudio.com/lerobot_lekiwi (Seeed Studio 공식 위키)
6. LeRobot 예제 가이드 미러 (중간 신뢰도 자료)
7. github.com/sxfrul/Video-Streaming-Using-WebSockets
8. github.com/shaanCh/Flutter-App-Control-LED
9. pub.dev `raspi_gpio` 패키지 페이지
10. ela.kpi.ua 학술 논문 (Flutter+WebSocket+ESP32 로봇팔 제어, 2026년 신규)
11. flutter.dev/blog/whats-new-in-flutter-3-47 (공식)
12. docs.flutter.dev/release/whats-new.html (공식)
13. startdebugging.net (Flutter 3.47 관련 독립 매체 교차확인)
14. Zenn 블로그(일본어, 라즈베리파이 상태 모니터링+제어) — 미검증, 참고용
15. Skool.com 서보모터 튜토리얼 — 미검증, 참고용
16. Aalto 대학 교육자료 (WebSocket 아키텍처 패턴) — 참고용
17. FlutterFlow IoT 가이드 — 참고용
