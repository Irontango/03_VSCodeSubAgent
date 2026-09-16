/**
 * 도메인 계층에서 공유하는 타입. 브라우저 API에 의존하지 않는다(ADR-0002).
 */

export type Screen = 'TITLE' | 'PLAYING' | 'PAUSED' | 'WAVE_CLEAR' | 'GAMEOVER';

export type GameEvent = 'START' | 'TOGGLE_PAUSE' | 'BLUR';

export type EnemyKind = 'boss' | 'butterfly' | 'bee';

export interface Point {
  x: number;
  y: number;
}

/** 축 정렬 사각형. (x, y)는 중심점이다. */
export interface Box extends Point {
  w: number;
  h: number;
}

export interface Bezier {
  p0: Point;
  p1: Point;
  p2: Point;
  p3: Point;
}

/** 적의 행동 상태. 상태별로 필요한 데이터만 갖는다(docs/state-machine.md §2). */
export type EnemyPhase =
  | { kind: 'enter'; t: number; delay: number }
  | { kind: 'formation' }
  | { kind: 'dive'; t: number; dur: number; shootT: number; curve: Bezier }
  | { kind: 'return' };

export interface Enemy extends Box {
  id: number;
  kind: EnemyKind;
  hp: number;
  /** 대형 내 목표 위치(흔들림 제외). */
  fx: number;
  fy: number;
  /** 날개짓 애니메이션 위상. 렌더링 전용이지만 결정성을 위해 상태에 둔다. */
  wobble: number;
  phase: EnemyPhase;
}

export interface Bullet extends Box {
  vx: number;
  vy: number;
}

export interface Particle extends Point {
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export interface Player extends Box {
  alive: boolean;
  cooldown: number;
  respawnTimer: number;
  invincible: number;
}

export interface InputState {
  left: boolean;
  right: boolean;
  fire: boolean;
}

export type SoundId =
  'shoot' | 'enemyHit' | 'enemyKill' | 'bossKill' | 'enemyShoot' | 'playerHit' | 'waveClear';

/** 도메인이 외부 세계에 요청하는 부수 효과. main.ts가 어댑터로 전달한다. */
export type Effect = { type: 'sound'; id: SoundId } | { type: 'saveHiScore'; value: number };

export interface GameState {
  screen: Screen;
  score: number;
  hiScore: number;
  lives: number;
  wave: number;
  player: Player;
  bullets: Bullet[];
  enemyBullets: Bullet[];
  enemies: Enemy[];
  particles: Particle[];
  /** 게임 시작 이후 경과 시간(초). 대형 흔들림 계산에 사용. */
  elapsed: number;
  /** 현재 화면 상태의 남은 시간(WAVE_CLEAR 연출 등). */
  screenTimer: number;
  diveTimer: number;
}
