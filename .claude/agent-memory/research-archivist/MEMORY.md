# 리서치 아카이브

research-archivist 서브에이전트가 리서치를 완료할 때마다 이 파일을 갱신합니다.

## RC카 프로젝트
- [라즈베리파이 RC카 자율주행 동향 (2026-07-19)](rc카-자율주행-리서치-2026-07-19.md) — Donkeycar 표준, Pi5 GPIO 이슈, Flutter+WebSocket 선례 없음 (2026-08-17 후속 갱신: Pi5 GPIO 이슈 최종 해결 확인됨; 2026-08-31 후속 갱신: Flutter+WebSocket 선례 1건 발견, "선례 없음" 결론은 검색 누락으로 정정, 아래 참고)
- [초음파 센서 기반 장애물 회피 알고리즘 동향 (2026-07-20)](초음파-센서-장애물회피-리서치-2026-07-20.md) — 다중센서/퍼지로직/센서융합, crosstalk 지연 60ms, APF+초음파 결합 연구 공백, arXiv 논문공장 의심 사례 (2026-09-14 후속 갱신: Saranga/BatDeck 신규 검증, 33ms 판정 완화, LineMaster Pro 의심 정황 강화, APF 공백 지속, 아래 참고)
- [라즈베리파이 기반 OpenCV 차선 인식 최신 기법 (2026-08-03)](라즈베리파이-opencv-차선인식-리서치-2026-08-03.md) — 전통CV(Canny+Hough) vs 경량 딥러닝, zbotic.in FPS 주장 인용금지, CircuitDigest 발행일 오탐 3번째 재확인, 다중기능 통합 시 Pi3 실시간성 급락(1fps), Donkeycar CV 오토파일럿 발견, arXiv 2603.13907 의심 재확인·확장 (2026-09-28 후속 갱신: Pi5 호환성·Donkeycar 실전사례 공백 지속, nima-salamat/self-driving-robot 경량 UNet 신규 발견(fps 미확인), fleetstack.io FPS 주장 인용보류 추가, GitHub 자동봇 커밋 발행일 오탐 신규 변종, arXiv 2409.03114 소속 오인 정정, LineMaster Pro ResearchGate 중복게재 신규 확인, 아래 참고)
- [RC카 PWM/GPIO 모터 제어 오픈소스 프로젝트 동향 (2026-08-17)](pwm-gpio-모터제어-리서치-2026-08-17.md) — ★gpiozero Issue #1166(Pi5 lgpio 버그, 2024-08-21 제보)이 2026-07-25/27 gpiozero 2.0.1.post1~3 배포로 공식 해결됨(재확인 불필요), GPIO 라이브러리 계층 구조(gpiozero>rpi-lgpio/lgpio>pigpio 폐기수순), RpiMotorLib(GPLv3, 337★)이 조사 대상 중 가장 활발
- [소스검증 함정 3건 (2026-08-17)](소스검증-함정-2026-08-17.md) — PCA9685 릴리스일 연도 오기(2024→2026) 정정, GitHub license 필드 오분류(RpiMotorLib API상 "Other"이나 실제 GPLv3), WebFetch의 JS 기반 GitHub 릴리스 페이지 오독
- [Flutter+라즈베리파이 WebSocket 원격 제어 사례 (2026-08-31)](flutter-웹소켓-라즈베리파이-원격제어-리서치-2026-08-31.md) — ★완성형 오픈소스 사례 Nerdy-Things/raspberry-pi-5-pwm-motor-control 발견(master 브랜치, Flutter+web_socket_channel+Python websockets 8765+PWM모터제어), 단 2024-04~05 제작·라이선스 미지정. 2026-07-19 "선례 없음" 결론은 GitHub description 공란으로 인한 검색 누락이 원인으로 판명(방법론 교훈: description 없는 저장소 대비 코드/커밋 기반 보조 검색 필요). web_socket_channel 최신 안정판은 3.0.3(2025-04-17)
- [초음파 센서 기반 장애물 회피 알고리즘 동향 — 격주 후속 (2026-09-14)](초음파-센서-장애물회피-리서치-2026-09-14.md) — ★신규 항공로봇 연구 검증(Saranga: arXiv 2603.24699/Science Robotics/WPI+TDK, 1.2mW·-4.9dB SNR·UNet 디노이징; BatDeck: arXiv 2412.10048, Crazyflie 확장, ego-velocity MSE 0.019 m/s), HC-SR04 crosstalk 33ms는 60ms와 "상충 아닌 별도 목적 수치"로 판정 완화, LineMaster Pro(2603.13907) 소속 "Robo Tech Valley"의 무관분야 논문 6편 대량게재 정황 신규 확인(논문공장 의심 강화, 단정은 금지), arXiv 2312.04072 "23.97ms"는 2회 연속 확인 불가로 인용 금지 사실상 확정, 초음파+APF 결합 공백 지속(후보 3건 다음 회차 이월), Mingrui-Yu/RaspberryCar 최종커밋 2020-05-24로 비활성 판정, ROS2 Nav2 초음파 통합 실무정보(LaserScan 변환, 2D ObstacleLayer) 신규 확인

