# Flutter + 라즈베리파이 WebSocket 원격 제어 사례 조사

- 조사일: 2026-08-31 (격주 리서치)
- 작성: report-writer 서브에이전트

## 요약 (TL;DR)

1. "Flutter 앱 + WebSocket 통신 + 라즈베리파이 모터(RC카) 제어"를 모두 만족하는 공개 레퍼런스로 **Nerdy-Things/raspberry-pi-5-pwm-motor-control**을 신규 확인함. 다만 이는 2026년 신규 자료가 아니라 2024년 4~5월에 만들어진 기존 저장소이며, GitHub description이 비어있어 과거(2026-07-19) 리서치에서 검색 누락되었던 것으로 추정됨.
2. 해당 저장소는 라이선스가 지정되어 있지 않음(확인됨) — 실무 재사용 시 반드시 저자에게 별도 허가를 확인해야 함.
3. 그 외 발견된 사례들은 Flutter·WebSocket·모터제어 세 조건 중 하나 이상을 충족하지 못하는 인접 사례이며(예: React 사용, HTTP 사용, CAN Bus 사용 등), "세 조건을 모두 만족하는 사례가 극히 드물다"는 과거 리서치의 결론은 여전히 유효함(부분 확인·추정 유지).

---

## 1. 배경 및 과거 리서치와의 연계

- 과거 기록(2026-07-19 최초, 2026-08-17 갱신, research-archivist 확인): "Flutter 앱 + WebSocket + 라즈베리파이 RC카 모터 제어"를 동시에 만족하는 공개 레퍼런스는 당시 **발견되지 않음** (negative claim, 부분 확인 상태로 기록됨).
- 당시 확인된 유사 사례: React+WebSocket+gpiozero(Mosquid Medium), Flutter+HTTP/Flask(PyCarController), Flutter+D-Bus(snapp_cli), Flutter WebSocket+Python websockets 카메라 스트리밍(모터제어 아님).
- Donkeycar가 RPi 자율주행 RC카의 표준 프레임워크로 확인되어 있었음.
- RPi5의 RP1 사우스브릿지로 인해 구버전 RPi.GPIO 라이브러리가 작동하지 않던 이슈는 gpiozero 2.0.1.post1~3(2026-07-25~27 배포)에서 이미 해결된 것으로 확인되어, 이번 리서치에서는 재조사하지 않음.
- 이번 회차의 목적은 위 negative claim이 여전히 유효한지 재검토하는 것이었으며, 그 결과 기존에 놓쳤던 사례 하나를 새로 발견함.

## 2. 핵심 발견 — Nerdy-Things/raspberry-pi-5-pwm-motor-control

**저장소**: https://github.com/Nerdy-Things/raspberry-pi-5-pwm-motor-control

| 항목 | 내용 | 검증 상태 |
|---|---|---|
| Flutter 클라이언트 존재 | `/mobile` 폴더가 실제 Flutter 프로젝트, `pubspec.yaml`에 `web_socket_channel: ^2.4.5` 의존성 명시 | **확인됨** (pubspec.yaml 원문 대조) |
| RPi 서버 구현 | `/rasbperry`(폴더명 오타) 하위 Python `websockets` 기반 서버, 포트 8765에서 대기 | **확인됨** (websocket.py, websocket_command.py 원문 대조) |
| 명령 프로토콜 | `{"type":"MOTOR","x":...,"y":...}` 형태의 JSON 명령으로 PWM/H-Bridge 모터 제어 | **확인됨** (원문 대조) |
| 생성 시점 | 2026년 신규 자료 아님. 커밋 기록상 2024-04-26 ~ 2024-05-09 | **확인됨** (커밋 로그 10건 + 연계 유튜브 영상 게시일 2024-05-09 이중 교차 일치) |
| 라이선스 | 지정된 라이선스 없음 | **확인됨** (GitHub Community Standards 체크리스트에서 License 항목 미체크) |
| 저자 및 연계 자료 | eugene-tkachenko(Nerdy Things), 연계 유튜브 영상 존재 (watch?v=Xy32E4vzyEM) | **확인됨** (커밋 작성자 전원 일치 + 영상 독립 확인) |
| 기본 브랜치 | master | **확인됨** (pubspec.yaml 대조 시 참고사항으로 기록) |

**실무 시사점(주의)**: 라이선스가 지정되지 않은 저장소는 저작권법상 기본적으로 모든 권리가 저자에게 유보되므로, 코드를 재사용·수정·배포하려면 반드시 저자(eugene-tkachenko)에게 별도로 사용 허가를 확인해야 함.

## 3. 유사/인접 사례 비교

아래 사례들은 "Flutter + WebSocket + 모터제어" 세 조건 중 하나 이상을 충족하지 않는 인접 사례로, 참고용으로만 정리함. 개별 항목의 상세 사실관계는 대부분 **미확인·추정** 수준이며, 표에 검증 상태를 병기함.

