/**
 * 밸런스와 레이아웃 수치의 단일 진실 공급원(NFR-7).
 * 로직 코드에 숫자 리터럴을 두지 않고 여기서 가져다 쓴다.
 */
import type { EnemyKind } from './types';

export const CANVAS = { width: 480, height: 640 } as const;

export const PLAYER = {
  width: 28,
  height: 24,
  /** 화면 하단으로부터의 거리 */
  bottomOffset: 50,
  speed: 260,
  fireCooldown: 0.22,
  maxBullets: 3,
  bulletSpeed: 520,
  bulletWidth: 3,
  bulletHeight: 12,
  startLives: 3,
  respawnDelay: 1.8,
  startInvincible: 2,
  respawnInvincible: 2.5,
} as const;

export interface EnemyKindDef {
  color: string;
  color2: string;
  hp: number;
  score: number;
  diveScore: number;
  width: number;
  height: number;
}

export const ENEMY_KINDS: Record<EnemyKind, EnemyKindDef> = {
  boss: { color: '#4cff6a', color2: '#1f9c3a', hp: 2, score: 150, diveScore: 400, width: 24, height: 20 },
  butterfly: { color: '#ff4c6a', color2: '#b0203c', hp: 1, score: 80, diveScore: 160, width: 24, height: 20 },
  bee: { color: '#4cb8ff', color2: '#2060b0', hp: 1, score: 50, diveScore: 100, width: 24, height: 20 },
};

export const FORMATION = {
  rows: [
    { kind: 'boss', count: 4 },
    { kind: 'butterfly', count: 8 },
    { kind: 'butterfly', count: 8 },
    { kind: 'bee', count: 10 },
    { kind: 'bee', count: 10 },
  ] as ReadonlyArray<{ kind: EnemyKind; count: number }>,
  spacingX: 38,
  spacingY: 36,
  top: 70,
  swayAmplitude: 22,
  swayFrequency: 0.9,
  /** 진입 순서(행·열 인덱스)당 지연 시간 */
  entryDelayStep: 0.06,
  entrySpeed: 300,
  /** 진입 경로의 좌우 휘어짐 */
  entryCurl: 120,
  entryCurlFrequency: 3,
  returnSpeed: 220,
  /** 진입 시작 y: 위쪽 화면 밖, 행·열마다 더 멀리 */
  entryStartY: -40,
  entryStartRowStep: 30,
  entryStartColStep: 12,
} as const;

export const DIVE = {
  baseDuration: 2.6,
  durationPerWave: 0.1,
  maxDurationReduction: 1.0,
  /** 제어점 오프셋 */
  sideOffsetMin: 120,
  sideOffsetJitter: 80,
  upOffset: 60,
  midYRatio: 0.55,
  midXJitter: 200,
  endXBack: 40,
  endXJitter: 80,
  endYOverflow: 40,
  /** 조준 사격 */
  firstShotMin: 0.5,
  firstShotJitter: 0.5,
  shotIntervalMin: 0.9,
  shotIntervalJitter: 0.6,
  /** 플레이어보다 이 거리 이상 위에 있을 때만 사격 */
  shotMinHeightAbovePlayer: 60,
  /** 동시에 급강하하는 최대 마리 수 = min(3, 1 + wave/2) */
  maxSimultaneous: 3,
} as const;

export const DIFFICULTY = {
  speedPerWave: 0.12,
  diveDelayBase: 2.4,
  diveDelayPerWave: 0.15,
  diveDelayMin: 0.7,
  diveDelayJitter: 0.8,
  firstDiveDelay: 2.5,
  waveStartDiveDelay: 2,
  formationFireRateBase: 0.25,
  formationFireRatePerWave: 0.08,
  formationBulletSpeed: 180,
  formationBulletSpeedPerWave: 10,
  aimedBulletSpeed: 200,
  aimedBulletSpeedPerWave: 12,
} as const;

export const ENEMY_BULLET = { width: 4, height: 10 } as const;

export const TIMING = {
  waveClearDuration: 2.2,
  /** 한 프레임에 적용하는 최대 dt(탭 전환 후 점프 방지) */
  maxDt: 0.05,
} as const;

export const PARTICLES = {
  enemyKill: 16,
  enemyHit: 5,
  playerDeath: 28,
  speedMin: 40,
  speedJitter: 140,
  lifeMin: 0.5,
  lifeJitter: 0.4,
} as const;

export const STORAGE_KEY = 'galaga_hi';
