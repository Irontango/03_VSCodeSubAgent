import { expect, test as base, type Page } from '@playwright/test';

/** 페이지 오류·콘솔 오류를 모아 테스트 끝에 검사하는 fixture. */
const test = base.extend<{ page: Page; errors: string[] }>({
  errors: async ({ page }, use) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(`console: ${m.text()}`);
    });
    await use(errors);
    expect(errors).toEqual([]);
  },
});

/** 브라우저 안의 게임 상태를 읽는다(main.ts가 window.__galaga로 노출). */
async function screen(page: Page): Promise<string> {
  return page.evaluate(() => window.__galaga?.game.state.screen ?? 'MISSING');
}

/** 캔버스에 배경 이외의 픽셀이 그려졌는지 확인한다. */
async function canvasHasContent(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const c = document.getElementById('game') as HTMLCanvasElement;
    const data = c.getContext('2d')?.getImageData(0, 0, c.width, c.height).data;
    if (!data) return false;
    let lit = 0;
    for (let i = 0; i < data.length; i += 4) if (data[i + 3] !== 0) lit++;
    return lit > 1000;
  });
}

test.beforeEach(async ({ page, errors }) => {
  void errors; // fixture 활성화
  await page.goto('/');
  await expect.poll(() => screen(page)).toBe('TITLE');
});

test('타이틀 → 시작 → 일시정지 → 재개 흐름 (AC-10)', async ({ page }) => {
  expect(await canvasHasContent(page)).toBe(true);

  await page.keyboard.press('Enter');
  await expect.poll(() => screen(page)).toBe('PLAYING');

  await page.keyboard.press('KeyP');
  await expect.poll(() => screen(page)).toBe('PAUSED');

  await page.keyboard.press('KeyP');
  await expect.poll(() => screen(page)).toBe('PLAYING');
});

test('플레이 중 이동과 발사가 상태에 반영된다 (FR-P1, FR-P2)', async ({ page }) => {
  await page.keyboard.press('Enter');
  const x0 = await page.evaluate(() => window.__galaga?.game.state.player.x ?? -1);
  await page.keyboard.down('ArrowLeft');
  await page.waitForTimeout(300);
  await page.keyboard.up('ArrowLeft');
  const x1 = await page.evaluate(() => window.__galaga?.game.state.player.x ?? -1);
  expect(x1).toBeLessThan(x0);

  await page.keyboard.down('Space');
  await page.waitForTimeout(150);
  await page.keyboard.up('Space');
  const shots = await page.evaluate(() => window.__galaga?.game.state.bullets.length ?? -1);
  expect(shots).toBeGreaterThan(0);
  expect(shots).toBeLessThanOrEqual(3);
});

test('창 포커스를 잃으면 자동으로 일시정지된다 (FR-U4)', async ({ page }) => {
  await page.keyboard.press('Enter');
  await expect.poll(() => screen(page)).toBe('PLAYING');
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await expect.poll(() => screen(page)).toBe('PAUSED');
});

test('캔버스를 클릭하면 시작된다 (FR-I3)', async ({ page }) => {
  await page.locator('#game').click();
  await expect.poll(() => screen(page)).toBe('PLAYING');
});

test('게임 오버 시 최고 점수가 저장되고 재시작할 수 있다 (FR-S4, FR-S5)', async ({ page }) => {
  await page.keyboard.press('Enter');
  await page.evaluate(() => {
    const g = window.__galaga?.game;
    if (!g) throw new Error('no game');
    g.state.score = 1234;
    g.state.lives = 0;
    g.state.player.invincible = 0;
    g.state.enemyBullets.push({ x: g.state.player.x, y: g.state.player.y, w: 4, h: 10, vx: 0, vy: 0 });
  });
  await expect.poll(() => screen(page)).toBe('GAMEOVER');
  expect(await page.evaluate(() => localStorage.getItem('galaga_hi'))).toBe('1234');

  await page.keyboard.press('Enter');
  await expect.poll(() => screen(page)).toBe('PLAYING');
  expect(await page.evaluate(() => window.__galaga?.game.state.hiScore)).toBe(1234);
});

test('모바일 뷰포트에서 캔버스가 화면 폭 안에 들어온다 (NFR-3)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const box = await page.locator('#game').boundingBox();
  expect(box).not.toBeNull();
  expect(box && box.width).toBeLessThanOrEqual(390);
  expect(box && box.x).toBeGreaterThanOrEqual(0);
});
