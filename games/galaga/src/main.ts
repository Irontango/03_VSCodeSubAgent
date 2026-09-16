/**
 * 진입점: 도메인(Game)과 어댑터(Renderer, Audio, Input, Storage)를 연결하고 게임 루프를 돈다.
 */
import { Audio } from './audio';
import { TIMING } from './config';
import { Game } from './game';
import { Input } from './input';
import { Renderer } from './renderer';
import { createRandomRng } from './rng';
import { loadHiScore, saveHiScore } from './storage';
import './style.css';
import type { Effect } from './types';

function $<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`#${id} 요소가 없습니다.`);
  return el as T;
}

const canvas = $<HTMLCanvasElement>('game');
const renderer = new Renderer(canvas);
const audio = new Audio();
const game = new Game({ rng: createRandomRng(), hiScore: loadHiScore() });

const input = new Input(
  {
    onEvent: (event) => applyEffects(game.dispatch(event)),
    onStartIntent: () => {
      const screen = game.state.screen;
      if (screen === 'TITLE' || screen === 'GAMEOVER') applyEffects(game.dispatch('START'));
    },
  },
  canvas,
  { left: $('touch-left'), right: $('touch-right'), fire: $('touch-fire') },
);

function applyEffects(effects: Effect[]): void {
  for (const fx of effects) {
    if (fx.type === 'sound') audio.play(fx.id);
    else if (fx.type === 'saveHiScore') saveHiScore(fx.value);
  }
}

// 디버그 오버레이: URL에 ?debug 가 있거나 ` 키로 토글
let debug = new URLSearchParams(location.search).has('debug');
window.addEventListener('keydown', (ev) => {
  if (ev.code === 'Backquote') debug = !debug;
});

let last = performance.now();
let fpsAccum = 0;
let fpsFrames = 0;
let fps = 0;

function loop(now: number): void {
  const dt = Math.min(TIMING.maxDt, (now - last) / 1000);
  last = now;

  applyEffects(game.update(dt, input.state));
  renderer.updateBackground(dt, game.state.screen === 'PLAYING');
  renderer.render(game.state);

  fpsAccum += dt;
  fpsFrames += 1;
  if (fpsAccum >= 0.5) {
    fps = Math.round(fpsFrames / fpsAccum);
    fpsAccum = 0;
    fpsFrames = 0;
  }
  if (debug) {
    const s = game.state;
    renderer.drawDebug([
      `fps ${fps}`,
      `screen ${s.screen}`,
      `enemies ${s.enemies.length}`,
      `bullets ${s.bullets.length}/${s.enemyBullets.length}`,
      `particles ${s.particles.length}`,
    ]);
  }
  requestAnimationFrame(loop);
}

// E2E 테스트가 상태를 읽을 수 있도록 노출한다(읽기 전용 용도).
declare global {
  interface Window {
    __galaga?: { game: Game };
  }
}
window.__galaga = { game };

requestAnimationFrame(loop);
