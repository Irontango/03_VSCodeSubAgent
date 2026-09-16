/**
 * 게임 규칙(도메인). DOM/Canvas/Audio/Storage를 알지 못한다(ADR-0002).
 * 상태 전이는 dispatch()와 update() 두 곳에서만 일어난다(docs/state-machine.md).
 */
import {
  CANVAS,
  DIFFICULTY,
  DIVE,
  ENEMY_BULLET,
  ENEMY_KINDS,
  FORMATION,
  PARTICLES,
  PLAYER,
  TIMING,
} from './config';
import {
  bezierPoint,
  boxesOverlap,
  createDiveCurve,
  createExplosion,
  createPlayer,
  createWaveEnemies,
} from './entities';
import type { Rng } from './rng';
import { randomInt, randomRange } from './rng';
import type { Effect, Enemy, GameEvent, GameState, InputState, Point } from './types';

export interface GameOptions {
  rng: Rng;
  hiScore?: number;
}

/** 날개짓 애니메이션 속도(rad/s) */
const WOBBLE_SPEED = 4;

export const IDLE_INPUT: Readonly<InputState> = { left: false, right: false, fire: false };

export class Game {
  readonly state: GameState;
  private readonly rng: Rng;
  private nextEnemyId = 0;
  private effects: Effect[] = [];

  constructor(options: GameOptions) {
    this.rng = options.rng;
    this.state = {
      screen: 'TITLE',
      score: 0,
      hiScore: options.hiScore ?? 0,
      lives: PLAYER.startLives,
      wave: 1,
      player: createPlayer(),
      bullets: [],
      enemyBullets: [],
      enemies: [],
      particles: [],
      elapsed: 0,
      screenTimer: 0,
      diveTimer: 0,
    };
  }

  // ---------- 이벤트 기반 전이 ----------

  dispatch(event: GameEvent): Effect[] {
    const s = this.state;
    switch (event) {
      case 'START':
        if (s.screen === 'TITLE' || s.screen === 'GAMEOVER') this.startNewGame();
        break;
      case 'TOGGLE_PAUSE':
        if (s.screen === 'PLAYING') s.screen = 'PAUSED';
        else if (s.screen === 'PAUSED') s.screen = 'PLAYING';
        break;
      case 'BLUR':
        if (s.screen === 'PLAYING') s.screen = 'PAUSED';
        break;
    }
    return this.drainEffects();
  }

  // ---------- 시간 기반 진행 ----------

  update(dt: number, input: Readonly<InputState> = IDLE_INPUT): Effect[] {
    const s = this.state;
    this.updateParticles(dt);

    if (s.screen === 'WAVE_CLEAR') {
      s.screenTimer -= dt;
      if (s.screenTimer <= 0) this.startWave(s.wave + 1);
      return this.drainEffects();
    }
    if (s.screen !== 'PLAYING') return this.drainEffects();

    s.elapsed += dt;
    this.updatePlayer(dt, input);
    this.updateBullets(dt);
    this.updateEnemies(dt);
    this.updateDives(dt);
    this.updateFormationFire(dt);
    this.resolvePlayerBulletHits();
    this.resolvePlayerHits();

    if (s.enemies.length === 0) {
      s.screen = 'WAVE_CLEAR';
      s.screenTimer = TIMING.waveClearDuration;
      this.emit({ type: 'sound', id: 'waveClear' });
    }
    return this.drainEffects();
  }

  // ---------- 내부: 전이 부수 효과 ----------

  private startNewGame(): void {
    const s = this.state;
    s.score = 0;
    s.lives = PLAYER.startLives;
    s.particles = [];
    s.elapsed = 0;
    s.player = createPlayer();
    this.startWave(1);
    s.diveTimer = DIFFICULTY.firstDiveDelay;
  }

  private startWave(wave: number): void {
    const s = this.state;
    s.wave = wave;
    s.bullets = [];
    s.enemyBullets = [];
    s.enemies = createWaveEnemies(this.nextEnemyId);
    this.nextEnemyId += s.enemies.length;
    s.diveTimer = DIFFICULTY.waveStartDiveDelay;
    s.screen = 'PLAYING';
  }

  private speedMultiplier(): number {
    return 1 + (this.state.wave - 1) * DIFFICULTY.speedPerWave;
  }

  private emit(effect: Effect): void {
    this.effects.push(effect);
  }

  private drainEffects(): Effect[] {
    const out = this.effects;
    this.effects = [];
    return out;
  }

  // ---------- 내부: 플레이어 ----------

