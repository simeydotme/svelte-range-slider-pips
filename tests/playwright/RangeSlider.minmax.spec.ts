import { expect, test } from '@playwright/test';
import { dragHandleTo } from './helpers/tools.js';

test.describe('Min/Max Tests', () => {
  test('custom min/max values', async ({ page }) => {
    await page.goto('/test/range-slider/minmax/custom-min-max');
    await page.waitForLoadState('networkidle');
    const handle = page.locator('.rangeHandle');

    await expect(handle).toHaveAttribute('aria-valuemin', '-50');
    await expect(handle).toHaveAttribute('aria-valuemax', '50');
    await expect(handle).toHaveAttribute('aria-valuenow', '0');
    await expect(handle, 'to be positioned at 50%').toHaveCSS('left', '500px');
  });

  test('negative min/max', async ({ page }) => {
    await page.goto('/test/range-slider/minmax/negative-min-max');
    await page.waitForLoadState('networkidle');
    const handle = page.locator('.rangeHandle');

    await expect(handle).toHaveAttribute('aria-valuemin', '-100');
    await expect(handle).toHaveAttribute('aria-valuemax', '-50');
    await expect(handle).toHaveAttribute('aria-valuenow', '-75');
    await expect(handle, 'to be positioned at 50%').toHaveCSS('left', '500px');
  });

  test('decimal min/max', async ({ page }) => {
    await page.goto('/test/range-slider/minmax/decimal-min-max');
    await page.waitForLoadState('networkidle');
    const handle = page.locator('.rangeHandle');

    await expect(handle).toHaveAttribute('aria-valuemin', '0.5');
    await expect(handle).toHaveAttribute('aria-valuemax', '2.5');
    await expect(handle).toHaveAttribute('aria-valuenow', '1.5');
    await expect(handle, 'to be positioned at 50%').toHaveCSS('left', '500px');
  });

  test('explicit value within min/max', async ({ page }) => {
    await page.goto('/test/range-slider/minmax/explicit-value');
    await page.waitForLoadState('networkidle');
    const handle = page.locator('.rangeHandle');

    await expect(handle).toHaveAttribute('aria-valuemin', '0');
    await expect(handle).toHaveAttribute('aria-valuemax', '200');
    await expect(handle).toHaveAttribute('aria-valuenow', '90');
    await expect(handle, 'to be positioned at 45%').toHaveCSS('left', '450px');
  });

  test('invalid min/max resets to default', async ({ page }) => {
    await page.goto('/test/range-slider/minmax/invalid-min-max');
    await page.waitForLoadState('networkidle');
    const handle = page.locator('.rangeHandle');

    await expect(handle).toHaveAttribute('aria-valuemin', '0');
    await expect(handle).toHaveAttribute('aria-valuemax', '100');
    await expect(handle).toHaveAttribute('aria-valuenow', '50');
    await expect(handle, 'to be positioned at 50%').toHaveCSS('left', '500px');
  });

  test('dragging handle below min value', async ({ page }) => {
    await page.goto('/test/range-slider/minmax/custom-min-max');
    await page.waitForLoadState('networkidle');
    const handle = page.locator('.rangeHandle');
    const slider = page.locator('.rangeSlider');

    // Get the slider dimensions
    const sliderBox = await slider.boundingBox();
    if (!sliderBox) throw new Error('Could not get slider dimensions');

    // Drag handle to the far left (beyond min)
    await dragHandleTo(page, slider, handle, -100);

    // Verify the handle is clamped to min value
    await expect(handle).toHaveAttribute('aria-valuenow', '-50');
    await expect(handle, 'to be positioned at 0%').toHaveCSS('left', '0px');
  });

  test('dragging handle above max value', async ({ page }) => {
    await page.goto('/test/range-slider/minmax/custom-min-max');
    await page.waitForLoadState('networkidle');
    const handle = page.locator('.rangeHandle');
    const slider = page.locator('.rangeSlider');

    // Get the slider dimensions
    const sliderBox = await slider.boundingBox();
    if (!sliderBox) throw new Error('Could not get slider dimensions');

    // Drag handle to the far right (beyond max)
    await dragHandleTo(page, slider, handle, 2000);

    // Verify the handle is clamped to max value
    await expect(handle).toHaveAttribute('aria-valuenow', '50');
    await expect(handle, 'to be positioned at 100%').toHaveCSS('left', '1000px');
  });

  test('dragging handle with negative min/max', async ({ page }) => {
    await page.goto('/test/range-slider/minmax/negative-min-max');
    await page.waitForLoadState('networkidle');
    const handle = page.locator('.rangeHandle');
    const slider = page.locator('.rangeSlider');

    // Get the slider dimensions
    const sliderBox = await slider.boundingBox();
    if (!sliderBox) throw new Error('Could not get slider dimensions');

    // Drag handle to the far left (beyond min)
    await dragHandleTo(page, slider, handle, -100);

    // Verify the handle is clamped to min value
    await expect(handle).toHaveAttribute('aria-valuenow', '-100');
    await expect(handle, 'to be positioned at 0%').toHaveCSS('left', '0px');

    // Drag handle to the far right (beyond max)
    await dragHandleTo(page, slider, handle, 2000);

    // Verify the handle is clamped to max value
    await expect(handle).toHaveAttribute('aria-valuenow', '-50');
    await expect(handle, 'to be positioned at 100%').toHaveCSS('left', '1000px');
  });
});