| 프로젝트 | 클라이언트 | 통신방식 | 모터제어 | 라이선스 | 비고 / 검증 상태 |
|---|---|---|---|---|---|
| hellpig/WebSocket-Raspberry-Pi-robot | 브라우저(HTML/JS) | Node.js/socket.io + pigpio | 있음 | MIT | Flutter 아님 (미확인·추정 수준의 부가 정보, 라이선스는 확인됨) |
| nkenna/websocket-iot | Flutter | WebSocket | 여부 미확인 | 미확인 | 커밋 2개뿐인 초기단계 (미확인·추정) |
| wahyudiramadhan/Flutter-robotapps | Flutter | 미확인 | 미확인 | GPL-3.0 | WebSocket 사용 여부 미확인 (미확인·추정) |
| matzeema/kart-project | flutter-pi | **CAN Bus**(Kelly Controller), WebSocket 아님 | 있음 | MIT | **확인됨** (README 원문 대조로 WebSocket 미사용 확정) |
| innat/Raspberry-Pi-WebSocket | HTML/JS | Python Tornado + WebSocket | LED on/off 수준 | MIT | Flutter/모터 무관, 오래된 자료로 추정 (미확인·추정) |
| pkErbynn/PyCarController | Flutter | HTTP(Flask), WebSocket 아님 | 있음 | 미확인 | 기존 리서치 재확인 (부분 확인) |
| Mosquid(Medium 글) | React | WebSocket | 있음 | 해당없음 | Flutter 아님, 게시일 2022-11은 미확인·추정 |
| Delicode/Websocket_Motor_Controller | C++/Python (Flutter 미사용) | WebSocket | 있음 | 미확인 | RPi3 + DRV8835 |
| Solace 블로그(식물 모니터링) | 미확인 | 미확인 | 무관 가능성 높음 | 미확인 | 본문 미열람 |
| FlutterBy Pi (projects-raspberry.com) | 미확인 | 미확인 | 미확인 | 미확인 | 본문 미열람 |

## 4. 관련 생태계 동향

- **Flutter WebSocket 클라이언트**: `web_socket_channel` 최신 버전은 **3.0.3**(2025-04-17 발행) — **확인됨** (pub.dev 웹페이지 + API 이중 일치). Nerdy-Things 프로젝트는 이보다 구버전인 2.4.5를 사용 중이나, 여전히 표준 선택지로 유효함.
- **RPi WebSocket 서버**: Python `websockets` 라이브러리 최신 17.0.1대, Python 3.12/3.13 호환. FastAPI 기반 GPIO 제어 예제도 존재하나 WebSocket 지원 여부는 **미확인**.
- 접속 실패로 확인하지 못한 자료: Hackster.io, Medium 일부 게시물, 라즈베리파이 공식 포럼 스레드, GitHub REST API(403 오류) — 추후 재시도 필요.

## 5. 미확인·추정 사항 및 재검증 필요 목록

- nkenna/websocket-iot, wahyudiramadhan/Flutter-robotapps의 모터제어/WebSocket 사용 여부 상세
- Solace 블로그, FlutterBy Pi(projects-raspberry.com)의 통신방식 및 모터제어 여부 (본문 미열람)
- Mosquid Medium 글 게시일(2022-11)
- Delicode/Websocket_Motor_Controller의 라이선스
- innat/Raspberry-Pi-WebSocket이 "오래된 자료"라는 판단은 추정이며, 정확한 생성/최종 업데이트 시점 확인 필요
- Hackster.io, 라즈베리파이 공식 포럼, GitHub REST API 등 접속 실패 소스 재시도

## 6. 결론 및 실무 시사점

- "Flutter + WebSocket + 라즈베리파이 모터제어"를 모두 만족하는 공개 레퍼런스가 극히 드물다는 과거 결론은 이번 회차에서도 큰 틀에서 유지되나, **Nerdy-Things/raspberry-pi-5-pwm-motor-control**이라는 구체적 사례 하나를 새로 확보함(2024년 자료, 검색 누락으로 인해 이번에 재발견).
- 해당 사례를 실무 참고자료로 활용할 경우, 코드 구조(Python `websockets` 서버 + Flutter `web_socket_channel` 클라이언트 + JSON 기반 모터 명령)는 그대로 참고 가능하나, **라이선스가 없어 무단 재사용은 법적 리스크가 있으므로 저자 확인 절차를 거칠 것을 권고**.
- 다음 격주 리서치 시에는 위 "미확인·추정" 목록(특히 Hackster.io, 공식 포럼, GitHub REST API 재시도)을 우선 보완할 것을 제안.

---

## 출처 목록

1. Nerdy-Things/raspberry-pi-5-pwm-motor-control — https://github.com/Nerdy-Things/raspberry-pi-5-pwm-motor-control
2. 연계 유튜브 영상 — https://www.youtube.com/watch?v=Xy32E4vzyEM
3. hellpig/WebSocket-Raspberry-Pi-robot — GitHub (URL 미기재, 저장소명으로 검색)
4. nkenna/websocket-iot — GitHub
5. wahyudiramadhan/Flutter-robotapps — GitHub
6. matzeema/kart-project — GitHub
7. innat/Raspberry-Pi-WebSocket — GitHub
8. pkErbynn/PyCarController — GitHub
9. Mosquid, Medium 게시글 (React + WebSocket 라즈베리파이 모터제어)
10. Delicode/Websocket_Motor_Controller — GitHub
11. Solace 블로그 (식물 모니터링, 본문 미열람)
12. FlutterBy Pi — projects-raspberry.com (본문 미열람)
13. web_socket_channel 패키지 — https://pub.dev/packages/web_socket_channel (버전 3.0.3, 2025-04-17 발행)
14. Python `websockets` 라이브러리 — PyPI (버전 17.0.1대)
15. gpiozero 2.0.1.post1~3 릴리스 노트 (2026-07-25~27)
16. research-archivist 과거 기록 (2026-07-19 최초, 2026-08-17 갱신)

*본 보고서는 web-researcher 수집 원자료와 source-verifier의 7개 핵심 주장 전수 검증 결과(반증/상충 없음, 1차 소스 GitHub raw 및 pub.dev API 기준)를 종합하여 작성됨.*
