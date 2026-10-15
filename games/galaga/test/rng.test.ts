import { describe, expect, it } from 'vitest';
import { createSeededRng, randomInt } from '../src/rng';

describe('createSeededRng', () => {
  it('같은 시드는 같은 수열을 만든다 (NFR-6)', () => {
    const a = createSeededRng(42);
    const b = createSeededRng(42);
    for (let i = 0; i < 100; i++) expect(a.next()).toBe(b.next());
  });

  it('[0, 1) 범위를 벗어나지 않는다', () => {
    const r = createSeededRng(7);
    for (let i = 0; i < 10_000; i++) {
      const v = r.next();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('randomInt는 [0, max) 정수를 만든다', () => {
    const r = createSeededRng(3);
    for (let i = 0; i < 1000; i++) {
      const v = randomInt(r, 5);
      expect(Number.isInteger(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(5);
    }
  });
});
