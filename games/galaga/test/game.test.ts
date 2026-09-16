import { describe, expect, it } from 'vitest';
import { CANVAS, PLAYER, TIMING } from '../src/config';
import {
  advance,
  firstEnemyOfKind,
  killAllEnemies,
  newGame,
  settleFormation,
  startedGame,
  STEP,
} from './helpers';

describe('화면 상태 전이 (FR-U1, docs/state-machine.md)', () => {
  it('초기 상태는 TITLE 이다', () => {
    expect(newGame().state.screen).toBe('TITLE');
  });

  it('TITLE에서 START 하면 PLAYING 이고 초기값이 세팅된다 (AC-1)', () => {
    const g = startedGame();
    expect(g.state.screen).toBe('PLAYING');
    expect(g.state.score).toBe(0);
    expect(g.state.lives).toBe(PLAYER.startLives);
    expect(g.state.wave).toBe(1);
    expect(g.state.enemies).toHaveLength(40);
  });

  it('PLAYING ↔ PAUSED 토글, BLUR는 PAUSED로만 간다', () => {
    const g = startedGame();
    g.dispatch('TOGGLE_PAUSE');
    expect(g.state.screen).toBe('PAUSED');
    g.dispatch('BLUR');
    expect(g.state.screen).toBe('PAUSED');
    g.dispatch('TOGGLE_PAUSE');
    expect(g.state.screen).toBe('PLAYING');
    g.dispatch('BLUR');
    expect(g.state.screen).toBe('PAUSED');
  });

  it('PAUSED 중에는 게임 로직이 진행되지 않는다 (FR-U4)', () => {
    const g = startedGame();
    g.dispatch('TOGGLE_PAUSE');
    const before = JSON.stringify(g.state.enemies);
    advance(g, 2, { fire: true, left: true });
    expect(JSON.stringify(g.state.enemies)).toBe(before);
    expect(g.state.bullets).toHaveLength(0);
  });

  it('START는 TITLE/GAMEOVER 에서만 유효하다', () => {
    const g = startedGame();
    advance(g, 1);
    const before = g.state.enemies.map((e) => e.id);
    g.dispatch('START');
    expect(g.state.enemies.map((e) => e.id)).toEqual(before);
  });

  it('적이 모두 사라지면 WAVE_CLEAR 후 다음 웨이브가 시작된다 (AC-7)', () => {
    const g = startedGame();
    killAllEnemies(g);
    const effects = g.update(STEP);
    expect(g.state.screen).toBe('WAVE_CLEAR');
    expect(effects).toContainEqual({ type: 'sound', id: 'waveClear' });
    advance(g, TIMING.waveClearDuration + STEP);
    expect(g.state.screen).toBe('PLAYING');
    expect(g.state.wave).toBe(2);
    expect(g.state.enemies).toHaveLength(40);
  });

  it('WAVE_CLEAR 중에는 급강하가 시작되지 않는다', () => {
    const g = startedGame();
    killAllEnemies(g);
    g.update(STEP);
    advance(g, 1);
    expect(g.state.enemies).toHaveLength(0);
  });
});

