/**
 * 난수 생성기 추상화. 도메인은 이 인터페이스만 사용해 결정성을 보장한다(NFR-6).
 */
export interface Rng {
  /** [0, 1) 범위의 실수 */
  next(): number;
}

/** mulberry32: 작고 빠른 시드 기반 생성기. 테스트와 재현에 사용. */
export function createSeededRng(seed: number): Rng {
  let a = seed >>> 0;
  return {
    next() {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
  };
}

/** 런타임 기본 생성기. */
export function createRandomRng(): Rng {
  return { next: () => Math.random() };
}

export function randomRange(rng: Rng, min: number, jitter: number): number {
  return min + rng.next() * jitter;
}

export function randomInt(rng: Rng, maxExclusive: number): number {
  return Math.floor(rng.next() * maxExclusive);
}