## 리서치 방법론
- [발행일 검증 방법론](리서치-발행일-검증-방법론.md) — 오래된 콘텐츠 최신 오인 주의, 학술자료 paywall 교차검증 한계 (2026-07-20, 2026-08-03, 2026-08-17 재확인됨 — 4개 세션에서 반복, 2026-08-17은 "연도 오기" 변종 패턴)
- [arXiv 논문공장 탐지 방법론](arxiv-논문공장-탐지-방법론.md) — 저자 소속 불일치, 소규모 상점의 기관 표기, ResearchGate 중복 게재 등 "AI-slop" 프리프린트 신호 (2026-08-03 재확인·확장; 2026-09-14 재확인: 동일 그룹의 무관 분야 대량 게재(6편)라는 신규 패턴 추가 확인)
- [WebFetch 403 접근제한 관찰](webfetch-403-접근제한-관찰.md) — 다수 학술/블로그 도메인에서 WebFetch HTTP 403 다발 (2026-08-03 최초 관찰, 단일 세션이므로 재현 여부 계속 확인 필요)
- [소스검증 함정 3건 (2026-08-17)](소스검증-함정-2026-08-17.md) — 연도 오기, GitHub license 필드 오분류, WebFetch JS 페이지 오독. 라이선스 확인은 LICENSE 원문 대조, 릴리스 이력은 API 우선 사용을 표준 절차로 권장
- [Flutter+라즈베리파이 WebSocket 원격 제어 사례 (2026-08-31)](flutter-웹소켓-라즈베리파이-원격제어-리서치-2026-08-31.md) — ★신규 패턴: GitHub description 공란 저장소는 검색에서 누락되기 쉬움(2026-07-19 negative claim의 실제 원인으로 판명) → 코드/커밋 기반 보조 검색 병행 권장
- **격주 후속 리서치 패턴**: 같은 주제를 2주 간격으로 재조사할 경우, 이전 회차에서 "인용 금지/확인 불가"였던 항목이 (a) 추가 근거로 판정이 완화되거나(예: 2026-09-14 HC-SR04 33ms), (b) 반대로 의심 정황이 강화되거나(예: LineMaster Pro), (c) 2회 연속 근거 미발견 시 사실상 확정적 인용 금지로 격상(예: arXiv 2312.04072)될 수 있음 — 단발성 판정에 머무르지 말고 매 회차 재확인 이력을 누적 기록할 것.
- **발행일 오탐 변종: GitHub 자동봇 커밋** (2026-09-28 신규) — 저장소의 "최근 업데이트일"이 실제로는 README 타임스탬프 자동갱신 등 봇 커밋 때문일 수 있음(Ali-Kalsekar/Lane-Detection-and-Driver-Assistance-System 사례: "v1.0.0(2024)" 표기이나 GitHub상 2026-09-27 업데이트로 노출, 실질은 자동봇 커밋). 최근 업데이트일만으로 활성 프로젝트 판단 금지, 커밋 메시지 내용 확인 필수.
- **WebFetch 차단 패턴 변동성 확인** (2026-09-28) — 차단 에러 유형(403 vs EGRESS_BLOCKED)과 차단 대상 도메인이 세션마다 달라짐(github.com은 이번 회차 정상, api.github.com은 이번 회차 신규 차단) — 특정 도메인이 한 번 정상 작동했다고 다음 회차에도 보장되지 않음, 매 회차 재확인 필요.
