import { expect, test } from './helpers/assertions.js';

test.describe('Basic Tests', () => {
  test.describe('no props', () => {
    test('should render correctly', async ({ page }) => {
      await page.goto('/test/range-slider/base');
      await page.waitForLoadState('networkidle');

      // Check component exists
      await expect(page.locator('.rangeSlider')).toBeVisible();
      await expect(page.locator('.rangeHandle')).toBeVisible();
      await expect(page.locator('.rangeNub')).toBeVisible();
    });

    test('should have correct attributes', async ({ page }) => {
      await page.goto('/test/range-slider/base');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('.rangeSlider');
      const handle = page.locator('.rangeHandle');

      // Check role
      await expect(slider).toHaveAttribute('role', 'none');
      await expect(handle).toHaveAttribute('role', 'slider');

      // Check min/max/value
      await expect(handle, 'to have min of 0').toHaveAttribute('aria-valuemin', '0');
      await expect(handle, 'to have max of 100').toHaveAttribute('aria-valuemax', '100');
      await expect(handle, 'to have value of 50').toHaveAttribute('aria-valuenow', '50');
      await expect(handle, 'to have value of 50').toHaveAttribute('aria-valuetext', '50');
      await expect(handle, 'to be positioned at 50%').toHaveCSS('left', '500px');

      // Check orientation and disabled state
      await expect(handle).toHaveAttribute('data-handle', '0');
      await expect(handle).toHaveAttribute('aria-orientation', 'horizontal');
      await expect(handle).toHaveAttribute('aria-disabled', 'false');
      await expect(handle).toHaveAttribute('tabindex', '0');

      // check classes
      await expect(slider).toHaveClass(/\bhoverable\b/);
      await expect(slider).not.toHaveClass(/\bdisabled\b/);
      await expect(slider).not.toHaveClass(/\bvertical\b/);
      await expect(slider).not.toHaveClass(/\breversed\b/);
      await expect(slider).not.toHaveClass(/\bfocus\b/);
      await expect(slider).not.toHaveClass(/\bpips\b/);
    });
  });
});
