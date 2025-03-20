import { expect, test } from '@playwright/test';

test.describe('Reversed Slider Tests', () => {
  test.describe('single handle', () => {
    test('should render correctly with default min/max', async ({ page }) => {
      await page.goto('/test/range-slider/states/reversed');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('.rangeSlider').nth(0);
      const handle = slider.getByRole('slider');

      // Check component exists
      await expect(slider).toBeAttached();
      await expect(handle).toBeAttached();
      await expect(slider).toHaveClass(/\brsReversed\b/);

      // Value of 75 on reversed slider should position from right
      await expect(handle).toHaveAttribute('aria-valuenow', '75');
      await expect(handle).toHaveCSS('right', '750px');
    });

    test('should handle custom min/max values', async ({ page }) => {
      await page.goto('/test/range-slider/states/reversed');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('.rangeSlider').nth(1);
      const handle = slider.getByRole('slider');

      // Check min/max/value
      await expect(handle).toHaveAttribute('aria-valuemin', '-100');
      await expect(handle).toHaveAttribute('aria-valuemax', '150');
      await expect(handle).toHaveAttribute('aria-valuenow', '125');

      // 125 on -100 to 150 range is 90% from right
      await expect(handle).toHaveCSS('right', '900px');
    });

    test('should handle mouse interactions correctly', async ({ page }) => {
      await page.goto('/test/range-slider/states/reversed');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('.rangeSlider').nth(0);
      const handle = slider.getByRole('slider');

      await slider.isVisible();
      const sliderBounds = await slider.boundingBox();
      if (!sliderBounds) throw new Error('Could not get slider bounds');

      // Click at 10% from left should set value to 90
      await page.mouse.click(
        sliderBounds.x + sliderBounds.width * 0.1, // Click at 10% from left
        sliderBounds.y + sliderBounds.height / 2
      );
      // Verify the handle and input value
      await expect(handle).toHaveAttribute('aria-valuenow', '90');
      await expect(handle).toHaveCSS('right', '900px');
    });
  });

  test.describe('range slider', () => {
    test('should render correctly with two handles', async ({ page }) => {
      await page.goto('/test/range-slider/states/reversed');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('.rangeSlider').nth(2);
      const handles = slider.locator('.rangeHandle');

      await slider.isVisible();

      // First handle should be at 25% from right
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '0');
      await expect(handles.nth(0)).toHaveCSS('right', '0px');
      // Second handle should be at 75% from right
      await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '100');
      await expect(handles.nth(1)).toHaveCSS('right', '1000px');
      // Range bar should span between handles
      const rangeBar = page.locator('.rangeBar');
      await expect(rangeBar).toHaveCSS('right', '0px');
      await expect(rangeBar).toHaveCSS('left', '0px');
    });

    test('click at 10% should move the second handle to 90', async ({ page }) => {
      await page.goto('/test/range-slider/states/reversed');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('.rangeSlider').nth(2);
      const handles = slider.locator('.rangeHandle');

      await slider.isVisible();

      // First handle should be at 25% from right
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '0');
      await expect(handles.nth(0)).toHaveCSS('right', '0px');
      // Second handle should be at 75% from right
      await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '100');
      await expect(handles.nth(1)).toHaveCSS('right', '1000px');

      // First handle should not be able to go beyond second handle
      const sliderBounds = await slider.boundingBox();
      if (!sliderBounds) throw new Error('Could not get slider bounds');

      // click at 10% should move the second handle to 90
      await page.mouse.click(sliderBounds.x + sliderBounds.width * 0.1, sliderBounds.y + sliderBounds.height / 2);

      // click at 90% should move the first handle to 10
      await page.mouse.click(sliderBounds.x + sliderBounds.width * 0.9, sliderBounds.y + sliderBounds.height / 2);

      // Handles should maintain their order
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '10');
      await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '90');
      await expect(handles.nth(0)).toHaveCSS('right', '100px');
      await expect(handles.nth(1)).toHaveCSS('right', '900px');
    });
  });

  test.describe('keyboard interaction', () => {
    test('should handle arrow keys correctly in reversed mode', async ({ page }) => {
      await page.goto('/test/range-slider/states/reversed');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('.rangeSlider').nth(0);
      const handle = slider.getByRole('slider');

      // Initial value is 75
      await expect(handle).toHaveAttribute('aria-valuenow', '75');

      // arrow keys should be unaffected in reversed mode
      await handle.focus();
      await page.keyboard.press('ArrowRight');
      await expect(handle).toHaveAttribute('aria-valuenow', '76');

      // Left arrow should increase value in reversed mode
      await handle.focus();
      await page.keyboard.press('ArrowLeft');
      await page.keyboard.press('ArrowLeft');
      await expect(handle).toHaveAttribute('aria-valuenow', '74');
    });

    test('should handle arrow keys correctly in reversed range mode', async ({ page }) => {
      await page.goto('/test/range-slider/states/reversed');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('.rangeSlider').nth(2);
      const handles = slider.getByRole('slider');

      // Initial values are 0 and 100
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '0');
      await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '100');

      // First handle: right arrow should decrease value in reversed mode
      await handles.nth(0).focus();
      await page.keyboard.press('ArrowRight');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '1');

      // First handle: left arrow should not allow value to go below 0
      await handles.nth(0).focus();
      await page.keyboard.press('ArrowLeft');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '0');
      for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowRight');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '5');

      // Second handle: right arrow should not allow value to go above 100
      await handles.nth(1).focus();
      await page.keyboard.press('ArrowRight');
      await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '100');
      for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowLeft');
      await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '95');

      // Second handle: left arrow should decrease value but not below first handle
      await handles.nth(1).focus();
      for (let i = 0; i < 100; i++) await page.keyboard.press('ArrowLeft');
      await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '5');
    });
  });
});
