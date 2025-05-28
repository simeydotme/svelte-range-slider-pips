import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const SLIDER_IDS = {
  light: '#slider-light',
  auto: '#slider-auto',
  dark: '#slider-dark'
};

// These are the expected RGB colors from the CSS variables in RangeSlider.svelte
const COLORS = {
  light: {
    slider: 'rgb(215, 218, 218)', // --slider-bg
    handle: 'rgb(153, 162, 162)' // --slider-base
  },
  dark: {
    slider: 'rgb(63, 62, 79)', // --slider-dark-bg
    handle: 'rgb(130, 128, 159)' // --slider-dark-base
  }
};

test.describe('RangeSlider darkmode property', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/range-slider/styles/darkmode');
    await page.waitForLoadState('networkidle');
  });

  test('should apply light mode (darkmode=false)', async ({ page }) => {
    const slider = page.locator(SLIDER_IDS.light);
    const sliderHandle = page.locator(`${SLIDER_IDS.light} .rangeHandle .rangeNub`);
    await expect(slider).not.toHaveClass(/\brsDark\b/);
    await expect(slider).not.toHaveClass(/\brsAutoDark\b/);
    await expect(slider).toHaveCSS('background-color', COLORS.light.slider);
    await expect(sliderHandle).toHaveCSS('background-color', COLORS.light.handle);
  });

  test('should apply forced dark mode (darkmode="force")', async ({ page }) => {
    const slider = page.locator(SLIDER_IDS.dark);
    const sliderHandle = page.locator(`${SLIDER_IDS.dark} .rangeHandle .rangeNub`);
    await expect(slider).toHaveClass(/\brsDark\b/);
    await expect(slider).not.toHaveClass(/\brsAutoDark\b/);
    await expect(slider).toHaveCSS('background-color', COLORS.dark.slider);
    await expect(sliderHandle).toHaveCSS('background-color', COLORS.dark.handle);
  });

  test.describe('darkmode={false} ignores system color scheme', () => {
    for (const scheme of ['light', 'dark'] as const) {
      test(`should always use light colors when system is ${scheme}`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: scheme });
        await page.reload();
        const slider = page.locator('#slider-light');
        const handle = page.locator('#slider-light .rangeHandle .rangeNub');
        await expect(slider).not.toHaveClass(/\brsDark\b/);
        await expect(slider).not.toHaveClass(/\brsAutoDark\b/);
        await expect(slider).toHaveCSS('background-color', COLORS.light.slider);
        await expect(handle).toHaveCSS('background-color', COLORS.light.handle);
      });
    }
  });

  test.describe('darkmode="force" ignores system color scheme', () => {
    for (const scheme of ['light', 'dark'] as const) {
      test(`should always use dark colors when system is ${scheme}`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: scheme });
        await page.reload();
        const slider = page.locator('#slider-dark');
        const handle = page.locator('#slider-dark .rangeHandle .rangeNub');
        await expect(slider).toHaveClass(/\brsDark\b/);
        await expect(slider).not.toHaveClass(/\brsAutoDark\b/);
        await expect(slider).toHaveCSS('background-color', COLORS.dark.slider);
        await expect(handle).toHaveCSS('background-color', COLORS.dark.handle);
      });
    }
  });

  test.describe('darkmode="auto" responds to system color scheme', () => {
    test('should use light colors when system is light', async ({ page, context }) => {
      await context.setExtraHTTPHeaders({ 'Accept-CH': 'Sec-CH-Prefers-Color-Scheme' });
      await page.emulateMedia({ colorScheme: 'light' });
      await page.reload();
      const slider = page.locator(SLIDER_IDS.auto);
      const sliderHandle = page.locator(`${SLIDER_IDS.auto} .rangeHandle .rangeNub`);
      await expect(slider).toHaveClass(/\brsAutoDark\b/);
      await expect(slider).toHaveCSS('background-color', COLORS.light.slider);
      await expect(sliderHandle).toHaveCSS('background-color', COLORS.light.handle);
    });
    test('should use dark colors when system is dark', async ({ page, context }) => {
      await context.setExtraHTTPHeaders({ 'Accept-CH': 'Sec-CH-Prefers-Color-Scheme' });
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.reload();
      const slider = page.locator(SLIDER_IDS.auto);
      const sliderHandle = page.locator(`${SLIDER_IDS.auto} .rangeHandle .rangeNub`);
      await expect(slider).toHaveClass(/\brsAutoDark\b/);
      await expect(slider).toHaveCSS('background-color', COLORS.dark.slider);
      await expect(sliderHandle).toHaveCSS('background-color', COLORS.dark.handle);
    });
  });
});
