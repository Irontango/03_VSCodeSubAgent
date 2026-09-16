import { describe, expect, it } from 'vitest';
import { CANVAS, FORMATION } from '../src/config';
import { bezierPoint, boxesOverlap, createDiveCurve, createWaveEnemies } from '../src/entities';
import { createSeededRng } from '../src/rng';

describe('createWaveEnemies', () => {
  it('설정된 행 구성대로 적을 만든다 (FR-E1)', () => {
    const enemies = createWaveEnemies();
    const expected = FORMATION.rows.reduce((n, r) => n + r.count, 0);
    expect(enemies).toHaveLength(expected);
    expect(enemies.filter((e) => e.kind === 'boss')).toHaveLength(4);
    expect(enemies.filter((e) => e.kind === 'butterfly')).toHaveLength(16);
    expect(enemies.filter((e) => e.kind === 'bee')).toHaveLength(20);
  });

  it('모든 적은 화면 밖에서 진입 상태로 시작한다 (FR-E2)', () => {
    for (const e of createWaveEnemies()) {
      expect(e.phase.kind).toBe('enter');
      expect(e.x < 0 || e.x > CANVAS.width || e.y < 0).toBe(true);
    }
  });

  it('대형 목표 위치는 화면 안에 있고 서로 겹치지 않는다', () => {
    const enemies = createWaveEnemies();
    const seen = new Set<string>();
    for (const e of enemies) {
      expect(e.fx).toBeGreaterThan(0);
      expect(e.fx).toBeLessThan(CANVAS.width);
      const key = `${e.fx},${e.fy}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });

  it('id는 firstId부터 연속으로 부여된다', () => {
    const enemies = createWaveEnemies(100);
    expect(enemies[0]?.id).toBe(100);
    expect(enemies[enemies.length - 1]?.id).toBe(100 + enemies.length - 1);
  });
});

describe('boxesOverlap', () => {
  it('중심 거리가 반폭 합보다 작으면 겹친다', () => {
    const a = { x: 0, y: 0, w: 10, h: 10 };
    expect(boxesOverlap(a, { x: 9, y: 0, w: 10, h: 10 })).toBe(true);
    expect(boxesOverlap(a, { x: 10, y: 0, w: 10, h: 10 })).toBe(false);
    expect(boxesOverlap(a, { x: 0, y: 11, w: 10, h: 10 })).toBe(false);
  });
});

describe('bezierPoint / createDiveCurve', () => {
  it('u=0은 시작점, u=1은 끝점이다', () => {
    const c = createDiveCurve({ x: 100, y: 100 }, { x: 240, y: 590 }, createSeededRng(1));
    expect(bezierPoint(c, 0)).toEqual(c.p0);
    expect(bezierPoint(c, 1)).toEqual(c.p3);
  });

  it('급강하 경로는 화면 아래로 빠진다 (FR-E4)', () => {
    const c = createDiveCurve({ x: 100, y: 100 }, { x: 240, y: 590 }, createSeededRng(1));
    expect(c.p3.y).toBeGreaterThan(CANVAS.height);
  });
});
