# 갤러그 (Galaga) 웹 게임

브라우저에서 바로 실행되는 간단한 갤러그 스타일 슈팅 게임입니다. 외부 라이브러리나 빌드 과정 없이 HTML 파일 하나로 동작합니다.

## 실행 방법

`games/galaga/index.html` 파일을 브라우저(Chrome, Edge, Firefox, Safari)에서 열면 됩니다.

터미널에서 여는 경우:

```
# macOS
open games/galaga/index.html

# Windows
start games/galaga/index.html

# Linux
xdg-open games/galaga/index.html
```

## 조작법

| 키 | 동작 |
|---|---|
| ← → 또는 A / D | 좌우 이동 |
| SPACE 또는 Z | 발사 |
| ENTER | 게임 시작 / 재시작 |
| P 또는 ESC | 일시정지 |

모바일 브라우저에서는 화면 하단에 터치 버튼이 표시됩니다.

## 게임 규칙

- 적은 보스(초록, 150점, 2발), 나비(빨강, 80점), 벌(파랑, 50점) 세 종류입니다.
- 급강하 중인 적을 격추하면 점수가 2배 이상으로 올라갑니다.
- 웨이브를 클리어할 때마다 적의 속도와 공격 빈도가 올라갑니다.
- 목숨은 3개이며, 최고 점수는 브라우저에 저장됩니다.