  private updatePlayer(dt: number, input: Readonly<InputState>): void {
    const s = this.state;
    const p = s.player;
    if (!p.alive) {
      p.respawnTimer -= dt;
      if (p.respawnTimer <= 0 && s.lives >= 0) {
        p.alive = true;
        p.x = CANVAS.width / 2;
        p.invincible = PLAYER.respawnInvincible;
      }
      return;
    }
    if (p.invincible > 0) p.invincible -= dt;
    if (input.left) p.x -= PLAYER.speed * dt;
    if (input.right) p.x += PLAYER.speed * dt;
    p.x = Math.max(p.w / 2, Math.min(CANVAS.width - p.w / 2, p.x)); // FR-P1
    p.cooldown -= dt;
    if (input.fire && p.cooldown <= 0 && s.bullets.length < PLAYER.maxBullets) {
      // FR-P2, FR-P3
      s.bullets.push({
        x: p.x,
        y: p.y - 14,
        w: PLAYER.bulletWidth,
        h: PLAYER.bulletHeight,
        vx: 0,
        vy: -PLAYER.bulletSpeed,
      });
      p.cooldown = PLAYER.fireCooldown;
      this.emit({ type: 'sound', id: 'shoot' });
    }
  }

  private killPlayer(): void {
    const s = this.state;
    const p = s.player;
    if (!p.alive || p.invincible > 0) return;
    s.particles.push(...createExplosion(p, '#ffffff', PARTICLES.playerDeath, this.rng));
    this.emit({ type: 'sound', id: 'playerHit' });
    p.alive = false;
    p.respawnTimer = PLAYER.respawnDelay;
    s.lives -= 1;
    if (s.lives < 0) {
      // FR-P6, FR-S5
      s.screen = 'GAMEOVER';
      if (s.score > s.hiScore) {
        s.hiScore = s.score;
        this.emit({ type: 'saveHiScore', value: s.score });
      }
    }
  }

  // ---------- 내부: 탄 ----------

  private updateBullets(dt: number): void {
    const s = this.state;
    for (const b of s.bullets) b.y += b.vy * dt;
    s.bullets = s.bullets.filter((b) => b.y > -20);
    for (const b of s.enemyBullets) {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
    }
    s.enemyBullets = s.enemyBullets.filter(
      (b) => b.y < CANVAS.height + 20 && b.x > -20 && b.x < CANVAS.width + 20,
    );
  }

  // ---------- 내부: 적 이동 ----------

  private swayOffset(): number {
    return Math.sin(this.state.elapsed * FORMATION.swayFrequency) * FORMATION.swayAmplitude; // FR-E3
  }

  private updateEnemies(dt: number): void {
    const s = this.state;
    const sway = this.swayOffset();
    const speedMul = this.speedMultiplier();

    for (const e of s.enemies) {
      e.wobble += dt * WOBBLE_SPEED;
      const target: Point = { x: e.fx + sway, y: e.fy };
      const ph = e.phase;

      switch (ph.kind) {
        case 'enter': {
          ph.t += dt;
          if (ph.t < ph.delay) break;
          const flight = ph.t - ph.delay;
          const speed = FORMATION.entrySpeed * speedMul;
          if (this.moveToward(e, target, speed * dt)) {
            e.phase = { kind: 'formation' };
          } else {
            e.x += Math.sin(flight * FORMATION.entryCurlFrequency) * FORMATION.entryCurl * dt;
          }
          break;
        }
        case 'formation':
          e.x = target.x;
          e.y = target.y;
          break;
        case 'dive': {
          ph.t += dt;
          const u = Math.min(1, ph.t / ph.dur);
          const pt = bezierPoint(ph.curve, u);
          e.x = pt.x;
          e.y = pt.y;
          this.maybeAimedShot(e, ph, dt);
          if (u >= 1) {
            e.phase = { kind: 'return' };
            e.x = target.x;
            e.y = -30;
          }
          break;
        }
        case 'return': {
          const speed = FORMATION.returnSpeed * speedMul;
          if (this.moveToward(e, target, speed * dt)) e.phase = { kind: 'formation' };
          break;
        }
      }
    }
  }

  /** target을 향해 step만큼 이동. 도달하면 true. */
  private moveToward(e: Enemy, target: Point, step: number): boolean {
    const dx = target.x - e.x;
    const dy = target.y - e.y;
    const d = Math.hypot(dx, dy);
    if (d <= step) {
      e.x = target.x;
      e.y = target.y;
      return true;
    }
    e.x += (dx / d) * step;
    e.y += (dy / d) * step;
    return false;
  }

  private maybeAimedShot(e: Enemy, ph: Extract<Enemy['phase'], { kind: 'dive' }>, dt: number): void {
    const s = this.state;
    const p = s.player;
    ph.shootT -= dt;
    if (ph.shootT > 0 || !p.alive || e.y >= p.y - DIVE.shotMinHeightAbovePlayer) return;
    ph.shootT = randomRange(this.rng, DIVE.shotIntervalMin, DIVE.shotIntervalJitter);
    const angle = Math.atan2(p.y - e.y, p.x - e.x);
    const speed = DIFFICULTY.aimedBulletSpeed + s.wave * DIFFICULTY.aimedBulletSpeedPerWave;
    s.enemyBullets.push({
      x: e.x,
      y: e.y + 8,
      w: ENEMY_BULLET.width,
      h: ENEMY_BULLET.height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
    });
    this.emit({ type: 'sound', id: 'enemyShoot' });
  }

