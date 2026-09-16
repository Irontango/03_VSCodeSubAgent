import { defineConfig } from 'vitest/config';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  base: './',
  plugins: [viteSingleFile()],
  build: {
    target: 'es2020',
    outDir: 'dist',
    emptyOutDir: true,
    // 단일 파일 산출물(NFR-1): 모든 자산을 인라인한다.
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
  },
  test: {
    // 규칙 로직은 DOM 없이 실행 가능해야 한다(NFR-5).
    environment: 'node',
    include: ['test/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/main.ts', 'src/renderer.ts', 'src/audio.ts', 'src/input.ts', 'src/storage.ts'],
    },
  },
});
