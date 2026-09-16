/**
 * Web Audio 기반 효과음 합성(FR-A1, FR-A2). 오디오 미지원 환경에서는 조용히 무시한다(FR-A3).
 */
import type { SoundId } from './types';

interface Tone {
  freq: number;
  dur: number;
  type: OscillatorType;
  vol: number;
  slide?: number;
}

const TONES: Record<SoundId, Tone[]> = {
  shoot: [{ freq: 880, dur: 0.08, type: 'square', vol: 0.05, slide: -300 }],
  enemyHit: [{ freq: 500, dur: 0.06, type: 'square', vol: 0.04 }],
  enemyKill: [{ freq: 220, dur: 0.25, type: 'sawtooth', vol: 0.08, slide: -80 }],
  bossKill: [{ freq: 120, dur: 0.25, type: 'sawtooth', vol: 0.08, slide: -80 }],
  enemyShoot: [{ freq: 300, dur: 0.1, type: 'triangle', vol: 0.04, slide: -100 }],
  playerHit: [{ freq: 200, dur: 0.5, type: 'sawtooth', vol: 0.12, slide: -160 }],
  waveClear: [
    { freq: 660, dur: 0.15, type: 'square', vol: 0.06 },
    { freq: 880, dur: 0.15, type: 'square', vol: 0.06 },
    { freq: 1320, dur: 0.3, type: 'square', vol: 0.06 },
  ],
};

export class Audio {
  private ctx: AudioContext | null = null;
  private available = typeof window !== 'undefined' && 'AudioContext' in window;

  play(id: SoundId): void {
    if (!this.available) return;
    try {
      this.ctx ??= new AudioContext();
      let offset = 0;
      for (const tone of TONES[id]) {
        this.tone(tone, offset);
        offset += tone.dur;
      }
    } catch {
      this.available = false;
    }
  }

  private tone(t: Tone, offset: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const start = ctx.currentTime + offset;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = t.type;
    osc.frequency.setValueAtTime(t.freq, start);
    if (t.slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, t.freq + t.slide), start + t.dur);
    gain.gain.setValueAtTime(t.vol, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + t.dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + t.dur);
  }
}
