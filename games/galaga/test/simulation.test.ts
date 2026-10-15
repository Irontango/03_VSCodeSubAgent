/**
 * 통합 테스트: 여러 시스템이 함께 도는 시나리오를 시드 고정으로 검증한다.
 */
import { describe, expect, it } from 'vitest';
import { CANVAS } from '../src/config';
import { advance, startedGame } from './helpers';

describe('시뮬레이션', () => {
  it('충분한 시간이 지나면 모든 적이 대형 또는 급강하 상태다 (AC-6)', () => {
    const g = startedGame(11);
    g.state.player.invincible = 1e9; // 충돌로 적이 줄지 않게
    advance(g, 8);
    expect(g.state.enemies.length).toBe(40);
    for (const e of g.state.enemies) expect(e.phase.kind).not.toBe('enter');
    const inFormation = g.state.enemies.filter((e) => e.phase.kind === 'formation');
    expect(inFormation.length).toBeGreaterThan(30);
  });

  it('진입 완료 직후에는 모든 적이 정확히 대형 위치에 있다', () => {
    const g = startedGame(5);
    g.state.diveTimer = 1e9; // 급강하 억제
    advance(g, 8);
    for (const e of g.state.enemies) {
      expect(e.phase.kind).toBe('formation');
      expect(Math.abs(e.x - e.fx)).toBeLessThanOrEqual(23); // 흔들림 진폭 이내
      expect(e.y).toBe(e.fy);
    }
  });

  it('급강하한 적은 화면 아래로 빠졌다가 대형으로 복귀한다 (FR-E4, FR-E6)', () => {
    const g = startedGame(3);
    advance(g, 4);
    let sawDive = false;
    let sawReturn = false;
    for (let t = 0; t < 30 && !(sawDive && sawReturn); t += 1 / 60) {
      g.update(1 / 60);
      if (g.state.enemies.some((e) => e.phase.kind === 'dive')) sawDive = true;
      if (g.state.enemies.some((e) => e.phase.kind === 'return')) sawReturn = true;
    }
    expect(sawDive).toBe(true);
    expect(sawReturn).toBe(true);
  });

  it('급강하 중인 적은 조준탄을 쏜다 (FR-E5)', () => {
    const g = startedGame(3);
    g.state.player.invincible = 1e9; // 죽지 않게
    let aimed = false;
    for (let t = 0; t < 30 && !aimed; t += 1 / 60) {
      g.update(1 / 60);
      aimed = g.state.enemyBullets.some((b) => b.vx !== 0);
    }
    expect(aimed).toBe(true);
  });

  it('같은 시드와 입력은 같은 상태를 만든다 (AC-9, NFR-6)', () => {
    const a = startedGame(2024);
    const b = startedGame(2024);
    for (let i = 0; i < 60 * 20; i++) {
      const input = { left: i % 120 < 60, right: i % 120 >= 60, fire: i % 7 === 0 };
      a.update(1 / 60, input);
      b.update(1 / 60, input);
    }
    expect(JSON.stringify(a.state)).toBe(JSON.stringify(b.state));
  });

  it('다른 시드는 다른 결과를 만든다', () => {
    const a = startedGame(1);
    const b = startedGame(2);
    advance(a, 10);
    advance(b, 10);
    expect(JSON.stringify(a.state)).not.toBe(JSON.stringify(b.state));
  });

  it('탄과 파티클은 화면 밖에서 누적되지 않는다', () => {
    const g = startedGame(9);
    g.state.player.invincible = 1e9;
    advance(g, 30, { fire: true });
    for (const b of g.state.bullets) expect(b.y).toBeGreaterThan(-50);
    for (const b of g.state.enemyBullets) {
      expect(b.y).toBeLessThan(CANVAS.height + 50);
      expect(b.x).toBeGreaterThan(-50);
      expect(b.x).toBeLessThan(CANVAS.width + 50);
    }
    expect(g.state.particles.length).toBeLessThan(500);
  });

  it('30초 동안 플레이해도 예외 없이 진행되고 점수가 증가한다', () => {
    const g = startedGame(77);
    g.state.player.invincible = 1e9;
    let x = 0;
    for (let i = 0; i < 60 * 30; i++) {
      x = (x + 1) % 240;
      g.update(1 / 60, { left: x < 120, right: x >= 120, fire: true });
    }
    expect(g.state.score).toBeGreaterThan(0);
    expect(['PLAYING', 'WAVE_CLEAR']).toContain(g.state.screen);
  });
});
