import { expect, test } from './helpers/assertions.js';
import { springSettleTime, waitTime } from './utils.js';

test.describe('Interactions', () => {

  test('has focus when clicked', async ({ page }) => {
    await page.goto('/test/range-slider/values/single-value');
    await page.waitForLoadState('networkidle');
    const slider = page.locator('.rangeSlider').nth(0);
    const handle = slider.getByRole('slider');

    await slider.isVisible();
    await handle.isVisible();
    await handle.focus();
    await expect(slider).toHaveClass(/\bfocus\b/);
    await expect(handle).toHaveClass(/\bactive\b/);
  });

  test('should handle mouse interactions correctly', async ({ page }) => {
    await page.goto('/test/range-slider/values/single-value');
    await page.waitForLoadState('networkidle');
    const slider = page.locator('.rangeSlider').nth(0);
    const handle = slider.getByRole('slider');

    await slider.isVisible();
    const sliderBounds = await slider.boundingBox();
    if (!sliderBounds) throw new Error('Could not get slider bounds');

    await page.mouse.click(
      sliderBounds.x + sliderBounds.width * 0.1, // Click at 10% from left
      sliderBounds.y + sliderBounds.height / 2
    );

    await expect(handle).toHaveAttribute('aria-valuenow', '10');
    await expect(handle).toHaveCSS('left', '100px');
  });

  test('should handle drag operations', async ({ page }) => {
    await page.goto('/test/range-slider/values/binding/single');
    await page.waitForLoadState('networkidle');
    const slider = page.locator('.rangeSlider').nth(0);
    const handle = slider.getByRole('slider');
    const input = page.getByLabel('Current value:');

    await slider.isVisible();
    const sliderBounds = await slider.boundingBox();
    if (!sliderBounds) throw new Error('Could not get slider bounds');

    // Start drag from center (50%)
    await page.mouse.move(sliderBounds.x + sliderBounds.width * 0.5, sliderBounds.y + sliderBounds.height / 2);
    await page.mouse.down();
    // Drag to 75%
    await page.mouse.move(sliderBounds.x + sliderBounds.width * 0.75, sliderBounds.y + sliderBounds.height / 2);
    await page.mouse.up();

    // Verify the handle and input value
    await expect(handle).toHaveCSS('left', '750px');
    await expect(input).toHaveValue('75');
  });
});
