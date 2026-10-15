import { describe, expect, it } from 'vitest';
import { ENEMY_KINDS } from '../src/config';
import type { EnemyKind } from '../src/types';
import { firstEnemyOfKind, settleFormation, startedGame, STEP } from './helpers';

function killInFormation(kind: EnemyKind): number {
  const g = startedGame();
  settleFormation(g);
  const e = firstEnemyOfKind(g, kind);
  e.hp = 1;
  g.state.bullets.push({ x: e.x, y: e.y, w: 3, h: 12, vx: 0, vy: 0 });
  g.update(STEP);
  return g.state.score;
}

function killWhileDiving(kind: EnemyKind): number {
  const g = startedGame();
  settleFormation(g);
  const e = firstEnemyOfKind(g, kind);
  e.hp = 1;
  const at = { x: 240, y: 300 };
  e.phase = { kind: 'dive', t: 0, dur: 100, shootT: 100, curve: { p0: at, p1: at, p2: at, p3: at } };
  g.state.bullets.push({ x: at.x, y: at.y, w: 3, h: 12, vx: 0, vy: 0 });
  g.update(STEP);
  return g.state.score;
}

describe('점수 (FR-S1, 부록 A)', () => {
  it.each<EnemyKind>(['boss', 'butterfly', 'bee'])('%s 대형 격추 점수', (kind) => {
    expect(killInFormation(kind)).toBe(ENEMY_KINDS[kind].score);
  });

  it.each<EnemyKind>(['boss', 'butterfly', 'bee'])('%s 급강하 격추 점수', (kind) => {
    expect(killWhileDiving(kind)).toBe(ENEMY_KINDS[kind].diveScore);
  });

  it('벌: 대형 50점, 급강하 100점 (AC-4)', () => {
    expect(killInFormation('bee')).toBe(50);
    expect(killWhileDiving('bee')).toBe(100);
  });

  it('급강하 점수는 항상 대형 점수보다 크다', () => {
    for (const def of Object.values(ENEMY_KINDS)) expect(def.diveScore).toBeGreaterThan(def.score);
  });
});