describe('플레이어', () => {
  it('화면 밖으로 나가지 않는다 (AC-3)', () => {
    const g = startedGame();
    advance(g, 5, { left: true });
    expect(g.state.player.x).toBe(PLAYER.width / 2);
    advance(g, 5, { right: true });
    expect(g.state.player.x).toBe(CANVAS.width - PLAYER.width / 2);
  });

  it('이동은 프레임 크기와 무관하게 시간 기반이다 (NFR-4)', () => {
    const a = startedGame();
    const b = startedGame();
    advance(a, 0.5, { right: true }); // 30 × 1/60
    for (let i = 0; i < 5; i++) b.update(0.1, { left: false, right: true, fire: false }); // 5 × 0.1
    expect(a.state.player.x).toBeCloseTo(b.state.player.x, 6);
    expect(a.state.player.x).toBeCloseTo(CANVAS.width / 2 + PLAYER.speed * 0.5, 6);
  });

  it('동시에 최대 3발만 발사된다 (AC-2)', () => {
    const g = startedGame();
    advance(g, 2, { fire: true });
    expect(g.state.bullets.length).toBeLessThanOrEqual(PLAYER.maxBullets);
    expect(g.state.bullets.length).toBeGreaterThan(0);
  });

  it('발사 사이에 쿨다운이 있다 (FR-P3)', () => {
    const g = startedGame();
    g.update(STEP, { left: false, right: false, fire: true });
    expect(g.state.bullets).toHaveLength(1);
    g.update(STEP, { left: false, right: false, fire: true });
    expect(g.state.bullets).toHaveLength(1);
  });

  it('피격 시 목숨이 줄고 재출현하며 무적이 된다 (FR-P4, FR-P5)', () => {
    const g = startedGame();
    const p = g.state.player;
    p.invincible = 0;
    g.state.enemyBullets.push({ x: p.x, y: p.y, w: 4, h: 10, vx: 0, vy: 0 });
    const effects = g.update(STEP);
    expect(p.alive).toBe(false);
    expect(g.state.lives).toBe(PLAYER.startLives - 1);
    expect(effects).toContainEqual({ type: 'sound', id: 'playerHit' });
    advance(g, PLAYER.respawnDelay + STEP);
    expect(p.alive).toBe(true);
    expect(p.x).toBe(CANVAS.width / 2);
    expect(p.invincible).toBeGreaterThan(0);
  });

  it('무적 중에는 피격되지 않는다 (FR-P5)', () => {
    const g = startedGame();
    const p = g.state.player;
    expect(p.invincible).toBeGreaterThan(0);
    g.state.enemyBullets.push({ x: p.x, y: p.y, w: 4, h: 10, vx: 0, vy: 0 });
    g.update(STEP);
    expect(p.alive).toBe(true);
    expect(g.state.lives).toBe(PLAYER.startLives);
  });

  it('목숨 0에서 피격되면 GAMEOVER 이고 최고 점수를 저장한다 (AC-8)', () => {
    const g = startedGame(1, 100);
    g.state.lives = 0;
    g.state.score = 500;
    const p = g.state.player;
    p.invincible = 0;
    g.state.enemyBullets.push({ x: p.x, y: p.y, w: 4, h: 10, vx: 0, vy: 0 });
    const effects = g.update(STEP);
    expect(g.state.screen).toBe('GAMEOVER');
    expect(g.state.hiScore).toBe(500);
    expect(effects).toContainEqual({ type: 'saveHiScore', value: 500 });
  });

  it('최고 점수보다 낮으면 저장 효과를 내지 않는다 (FR-S5)', () => {
    const g = startedGame(1, 1000);
    g.state.lives = 0;
    g.state.score = 500;
    const p = g.state.player;
    p.invincible = 0;
    g.state.enemyBullets.push({ x: p.x, y: p.y, w: 4, h: 10, vx: 0, vy: 0 });
    const effects = g.update(STEP);
    expect(g.state.hiScore).toBe(1000);
    expect(effects.some((e) => e.type === 'saveHiScore')).toBe(false);
  });

  it('GAMEOVER 에서 START 하면 새 게임이 시작된다', () => {
    const g = startedGame();
    g.state.lives = 0;
    g.state.player.invincible = 0;
    g.state.enemyBullets.push({ ...g.state.player, vx: 0, vy: 0 });
    g.update(STEP);
    expect(g.state.screen).toBe('GAMEOVER');
    g.dispatch('START');
    expect(g.state.screen).toBe('PLAYING');
    expect(g.state.lives).toBe(PLAYER.startLives);
    expect(g.state.player.alive).toBe(true);
  });
});

describe('적 체력', () => {
  it('보스는 두 번 맞아야 파괴된다 (AC-5)', () => {
    const g = startedGame();
    settleFormation(g);
    const boss = firstEnemyOfKind(g, 'boss');
    const hit = () => g.state.bullets.push({ x: boss.x, y: boss.y, w: 3, h: 12, vx: 0, vy: 0 });
    hit();
    const fx1 = g.update(STEP);
    expect(g.state.enemies.some((e) => e.id === boss.id)).toBe(true);
    expect(fx1).toContainEqual({ type: 'sound', id: 'enemyHit' });
    hit();
    // 보스는 대형에서 흔들리므로 현재 위치로 다시 조준
    const b = g.state.bullets[g.state.bullets.length - 1];
    if (b) {
      b.x = boss.x;
      b.y = boss.y;
    }
    const fx2 = g.update(STEP);
    expect(g.state.enemies.some((e) => e.id === boss.id)).toBe(false);
    expect(fx2).toContainEqual({ type: 'sound', id: 'bossKill' });
  });

  it('급강하 중인 적과 충돌하면 둘 다 파괴된다 (FR-E8)', () => {
    const g = startedGame();
    settleFormation(g);
    const p = g.state.player;
    p.invincible = 0;
    const bee = firstEnemyOfKind(g, 'bee');
    bee.phase = {
      kind: 'dive',
      t: 0,
      dur: 100,
      shootT: 100,
      curve: {
        p0: { x: p.x, y: p.y },
        p1: { x: p.x, y: p.y },
        p2: { x: p.x, y: p.y },
        p3: { x: p.x, y: p.y },
      },
    };
    g.update(STEP);
    expect(g.state.enemies.some((e) => e.id === bee.id)).toBe(false);
    expect(p.alive).toBe(false);
    expect(g.state.score).toBe(50);
  });
});
