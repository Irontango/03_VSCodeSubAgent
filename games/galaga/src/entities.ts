/**
 * 엔티티 생성과 순수 기하 연산. 상태를 바꾸는 규칙은 game.ts에 있다.
 */
import { CANVAS, DIVE, ENEMY_KINDS, FORMATION, PARTICLES, PLAYER } from './config';
import type { Rng } from './rng';
import { randomRange } from './rng';
import type { Bezier, Box, Enemy, Particle, Player, Point } from './types';

export function createPlayer(): Player {
  return {
    x: CANVAS.width / 2,
    y: CANVAS.height - PLAYER.bottomOffset,
    w: PLAYER.width,
    h: PLAYER.height,
    alive: true,
    cooldown: 0,
    respawnTimer: 0,
    invincible: PLAYER.startInvincible,
  };
}

/** 웨이브의 적 대형을 생성한다(FR-E1, FR-E2). */
export function createWaveEnemies(firstId = 0): Enemy[] {
  const enemies: Enemy[] = [];
  let id = firstId;
  FORMATION.rows.forEach((row, r) => {
    const def = ENEMY_KINDS[row.kind];
    const totalW = (row.count - 1) * FORMATION.spacingX;
    for (let i = 0; i < row.count; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      enemies.push({
        id: id++,
        kind: row.kind,
        hp: def.hp,
        w: def.width,
        h: def.height,
        fx: CANVAS.width / 2 - totalW / 2 + i * FORMATION.spacingX,
        fy: FORMATION.top + r * FORMATION.spacingY,
        x: CANVAS.width / 2 + side * (CANVAS.width / 2 + 40),
        y: FORMATION.entryStartY - r * FORMATION.entryStartRowStep - i * FORMATION.entryStartColStep,
        wobble: (r * row.count + i) * 0.7,
        phase: { kind: 'enter', t: 0, delay: (r * row.count + i) * FORMATION.entryDelayStep },
      });
    }
  });
  return enemies;
}

/** 급강하 경로(3차 베지어)를 만든다(FR-E4). */
export function createDiveCurve(enemy: Point, target: Point, rng: Rng): Bezier {
  const dir = enemy.x < CANVAS.width / 2 ? 1 : -1;
  return {
    p0: { x: enemy.x, y: enemy.y },
    p1: {
      x: enemy.x + dir * randomRange(rng, DIVE.sideOffsetMin, DIVE.sideOffsetJitter),
      y: enemy.y - DIVE.upOffset,
    },
    p2: { x: target.x + (rng.next() - 0.5) * DIVE.midXJitter, y: CANVAS.height * DIVE.midYRatio },
    p3: {
      x: target.x - dir * DIVE.endXBack + (rng.next() - 0.5) * DIVE.endXJitter,
      y: CANVAS.height + DIVE.endYOverflow,
    },
  };
}

export function bezierPoint(c: Bezier, u: number): Point {
  const mt = 1 - u;
  const a = mt * mt * mt;
  const b = 3 * mt * mt * u;
  const cc = 3 * mt * u * u;
  const d = u * u * u;
  return {
    x: a * c.p0.x + b * c.p1.x + cc * c.p2.x + d * c.p3.x,
    y: a * c.p0.y + b * c.p1.y + cc * c.p2.y + d * c.p3.y,
  };
}

/** 중심점 기준 AABB 충돌. */
export function boxesOverlap(a: Box, b: Box): boolean {
  return Math.abs(a.x - b.x) < (a.w + b.w) / 2 && Math.abs(a.y - b.y) < (a.h + b.h) / 2;
}

export function createExplosion(at: Point, color: string, count: number, rng: Rng): Particle[] {
  const out: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = rng.next() * Math.PI * 2;
    const speed = randomRange(rng, PARTICLES.speedMin, PARTICLES.speedJitter);
    out.push({
      x: at.x,
      y: at.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: randomRange(rng, PARTICLES.lifeMin, PARTICLES.lifeJitter),
      color,
    });
  }
  return out;
}
