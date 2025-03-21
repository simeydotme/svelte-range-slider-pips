import { expect, test } from '@playwright/test';
import { dragHandleTo } from './helpers/tools.js';

test.describe('Interactions', () => {
  test('has focus when clicked', async ({ page }) => {
    await page.goto('/test/range-slider/values/single-value');
    await page.waitForLoadState('networkidle');
    const slider = page.locator('.rangeSlider').nth(0);
    const handle = slider.getByRole('slider');

    await slider.isVisible();
    await handle.isVisible();
    await handle.focus();
    await expect(slider).toHaveClass(/\brsFocus\b/);
    await expect(handle).toHaveClass(/\brsActive\b/);
  });

  test('should handle mouse clicks on range', async ({ page }) => {
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
    await expect(handle, 'to be positioned at 10%').toHaveCSS('translate', '100px');
  });

  test('should handle drag handle operations', async ({ page }) => {
    await page.goto('/test/range-slider/values/binding/single');
    await page.waitForLoadState('networkidle');
    const slider = page.locator('.rangeSlider').nth(0);
    const handle = slider.getByRole('slider');
    const input = page.getByLabel('Current value:');

    await slider.isVisible();
    const sliderBounds = await slider.boundingBox();
    if (!sliderBounds) throw new Error('Could not get slider bounds');

    // Drag the handle to 75%
    await dragHandleTo(page, slider, handle, 0.75);

    // Verify the handle and input value
    await expect(handle).toHaveAttribute('aria-valuenow', '75');
    await expect(handle, 'to be positioned at 75%').toHaveCSS('translate', '750px');
    await expect(input).toHaveValue('75');
  });

  test('should update handle position when dragging', async ({ page }) => {
    await page.goto('/test/range-slider/values/binding/single');
    await page.waitForLoadState('networkidle');
    const slider = page.locator('.rangeSlider').nth(0);
    const handle = slider.getByRole('slider');
    const input = page.getByLabel('Current value:');

    await slider.isVisible();
    const sliderBounds = await slider.boundingBox();
    if (!sliderBounds) throw new Error('Could not get slider bounds');

    // Drag the handle to 50%
    await dragHandleTo(page, slider, handle, 0.5);

    // Verify the handle and input value
    await expect(handle).toHaveAttribute('aria-valuenow', '50');
    await expect(handle, 'to be positioned at 50%').toHaveCSS('translate', '500px');
    await expect(input).toHaveValue('50');
  });
});
