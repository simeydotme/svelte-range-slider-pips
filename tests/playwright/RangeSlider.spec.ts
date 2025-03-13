import { expect, test } from './helpers/assertions.js';

test.describe('Deafult Tests', () => {
  test.describe('no props', () => {
    test('should render correctly', async ({ page }) => {
      await page.goto('/test/range-slider/base');

      // Check component exists
      await expect(page.locator('.rangeSlider')).toBeVisible();
      await expect(page.locator('.rangeHandle')).toBeVisible();
      await expect(page.locator('.rangeNub')).toBeVisible();
    });

    test('should have correct attributes', async ({ page }) => {
      await page.goto('/test/range-slider/base');
      const handle = page.locator('.rangeHandle');

      // Check role
      await expect(handle).toHaveAttribute('role', 'slider');

      // Check min/max/value
      await expect(handle, 'to have min of 0').toHaveAttribute('aria-valuemin', '0');
      await expect(handle, 'to have max of 100').toHaveAttribute('aria-valuemax', '100');
      await expect(handle, 'to have value of 50').toHaveAttribute('aria-valuenow', '50');
      await expect(handle, 'to be positioned at 50%').toHaveStyle('left', '50%');

      // Check orientation and disabled state
      await expect(handle).toHaveAttribute('aria-orientation', 'horizontal');
      await expect(handle).toHaveAttribute('aria-disabled', 'false');
    });
  });
});
