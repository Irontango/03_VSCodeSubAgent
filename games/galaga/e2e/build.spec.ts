import { expect, test } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist', import.meta.url));

test('빌드 산출물은 index.html 하나이고 외부 자원을 참조하지 않는다 (AC-11, NFR-1)', () => {
  expect(readdirSync(DIST)).toEqual(['index.html']);
  const html = readFileSync(join(DIST, 'index.html'), 'utf8');
  expect(html).not.toMatch(/<script[^>]+src=/);
  expect(html).not.toMatch(/<link[^>]+href=/);
  expect(html).not.toMatch(/https?:\/\//);
});
