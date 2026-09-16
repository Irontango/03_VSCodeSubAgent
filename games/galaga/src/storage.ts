/**
 * 최고 점수 영속화(FR-S4). localStorage 접근 실패는 조용히 무시한다.
 */
import { STORAGE_KEY } from './config';

export function loadHiScore(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const n = raw === null ? 0 : Number(raw);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

export function saveHiScore(value: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    /* 프라이빗 모드 등: 저장 불가 */
  }
}
