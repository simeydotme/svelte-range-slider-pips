import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

async function getAriaNow(page: Page, slider: Locator) {
  const handle = slider.locator('.rangeHandle').first();
  await expect(handle).toBeVisible();
  const now = await handle.getAttribute('aria-valuenow');
  return parseInt(now || '0', 10);
}

test.describe('Keyboard movement: normal, reversed, disabled', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/range-slider/keyboard');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Normal (not reversed, enabled)', () => {
    test('ArrowLeft/ArrowRight move by step', async ({ page }) => {
      const slider = page.locator('#keyboard-slider');
      const handle = slider.locator('.rangeHandle').first();
      await handle.focus();
      const start = await getAriaNow(page, slider);

      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');
      const afterRight = await getAriaNow(page, slider);
      expect(afterRight).toBe(start + 2);

      await page.keyboard.press('ArrowLeft');
      await page.keyboard.press('ArrowLeft');
      await page.keyboard.press('ArrowLeft');
      const afterLeft = await getAriaNow(page, slider);
      expect(afterLeft).toBe(start - 1);
    });

    test('Shift+Arrow moves by ~10%', async ({ page }) => {
      const slider = page.locator('#keyboard-slider');
      const handle = slider.locator('.rangeHandle').first();
      await handle.focus();
      const start = await getAriaNow(page, slider);

      await page.keyboard.press('Shift+ArrowRight');
      const afterRight = await getAriaNow(page, slider);
      expect(afterRight).toBe(start + 10);

      await page.keyboard.press('Shift+ArrowLeft');
      await page.keyboard.press('Shift+ArrowLeft');
      const afterLeft = await getAriaNow(page, slider);
      expect(afterLeft).toBe(start - 10);
    });

    test('Ctrl+Arrow moves by ~1%', async ({ page }) => {
      const slider = page.locator('#keyboard-slider');
      const handle = slider.locator('.rangeHandle').first();
      await handle.focus();
      const start = await getAriaNow(page, slider);

      await page.keyboard.press('Control+ArrowRight');
      const afterRight = await getAriaNow(page, slider);
      expect(afterRight).toBe(start + 1);

      await page.keyboard.press('Control+ArrowLeft');
      await page.keyboard.press('Control+ArrowLeft');
      const afterLeft = await getAriaNow(page, slider);
      expect(afterLeft).toBe(start - 1);
    });

    test('PageUp/PageDown map to Shift increments', async ({ page }) => {
      const slider = page.locator('#keyboard-slider');
      const handle = slider.locator('.rangeHandle').first();
      await handle.focus();
      const start = await getAriaNow(page, slider);

      const before = await getAriaNow(page, slider);
      await page.keyboard.press('PageUp');
      const up = await getAriaNow(page, slider);
      expect(up).toBe(start + 10);

      await page.keyboard.press('PageDown');
      await page.keyboard.press('PageDown');
      const down = await getAriaNow(page, slider);
      expect(down).toBe(start - 10);
    });

    test('Home/End go to min/max', async ({ page }) => {
      const slider = page.locator('#keyboard-slider');
      const handle = slider.locator('.rangeHandle').first();
      await handle.focus();

      await page.keyboard.press('Home');
      const atMin = await getAriaNow(page, slider);
      expect(atMin).toBe(0);

      await page.keyboard.press('End');
      const atMax = await getAriaNow(page, slider);
      expect(atMax).toBe(100);
    });
  });

  test.describe('Reversed (enabled)', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByLabel('Reversed').check();
    });

    test('ArrowLeft/ArrowRight invert direction', async ({ page }) => {
      const slider = page.locator('#keyboard-slider');
      const handle = slider.locator('.rangeHandle').first();
      await handle.focus();
      const start = await getAriaNow(page, slider);

      await page.keyboard.press('ArrowRight');
      const afterRight = await getAriaNow(page, slider);
      // In reversed, ArrowRight should still increase, but move left
      expect(afterRight).toBe(start + 1);

      await page.keyboard.press('ArrowLeft');
      await page.keyboard.press('ArrowLeft');
      const afterLeft = await getAriaNow(page, slider);
      // In reversed, ArrowLeft should still decrease, but move right
      expect(afterLeft).toBe(start - 1);
    });

    test('Home/End go to min/max (reversed direction)', async ({ page }) => {
      const slider = page.locator('#keyboard-slider');
      const handle = slider.locator('.rangeHandle').first();
      await handle.focus();

      await page.keyboard.press('Home');
      const afterHome = await getAriaNow(page, slider);
      expect(afterHome).toBe(0);

      await page.keyboard.press('End');
      const afterEnd = await getAriaNow(page, slider);
      expect(afterEnd).toBe(100);
    });
  });

  test.describe('Disabled', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByLabel('Disabled').check();
    });

    test('No movement or events on any key', async ({ page }) => {
      const slider = page.locator('#keyboard-slider');
      const handle = slider.locator('.rangeHandle').first();
      const eventHistory = page.locator('.event-history');
      const start = await getAriaNow(page, slider);
      await handle.focus();
      const keys = [
        'ArrowLeft',
        'ArrowRight',
        'Shift+ArrowLeft',
        'Shift+ArrowRight',
        'Control+ArrowLeft',
        'Control+ArrowRight',
        'PageUp',
        'PageDown',
        'Home',
        'End'
      ];
      for (const key of keys) {
        await page.keyboard.press(key);
      }
      const end = await getAriaNow(page, slider);
      expect(end).toBe(start);
      await expect(eventHistory.locator('.event-detail')).toHaveCount(0);
    });
  });
});
