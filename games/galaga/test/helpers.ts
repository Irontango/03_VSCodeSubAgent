import { Game } from '../src/game';
import { createSeededRng } from '../src/rng';
import type { Enemy, InputState } from '../src/types';

export const STEP = 1 / 60;

export function newGame(seed = 1, hiScore = 0): Game {
  return new Game({ rng: createSeededRng(seed), hiScore });
}

export function startedGame(seed = 1, hiScore = 0): Game {
  const g = newGame(seed, hiScore);
  g.dispatch('START');
  return g;
}

/** seconds 동안 STEP 간격으로 진행. 반환값은 발생한 효과 목록. */
export function advance(game: Game, seconds: number, input?: Partial<InputState>) {
  const inp: InputState = { left: false, right: false, fire: false, ...input };
  const effects = [];
  const steps = Math.round(seconds / STEP);
  for (let i = 0; i < steps; i++) effects.push(...game.update(STEP, inp));
  return effects;
}

/** 모든 적을 대형에 배치한 상태로 만든다(진입 연출 생략). */
export function settleFormation(game: Game): void {
  for (const e of game.state.enemies) {
    e.phase = { kind: 'formation' };
    e.x = e.fx;
    e.y = e.fy;
  }
}

export function killAllEnemies(game: Game): void {
  game.state.enemies = [];
}

export function firstEnemyOfKind(game: Game, kind: Enemy['kind']): Enemy {
  const e = game.state.enemies.find((x) => x.kind === kind);
  if (!e) throw new Error(`no enemy of kind ${kind}`);
  return e;
}
