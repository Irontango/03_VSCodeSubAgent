/**
 * Canvas 2D 렌더러. GameState를 읽기만 하고 절대 바꾸지 않는다(ADR-0002).
 * 배경 별은 순수 연출이므로 렌더러가 소유한다(FR-U6).
 */
import { CANVAS, ENEMY_KINDS } from './config';
import type { Enemy, EnemyKind, GameState } from './types';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
}

const FONT = '"Courier New", Courier, monospace';
const STAR_COUNT = 90;

export class Renderer {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly stars: Star[] = [];

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D 컨텍스트를 만들 수 없습니다.');
    this.ctx = ctx;
    canvas.width = CANVAS.width;
    canvas.height = CANVAS.height;
    for (let i = 0; i < STAR_COUNT; i++) {
      this.stars.push({
        x: Math.random() * CANVAS.width,
        y: Math.random() * CANVAS.height,
        size: Math.random() * 1.6 + 0.4,
        speed: Math.random() * 40 + 20,
      });
    }
  }

  /** 별 배경 진행. 플레이 중이 아니면 감속한다. */
  updateBackground(dt: number, playing: boolean): void {
    const factor = playing ? 1 : 0.3;
    for (const s of this.stars) {
      s.y += s.speed * dt * factor;
      if (s.y > CANVAS.height) {
        s.y = 0;
        s.x = Math.random() * CANVAS.width;
      }
    }
  }

  render(state: Readonly<GameState>): void {
    const ctx = this.ctx;
    const W = CANVAS.width;
    const H = CANVAS.height;
    ctx.clearRect(0, 0, W, H);
    this.drawStars();
    this.drawParticles(state);

    if (state.screen === 'TITLE') {
      this.drawTitle(state);
      return;
    }

    for (const e of state.enemies) this.drawEnemy(e);
    ctx.fillStyle = '#ffffff';
    for (const b of state.bullets) ctx.fillRect(b.x - 1.5, b.y - 6, 3, 12);
    ctx.fillStyle = '#ff6a8a';
    for (const b of state.enemyBullets) ctx.fillRect(b.x - 2, b.y - 5, 4, 10);

    const p = state.player;
    const blinkVisible = p.invincible <= 0 || Math.floor(p.invincible * 12) % 2 === 0; // FR-P5
    if (p.alive && blinkVisible) this.drawPlayer(p.x, p.y);

    this.drawHud(state);

    if (state.screen === 'PAUSED') {
      this.dim(0.55);
      this.text('PAUSED', W / 2, H / 2, 32, '#ffd24c');
      this.text('P 키로 계속', W / 2, H / 2 + 34, 14);
    } else if (state.screen === 'WAVE_CLEAR') {
      this.text(`WAVE ${state.wave} CLEAR!`, W / 2, H / 2 - 10, 28, '#4cff6a');
      this.text('다음 웨이브 준비 중...', W / 2, H / 2 + 24, 14);
    } else if (state.screen === 'GAMEOVER') {
      this.dim(0.6);
      this.text('GAME OVER', W / 2, H / 2 - 20, 36, '#ff4c6a');
      this.text(`SCORE  ${pad(state.score)}`, W / 2, H / 2 + 22, 16);
      if (state.score >= state.hiScore && state.score > 0)
        this.text('NEW HI-SCORE!', W / 2, H / 2 + 46, 14, '#ffd24c');
      this.text('ENTER 로 재시작', W / 2, H / 2 + 80, 14, '#99a');
    }
  }

  // ---------- 화면 조각 ----------

  private drawTitle(state: Readonly<GameState>): void {
    const W = CANVAS.width;
    const H = CANVAS.height;
    this.text('GALAGA', W / 2, H * 0.33, 52, '#ffd24c');
    this.text('갤 러 그', W / 2, H * 0.33 + 44, 22, '#4cb8ff');
    this.text('ENTER 또는 SPACE 를 눌러 시작', W / 2, H * 0.58, 15);
    this.text('← → 이동   SPACE 발사', W / 2, H * 0.58 + 26, 13, '#99a');
    this.text(`HI-SCORE  ${pad(state.hiScore)}`, W / 2, H * 0.78, 14, '#ff4c6a');
    const y = H * 0.86;
    const table: Array<[EnemyKind, number]> = [
      ['boss', -90],
      ['butterfly', -10],
      ['bee', 60],
    ];
    for (const [kind, dx] of table) {
      this.drawEnemySprite(kind, W / 2 + dx, y, 0, ENEMY_KINDS[kind].hp);
      this.text(String(ENEMY_KINDS[kind].score), W / 2 + dx + 30, y, 12, '#99a', 'left');
    }
  }

  private drawHud(state: Readonly<GameState>): void {
    const W = CANVAS.width;
    this.text('1UP', 16, 14, 13, '#ff4c6a', 'left');
    this.text(pad(state.score), 16, 32, 15, '#fff', 'left');
    this.text('HI-SCORE', W / 2, 14, 13, '#ff4c6a');
    this.text(pad(Math.max(state.hiScore, state.score)), W / 2, 32, 15, '#fff');
    this.text(`WAVE ${state.wave}`, W - 16, 14, 13, '#4cb8ff', 'right');
    for (let i = 0; i < state.lives; i++) {
      this.ctx.save();
      this.ctx.scale(0.6, 0.6);
      this.drawPlayer((W - 20 - i * 24) / 0.6, 36 / 0.6);
      this.ctx.restore();
    }
  }

  private drawStars(): void {
    const ctx = this.ctx;
    for (const s of this.stars) {
      ctx.fillStyle = s.size > 1.4 ? '#bcd0ff' : '#5a6a99';
      ctx.fillRect(s.x, s.y, s.size, s.size);
    }
  }

  private drawParticles(state: Readonly<GameState>): void {
    const ctx = this.ctx;
    for (const p of state.particles) {
      ctx.globalAlpha = Math.max(0, p.life / 0.9);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
    }
    ctx.globalAlpha = 1;
  }

  private drawPlayer(x: number, y: number): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-2, -14, 4, 8);
    ctx.fillRect(-6, -8, 12, 10);
    ctx.fillRect(-14, 0, 28, 6);
    ctx.fillRect(-12, 6, 6, 4);
    ctx.fillRect(6, 6, 6, 4);
    ctx.fillStyle = '#ff3b3b';
    ctx.fillRect(-14, -2, 4, 4);
    ctx.fillRect(10, -2, 4, 4);
    ctx.fillStyle = '#4cb8ff';
    ctx.fillRect(-2, -6, 4, 4);
    ctx.restore();
  }

  private drawEnemy(e: Enemy): void {
    this.drawEnemySprite(e.kind, e.x, e.y, e.wobble, e.hp);
  }

  private drawEnemySprite(kind: EnemyKind, x: number, y: number, wobble: number, hp: number): void {
    const ctx = this.ctx;
    const def = ENEMY_KINDS[kind];
    const flap = Math.sin(wobble) > 0 ? 1 : 0;
    ctx.save();
    ctx.translate(x, y);
    if (kind === 'boss') {
      ctx.fillStyle = def.color2;
      ctx.fillRect(-12, -4, 24, 10);
      ctx.fillStyle = def.color;
      ctx.fillRect(-6, -10, 12, 8);
      ctx.fillRect(-14 - flap * 2, -2, 5, 8);
      ctx.fillRect(9 + flap * 2, -2, 5, 8);
      ctx.fillStyle = '#ffd24c';
      ctx.fillRect(-4, -8, 3, 3);
      ctx.fillRect(1, -8, 3, 3);
      if (hp === 1) {
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.fillRect(-12, -10, 24, 16);
      }
    } else if (kind === 'butterfly') {
      ctx.fillStyle = def.color;
      ctx.fillRect(-3, -9, 6, 18);
      ctx.fillRect(-12, -6 + flap * 2, 9, 8);
      ctx.fillRect(3, -6 + flap * 2, 9, 8);
      ctx.fillStyle = def.color2;
      ctx.fillRect(-12, 2 + flap * 2, 5, 5);
      ctx.fillRect(7, 2 + flap * 2, 5, 5);
      ctx.fillStyle = '#ffd24c';
      ctx.fillRect(-2, -8, 4, 3);
    } else {
      ctx.fillStyle = def.color;
      ctx.fillRect(-4, -8, 8, 16);
      ctx.fillRect(-11, -3 - flap * 2, 7, 6);
      ctx.fillRect(4, -3 - flap * 2, 7, 6);
      ctx.fillStyle = '#ffd24c';
      ctx.fillRect(-4, -2, 8, 3);
      ctx.fillRect(-4, 4, 8, 2);
      ctx.fillStyle = def.color2;
      ctx.fillRect(-3, -7, 2, 2);
      ctx.fillRect(1, -7, 2, 2);
    }
    ctx.restore();
  }

  private dim(alpha: number): void {
    this.ctx.fillStyle = `rgba(0,0,0,${alpha})`;
    this.ctx.fillRect(0, 0, CANVAS.width, CANVAS.height);
  }

  private text(
    txt: string,
    x: number,
    y: number,
    size = 16,
    color = '#e8e8ff',
    align: CanvasTextAlign = 'center',
  ): void {
    const ctx = this.ctx;
    ctx.fillStyle = color;
    ctx.font = `bold ${size}px ${FONT}`;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.fillText(txt, x, y);
  }

  /** 디버그 오버레이(NFR-4 확인용). */
  drawDebug(lines: string[]): void {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(4, CANVAS.height - 14 * lines.length - 8, 150, 14 * lines.length + 6);
    lines.forEach((l, i) => this.text(l, 8, CANVAS.height - 14 * (lines.length - i) + 2, 11, '#9f9', 'left'));
  }
}

function pad(n: number): string {
  return String(n).padStart(6, '0');
}
