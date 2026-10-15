/**
 * 키보드·터치 입력 어댑터(FR-I1~I3). 게임 상태를 직접 바꾸지 않고
 * 연속 입력은 InputState로, 단발 입력은 GameEvent 콜백으로 전달한다.
 */
import type { GameEvent, InputState } from './types';

export interface InputHandlers {
  onEvent(event: GameEvent): void;
  /** 타이틀·게임오버에서 발사/터치가 시작 의사로 해석될 때 */
  onStartIntent(): void;
}

const MOVE_LEFT = new Set(['ArrowLeft', 'KeyA']);
const MOVE_RIGHT = new Set(['ArrowRight', 'KeyD']);
const FIRE = new Set(['Space', 'KeyZ']);
const PAUSE = new Set(['KeyP', 'Escape']);
const PREVENT_DEFAULT = new Set(['Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']);

export class Input {
  readonly state: InputState = { left: false, right: false, fire: false };

  constructor(
    private readonly handlers: InputHandlers,
    private readonly canvas: HTMLCanvasElement,
    touchButtons: { left: HTMLElement; right: HTMLElement; fire: HTMLElement },
  ) {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onBlur);
    this.canvas.addEventListener('pointerdown', () => this.handlers.onStartIntent());
    this.bindTouch(touchButtons.left, 'left');
    this.bindTouch(touchButtons.right, 'right');
    this.bindTouch(touchButtons.fire, 'fire');
  }

  reset(): void {
    this.state.left = this.state.right = this.state.fire = false;
  }

  private onKeyDown = (ev: KeyboardEvent): void => {
    if (PREVENT_DEFAULT.has(ev.code)) ev.preventDefault();
    if (ev.repeat) return;
    if (MOVE_LEFT.has(ev.code)) this.state.left = true;
    if (MOVE_RIGHT.has(ev.code)) this.state.right = true;
    if (FIRE.has(ev.code)) {
      this.state.fire = true;
      this.handlers.onStartIntent();
    }
    if (ev.code === 'Enter') this.handlers.onEvent('START');
    if (PAUSE.has(ev.code)) this.handlers.onEvent('TOGGLE_PAUSE');
  };

  private onKeyUp = (ev: KeyboardEvent): void => {
    if (MOVE_LEFT.has(ev.code)) this.state.left = false;
    if (MOVE_RIGHT.has(ev.code)) this.state.right = false;
    if (FIRE.has(ev.code)) this.state.fire = false;
  };

  private onBlur = (): void => {
    this.reset();
    this.handlers.onEvent('BLUR');
  };

  private bindTouch(el: HTMLElement, key: keyof InputState): void {
    const press = (ev: Event): void => {
      ev.preventDefault();
      this.state[key] = true;
      if (key === 'fire') this.handlers.onStartIntent();
    };
    const release = (ev: Event): void => {
      ev.preventDefault();
      this.state[key] = false;
    };
    el.addEventListener('touchstart', press, { passive: false });
    el.addEventListener('touchend', release);
    el.addEventListener('touchcancel', release);
    el.addEventListener('mousedown', press);
    el.addEventListener('mouseup', release);
    el.addEventListener('mouseleave', release);
  }
}
