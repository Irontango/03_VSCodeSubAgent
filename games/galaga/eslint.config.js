import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist/', 'node_modules/', 'playwright-report/', 'test-results/', 'coverage/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    rules: {
      // 상태에 따라 있거나 없는 필드는 타입으로 표현한다(ADR-0003).
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    // 도메인 계층은 브라우저 API를 사용하지 않는다(ADR-0002).
    files: ['src/game.ts', 'src/entities.ts', 'src/config.ts', 'src/rng.ts', 'src/types.ts'],
    rules: {
      'no-restricted-globals': [
        'error',
        'window',
        'document',
        'localStorage',
        'requestAnimationFrame',
        'AudioContext',
      ],
    },
  },
);