  // ---------- 내부: 급강하 개시 / 대형 사격 ----------

  private updateDives(dt: number): void {
    const s = this.state;
    s.diveTimer -= dt;
    if (s.diveTimer > 0 || !s.player.alive) return;

    const candidates = s.enemies.filter((e) => e.phase.kind === 'formation');
    if (candidates.length > 0) {
      const maxCount = Math.min(DIVE.maxSimultaneous, 1 + s.wave / 2);
      const count = Math.min(candidates.length, 1 + randomInt(this.rng, maxCount));
      const dur =
        (DIVE.baseDuration - Math.min(DIVE.maxDurationReduction, s.wave * DIVE.durationPerWave)) /
        this.speedMultiplier();
      for (let i = 0; i < count; i++) {
        const [e] = candidates.splice(randomInt(this.rng, candidates.length), 1);
        if (!e) break;
        e.phase = {
          kind: 'dive',
          t: 0,
          dur,
          shootT: randomRange(this.rng, DIVE.firstShotMin, DIVE.firstShotJitter),
          curve: createDiveCurve(e, s.player, this.rng),
        };
      }
    }
    s.diveTimer =
      Math.max(DIFFICULTY.diveDelayMin, DIFFICULTY.diveDelayBase - s.wave * DIFFICULTY.diveDelayPerWave) +
      this.rng.next() * DIFFICULTY.diveDelayJitter;
  }

  private updateFormationFire(dt: number): void {
    const s = this.state;
    if (!s.player.alive) return;
    const rate = DIFFICULTY.formationFireRateBase + s.wave * DIFFICULTY.formationFireRatePerWave;
    if (this.rng.next() >= dt * rate) return;
    const formation = s.enemies.filter((e) => e.phase.kind === 'formation');
    const e = formation[randomInt(this.rng, formation.length)];
    if (!e) return;
    s.enemyBullets.push({
      x: e.x,
      y: e.y + 10,
      w: ENEMY_BULLET.width,
      h: ENEMY_BULLET.height,
      vx: 0,
      vy: DIFFICULTY.formationBulletSpeed + s.wave * DIFFICULTY.formationBulletSpeedPerWave,
    });
  }

  // ---------- 내부: 충돌 ----------

  private resolvePlayerBulletHits(): void {
    const s = this.state;
    for (const b of s.bullets) {
      for (const e of s.enemies) {
        if (e.hp <= 0 || !boxesOverlap(b, e)) continue;
        b.y = -100; // 소모된 탄은 다음 필터에서 제거
        e.hp -= 1;
        if (e.hp <= 0) this.awardKill(e);
        else {
          s.particles.push(...createExplosion(e, '#ffffff', PARTICLES.enemyHit, this.rng));
          this.emit({ type: 'sound', id: 'enemyHit' });
        }
        break;
      }
    }
    s.bullets = s.bullets.filter((b) => b.y > -50);
    s.enemies = s.enemies.filter((e) => e.hp > 0);
  }

  private awardKill(e: Enemy): void {
    const s = this.state;
    const def = ENEMY_KINDS[e.kind];
    s.score += e.phase.kind === 'dive' ? def.diveScore : def.score; // FR-S1
    s.particles.push(...createExplosion(e, def.color, PARTICLES.enemyKill, this.rng));
    this.emit({ type: 'sound', id: e.kind === 'boss' ? 'bossKill' : 'enemyKill' });
  }

  private resolvePlayerHits(): void {
    const s = this.state;
    const p = s.player;
    if (!p.alive) return;
    for (const b of s.enemyBullets) {
      if (boxesOverlap(b, p)) {
        b.y = CANVAS.height + 100;
        this.killPlayer();
        break;
      }
    }
    s.enemyBullets = s.enemyBullets.filter((b) => b.y < CANVAS.height + 50);
    if (!p.alive) return;
    for (const e of s.enemies) {
      if (e.phase.kind === 'dive' && boxesOverlap(e, p)) {
        // FR-E8: 충돌한 적은 파괴되고 대형 점수를 준다.
        e.hp = 0;
        s.score += ENEMY_KINDS[e.kind].score;
        s.particles.push(...createExplosion(e, ENEMY_KINDS[e.kind].color, PARTICLES.enemyKill, this.rng));
        this.killPlayer();
        break;
      }
    }
    s.enemies = s.enemies.filter((e) => e.hp > 0);
  }

  // ---------- 내부: 파티클 ----------

  private updateParticles(dt: number): void {
    const s = this.state;
    for (const p of s.particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
    }
    s.particles = s.particles.filter((p) => p.life > 0);
  }
}
