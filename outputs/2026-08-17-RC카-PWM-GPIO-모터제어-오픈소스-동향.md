# RC카 PWM/GPIO 모터 제어 오픈소스 프로젝트 동향

작성일: 2026-08-17

---

## 요약 (3줄)

1. Pi5 커널 변경(2024-08, 6.6.45)으로 깨졌던 gpiozero의 GPIO 핀 팩토리 버그(Issue #1166)는 **약 2년이 지난 2026-07-25에야 정식 pip 배포판(2.0.1.post1)에서 수정**되었으며, 이는 "Pi5 GPIO 대응이 신속했다"는 통념과 달리 하위 계층 미스매치가 장기간 방치된 사례로 확인됨.
2. 모터 드라이버 라이브러리 중에서는 **RpiMotorLib**(GPLv3, 2026-05-11 커밋)이 rpi-lgpio 채택을 통해 Pi5를 포함한 전 모델 호환을 유지하며 조사 대상 중 가장 활발했고, **PCA9685용 Adafruit_CircuitPython_PCA9685**도 2026-04-23까지 릴리스가 이어지며 정체 없이 유지보수되는 것으로 확인됨(웹리서치 원자료의 "릴리스 정체" 기술은 검증 과정에서 오류로 판명되어 정정함).
3. pigpio는 5년 이상 신규 릴리스가 없고 Pi5 미지원이 구조적으로 하드코딩되어 사실상 폐기 수순으로 보이며, "RC카 전용" 오픈소스 프로젝트들은 대체로 스타 수·활동성이 낮아 실질적으로는 범용 모터/GPIO 라이브러리 + 개인 조합 형태가 주류로 관찰됨(단, 전수조사는 아니므로 해석 수준의 관찰로 표기).

---

## 이전 리서치와의 관계

2026-07-19 작성된 "라즈베리파이 RC카 자율주행 동향" 보고서는 PWM/GPIO 모터 제어를 3절에서 L298N 중심 튜토리얼 4건으로만 얕게 다루었습니다. 이번 리서치는 모터 제어 영역에 특화하여 다음과 같이 확장·심화했습니다.

- (1) L298N 외 TB6612FNG, DRV8833, PCA9685 등 다양한 모터 드라이버의 오픈소스 라이브러리 생태계를 비교
- (2) gpiozero/lgpio/pigpio 등 GPIO 제어 라이브러리 계층별 활발성과 유지보수 상태를 정리
- (3) 이전 리서치 시점(7월 19일) 이후에도 이어지는 "Pi5 이후 GPIO 이슈"의 후속 경과(수정 여부, 수정 시점)를 추적

즉 이전 문서가 "RC카 자율주행"이라는 상위 주제의 일부로 모터 제어를 스쳐 다뤘다면, 이번 문서는 모터 제어 자체를 주제로 삼아 라이브러리·드라이버별 생태계 활발성을 비교 분석했습니다.

---

## 1. PWM/GPIO 제어 라이브러리 생태계

| 라이브러리 | 최신 버전/릴리스 | 스타/이슈 | 상태 |
|---|---|---|---|
| gpiozero | 2.0.1.post3 (2026-07-27, PyPI) | 2.1k 스타, 오픈이슈 162 | **검증됨** — 가장 활발히 유지보수됨. RPi OS 데스크톱 기본 설치 |
| rpi-lgpio (waveform80) | 0.6 (2024-05-11) | — | **검증됨(사실)** — 이후 약 2년간 신규 커밋 없이 정체 |
| lgpio (joan2937/lg) | 0.2.2.0 (2024-03-29, PyPI) | 스타 129 | 원자료 그대로, 별도 교차검증 대상 아님(미확인) |
| pigpio (joan2937) | v79 (2021-03-02) | — | **검증됨** — 5년 이상 신규 릴리스 없음, Pi5 미지원 하드코딩(Issue #589) |

**핵심 발견 (검증됨):** 2024년 여름 Pi5 커널 업데이트(6.6.45)로 gpiochip 번호 체계가 4→0으로 바뀌면서 gpiozero의 lgpio 핀 팩토리가 깨졌습니다(Issue #1166, 2024-08-21 제보). 이 이슈는 **2026-07-25에 종료(closed)**되었고, 같은 날 배포된 gpiozero 2.0.1.post1 공식 changelog에 "Fixed LGPIOFactory defaulting to the wrong GPIO chip on the Raspberry Pi 5... (#1166)"라고 명시적으로 연결된 것을 확인했습니다. 즉 **2024년 8월에 보고된 버그가 약 2년 뒤인 2026년 7월에야 정식 pip 배포판에서 수정**되었습니다. 이는 "Pi5 GPIO 대응이 신속히 성숙했다"는 통념과 배치되는 결과로, 커널-라이브러리 미스매치가 장기간 방치되었다가 최근에야 해소된 사례로 평가할 수 있습니다.

pigpio는 대안으로 rgpio/kshetline의 실험적 포크(pigpio-rp5)가 언급되었으나, **정확한 저장소 위치와 성숙도는 미확인**입니다.

계층별 현황 요약(검증됨):
- 상위 레이어(gpiozero): 가장 활발, 최근에도 버그 수정 지속
- 하위 계층(rpi-lgpio/lgpio): 기능은 안정적이나 개발 자체는 정체
- pigpio: 사실상 폐기 수순
- 상위 모터 라이브러리(RpiMotorLib 등): 하위 계층 변화에 자체 대응하며 활발히 유지

---

## 2. 모터 드라이버별 오픈소스 지원 현황

### RpiMotorLib — 검증됨, 조사 대상 중 가장 활발
- 저장소: gavinlyonsrepo/RpiMotorLib, 스타 337, 라이선스 GPLv3
- 스테퍼/DC모터/서보를 폭넓게 지원(ULN2003, TB6612FNG, L298N, A4988, DRV8825, DRV8833, MX1508 등)
- v4.0.0부터 rpi-lgpio를 채택하여 Pi5를 포함한 전 라즈베리파이 모델 호환
- 2026-05-11까지 커밋 지속 — 조사 대상 4개 GPIO/모터 라이브러리 중 유일하게 2026년 활동이 확인됨

### TB6612FNG
- nick-hunter/Raspberry_Pi_TB6612FNG_Python: 스타 10, 최근 활동 **미확인**(오래된 프로젝트로 추정되나 확인되지 않음)
- MarkusBansky/raspberry-i2c-tb6612fng: 스타 5, GPL-3.0. **검증됨**: README에 2025-09-16 기준 Pi5 8GB + 커널 6.12 + Python 3.13.5 + lib v0.3.0 조합 실측 테스트 기록 존재

### DRV8833
- RpiMotorLib에 포함되어 지원됨 (위 참조)
- AHSPC/DRV8833_micropython: Raspberry Pi Pico용 라이브러리로, 리눅스 기반 RPi SBC용이 아님에 유의(원자료 표기 그대로, 별도 검증 대상 아님)
- pololu/drv8835-motor-driver-rpi: 구세대 Pi B+/2/3 대상, Pi5 대응 여부 **미확인**

### PCA9685 — [검증 과정에서 상충 발견 → 정정 반영]
- 공식 권장 라이브러리는 Adafruit_CircuitPython_PCA9685
- **정정된 사실(검증됨)**: 최신 릴리스 3.4.22는 **2026-04-23** 배포이며, 직전 릴리스들(3.4.21: 2026-03-27, 3.4.20: 2025-10-20, 3.4.19: 2025-06-17)도 꾸준히 이어졌습니다. 즉 **릴리스가 정체된 적 없이 최근까지 활발히 유지보수**되고 있습니다.
  - 원 web-researcher 수집 자료에는 "릴리스가 2024년에 정체되고 커밋만 2026년까지 지속"된다는 취지의 기술이 있었으나, 이는 연도 오기 및 사실관계 오류로 판명되어 검증 결과에 따라 정정했습니다. (source-verifier 판정: "상충 발견")
- 구버전 Adafruit_Python_PCA9685는 deprecated/archived 처리되어 신규 CircuitPython 라이브러리로의 이전이 권고됩니다.

---

## 3. 주목할 만한 GitHub 프로젝트

| 프로젝트 | 스타 | 라이선스 | 최근 활동 | 비고 | 검증 상태 |
|---|---|---|---|---|---|
| RpiMotorLib | 337 | GPLv3 | 2026-05-11 | 모터드라이버 범용 라이브러리, 조사 대상 중 가장 활발 | 검증됨 |
| custom-build-robots/raspberry-pi-rc-car-controller | 14 | 미확인 | 미확인 | PCA9685+ESC 기반 실차 RC카 제어 | 미확인 |
| SaraEye/SaraKIT-RCCar-Python-Raspberry-Pi | 1 | MIT | 미확인(커밋 4개뿐) | Pi CM4 + BLDC 짐벌모터, 소규모 | 미확인 |
| nick-hunter/Raspberry_Pi_TB6612FNG_Python | 10 | 미확인 | 미확인(오래된 프로젝트로 추정) | | 미확인 |
| MarkusBansky/raspberry-i2c-tb6612fng | 5 | GPL-3.0 | 2025-09-16 (Pi5 테스트기록) | Pi5 실측 검증 기록 보유 | 검증됨 |

**관찰(해석 영역, 미확인 전제):** "RC카" 전용 오픈소스 프로젝트는 스타 수·활동성이 대체로 낮고, 실제로 활발한 것은 범용 모터/GPIO 라이브러리(RpiMotorLib, gpiozero, Adafruit CircuitPython 계열) 쪽입니다. "RC카 특화 프로젝트"보다 "범용 라이브러리 + 개인 조합" 형태가 주류로 보이나, 이는 전수조사에 기반한 결론이 아니라 이번 조사 범위 내 관찰 수준임을 밝힙니다.

---

## 4. 검증 판정 총괄

| # | 주장 | 판정 |
|---|---|---|
| 1 | gpiozero 2.0.1.post1~3 (2026-07-25/25/27, post1·2 yanked) | 확인됨 |
| 2 | Issue #1166 종료(2026-07-25)와 post1 버그 수정의 연결 | 확인됨(changelog 원문 확인) |
| 3 | rpi-lgpio 0.6(2024-05-11) 이후 약 2년 커밋 정체 | 확인됨(사실) / 부분확인(해석) |
| 4 | pigpio v79(2021-03-02), Pi5 하드코딩 차단(Issue #589) | 확인됨 |
| 5 | RpiMotorLib 스타 337 / GPLv3(GitHub API상 "Other"이나 LICENSE 원문은 GPLv3) / 2026-05-11 커밋 | 확인됨 |
| 6 | PCA9685 "릴리스 2024년 정체, 커밋만 2026년 지속" | **상충 발견 → 정정**: 실제로는 릴리스 자체가 2026-04-23까지 지속, 정체 없었음 |
| 7 | raspberry-i2c-tb6612fng README의 2025-09-16 테스트 기록 | 확인됨 |

**미확인 상태로 남은 항목** (교차검증 미완료, 향후 추가 확인 필요):
- TB6612FNG 소형 프로젝트들(nick-hunter 등)의 정확한 최근 커밋일
- pigpio-rp5(rgpio/kshetline 포크)의 정확한 저장소 및 성숙도
- RC카 전용 프로젝트 다수(custom-build-robots, SaraEye 등)의 라이선스/최근 활동
- RpiMotorLib의 rpi-lgpio 채택이 커뮤니티에서 폭넓게 "공식 표준"으로 인정되는지 여부

---

## 출처 목록

- gpiozero GitHub: https://github.com/gpiozero/gpiozero
- gpiozero PyPI: https://pypi.org/project/gpiozero/
- gpiozero Issue #1166: https://github.com/gpiozero/gpiozero/issues/1166
- rpi-lgpio GitHub (waveform80): https://github.com/waveform80/rpi-lgpio
- rpi-lgpio PyPI: https://pypi.org/project/rpi-lgpio/
- lgpio GitHub (joan2937/lg): https://github.com/joan2937/lg
- lgpio PyPI: https://pypi.org/project/lgpio/
- pigpio GitHub (joan2937): https://github.com/joan2937/pigpio
- pigpio Issue #589: https://github.com/joan2937/pigpio/issues/589
- RpiMotorLib GitHub: https://github.com/gavinlyonsrepo/RpiMotorLib
- nick-hunter/Raspberry_Pi_TB6612FNG_Python: https://github.com/nick-hunter/Raspberry_Pi_TB6612FNG_Python
- MarkusBansky/raspberry-i2c-tb6612fng: https://github.com/MarkusBansky/raspberry-i2c-tb6612fng
- AHSPC/DRV8833_micropython: https://github.com/AHSPC/DRV8833_micropython
- pololu/drv8835-motor-driver-rpi: https://github.com/pololu/drv8835-motor-driver-rpi
- Adafruit_CircuitPython_PCA9685 GitHub: https://github.com/adafruit/Adafruit_CircuitPython_PCA9685
- Adafruit_CircuitPython_PCA9685 PyPI: https://pypi.org/project/adafruit-circuitpython-pca9685/
- Adafruit_Python_PCA9685 (deprecated): https://github.com/adafruit/Adafruit_Python_PCA9685
- custom-build-robots/raspberry-pi-rc-car-controller: https://github.com/custom-build-robots/raspberry-pi-rc-car-controller
- SaraEye/SaraKIT-RCCar-Python-Raspberry-Pi: https://github.com/SaraEye/SaraKIT-RCCar-Python-Raspberry-Pi

※ pigpio-rp5(rgpio/kshetline 포크)의 정확한 URL은 미확인으로 본 목록에서 제외함.

---

## 참고: 이전 리서치 문서
- 2026-07-19 "라즈베리파이 RC카 자율주행 동향" (본 프로젝트 outputs/ 폴더 내, 파일 위치는 research-archivist 조회 필요)
