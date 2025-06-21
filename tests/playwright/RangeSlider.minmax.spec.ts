import { expect, test } from '@playwright/test';
import { dragHandleTo } from './helpers/tools.js';

test.describe('Min/Max Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/range-slider/minmax');
    await page.waitForLoadState('networkidle');
  });
  test.describe('Default Min/Max Tests', () => {
    test('should use default min/max values (0/100)', async ({ page }) => {
      const slider = page.locator('#default');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      await expect(handle).toHaveAttribute('aria-valuemin', '0');
      await expect(handle).toHaveAttribute('aria-valuemax', '100');
      await expect(handle).toHaveAttribute('aria-valuenow', '50');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('0');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('100');
    });
  });

  test.describe('Min Only Tests', () => {
    test('should handle positive min (20)', async ({ page }) => {
      const slider = page.locator('#min-20');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      await expect(handle).toHaveAttribute('aria-valuemin', '20');
      await expect(handle).toHaveAttribute('aria-valuemax', '100');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('20');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('100');
    });

    test('should handle negative min (-50)', async ({ page }) => {
      const slider = page.locator('#min-neg-50');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      await expect(handle).toHaveAttribute('aria-valuemin', '-50');
      await expect(handle).toHaveAttribute('aria-valuemax', '100');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('-50');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('100');
    });

    test('should handle decimal min (10.5)', async ({ page }) => {
      const slider = page.locator('#min-decimal');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      await expect(handle).toHaveAttribute('aria-valuemin', '10.5');
      await expect(handle).toHaveAttribute('aria-valuemax', '100');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('10.5');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('100');
    });

    test('should handle large min (1000)', async ({ page }) => {
      const slider = page.locator('#min-large');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      // this fails because min: 1000 makes it greater than the default max: 100
      await expect(handle).toHaveAttribute('aria-valuemin', '0');
      await expect(handle).toHaveAttribute('aria-valuemax', '100');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('0');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('100');
    });

    test('should handle very large min (1000000)', async ({ page }) => {
      const slider = page.locator('#min-very-large');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      // this fails because min: 1000000 makes it greater than the default max: 100
      await expect(handle).toHaveAttribute('aria-valuemin', '0');
      await expect(handle).toHaveAttribute('aria-valuemax', '100');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('0');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('100');
    });
  });

  test.describe('Max Only Tests', () => {
    test('should handle small max (50)', async ({ page }) => {
      const slider = page.locator('#max-50');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      await expect(handle).toHaveAttribute('aria-valuemin', '0');
      await expect(handle).toHaveAttribute('aria-valuemax', '50');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('0');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('50');
    });

    test('should handle decimal max (75.5)', async ({ page }) => {
      const slider = page.locator('#max-decimal');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      await expect(handle).toHaveAttribute('aria-valuemin', '0');
      await expect(handle).toHaveAttribute('aria-valuemax', '75.5');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('0');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('75.5');
    });

    test('should handle large max (1000)', async ({ page }) => {
      const slider = page.locator('#max-large');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      await expect(handle).toHaveAttribute('aria-valuemin', '0');
      await expect(handle).toHaveAttribute('aria-valuemax', '1000');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('0');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('1000');
    });

    test('should handle very large max (1000000)', async ({ page }) => {
      const slider = page.locator('#max-very-large');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      await expect(handle).toHaveAttribute('aria-valuemin', '0');
      await expect(handle).toHaveAttribute('aria-valuemax', '1000000');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('0');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('1000000');
    });

    test('should handle negative max (-20)', async ({ page }) => {
      const slider = page.locator('#max-neg-20');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      // this fails because max: -20 makes it less than the default min: 0
      await expect(handle).toHaveAttribute('aria-valuemin', '0');
      await expect(handle).toHaveAttribute('aria-valuemax', '100');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('0');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('100');
    });
  });

  test.describe('Combined Min/Max Tests', () => {
    test('should handle positive range (20/80)', async ({ page }) => {
      const slider = page.locator('#minmax-20-80');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      await expect(handle).toHaveAttribute('aria-valuemin', '20');
      await expect(handle).toHaveAttribute('aria-valuemax', '80');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('20');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('80');
    });

    test('should handle negative range (-80/-20)', async ({ page }) => {
      const slider = page.locator('#minmax-neg-80-neg-20');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      await expect(handle).toHaveAttribute('aria-valuemin', '-80');
      await expect(handle).toHaveAttribute('aria-valuemax', '-20');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('-80');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('-20');
    });

    test('should handle cross-zero range (-50/50)', async ({ page }) => {
      const slider = page.locator('#minmax-neg-50-50');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      await expect(handle).toHaveAttribute('aria-valuemin', '-50');
      await expect(handle).toHaveAttribute('aria-valuemax', '50');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('-50');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('50');
    });

    test('should handle decimal range (10.5/90.5)', async ({ page }) => {
      const slider = page.locator('#minmax-decimal');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      await expect(handle).toHaveAttribute('aria-valuemin', '10.5');
      await expect(handle).toHaveAttribute('aria-valuemax', '90.5');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('10.5');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('90.5');
    });

    test('should handle large range (1000/10000)', async ({ page }) => {
      const slider = page.locator('#minmax-large');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      await expect(handle).toHaveAttribute('aria-valuemin', '1000');
      await expect(handle).toHaveAttribute('aria-valuemax', '10000');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('1000');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('10000');
    });

    test('should handle very large range (1000000/2000000)', async ({ page }) => {
      const slider = page.locator('#minmax-very-large');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      await expect(handle).toHaveAttribute('aria-valuemin', '1000000');
      await expect(handle).toHaveAttribute('aria-valuemax', '2000000');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('1000000');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('2000000');
    });
  });

  test.describe('Asymmetric Range Tests', () => {
    test('should handle small to large range (1/1000)', async ({ page }) => {
      const slider = page.locator('#asymmetric-small-large');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      await expect(handle).toHaveAttribute('aria-valuemin', '1');
      await expect(handle).toHaveAttribute('aria-valuemax', '1000');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('1');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('1000');
    });

    test('should handle negative to large range (-100/1000)', async ({ page }) => {
      const slider = page.locator('#asymmetric-neg-large');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      await expect(handle).toHaveAttribute('aria-valuemin', '-100');
      await expect(handle).toHaveAttribute('aria-valuemax', '1000');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('-100');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('1000');
    });

    test('should handle very negative to small range (-1000/10)', async ({ page }) => {
      const slider = page.locator('#asymmetric-very-neg-small');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      await expect(handle).toHaveAttribute('aria-valuemin', '-1000');
      await expect(handle).toHaveAttribute('aria-valuemax', '10');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('-1000');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('10');
    });

    test('should handle decimal to whole range (0.5/100)', async ({ page }) => {
      const slider = page.locator('#asymmetric-decimal-whole');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      await expect(handle).toHaveAttribute('aria-valuemin', '0.5');
      await expect(handle).toHaveAttribute('aria-valuemax', '100');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('0.5');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('100');
    });

    test('should handle whole to decimal range (0/99.9)', async ({ page }) => {
      const slider = page.locator('#asymmetric-whole-decimal');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      await expect(handle).toHaveAttribute('aria-valuemin', '0');
      await expect(handle).toHaveAttribute('aria-valuemax', '99.9');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('0');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('99.9');
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle very close range (49.9/50.1)', async ({ page }) => {
      const slider = page.locator('#edge-close-range');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      await expect(handle).toHaveAttribute('aria-valuemin', '49.9');
      await expect(handle).toHaveAttribute('aria-valuemax', '50.1');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('49.9');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('50.1');
    });

    test.describe('Tiny Decimal Range Tests', () => {
      test('should coerce tiny decimal range (0.001/0.009 -> 0/0.01)', async ({ page }) => {
        const slider = page.locator('#edge-tiny-decimal');
        const handle = slider.locator('.rangeHandle');
        const firstPip = slider.locator('.rsPip--first');
        const lastPip = slider.locator('.rsPip--last');

        // because the precision default is 2, the range is coerced to 0/0.01
        await expect(handle).toHaveAttribute('aria-valuemin', '0');
        await expect(handle).toHaveAttribute('aria-valuemax', '0.01');
        await expect(firstPip.locator('.rsPipVal')).toHaveText('0');
        await expect(lastPip.locator('.rsPipVal')).toHaveText('0.01');
      });

      test('should success tiny decimal range (0.001/0.009) with precision set to 3', async ({ page }) => {
        const slider = page.locator('#edge-tiny-decimal-precision');
        const handle = slider.locator('.rangeHandle');
        const firstPip = slider.locator('.rsPip--first');
        const lastPip = slider.locator('.rsPip--last');

        await expect(handle).toHaveAttribute('aria-valuemin', '0.001');
        await expect(handle).toHaveAttribute('aria-valuemax', '0.009');
        await expect(firstPip.locator('.rsPipVal')).toHaveText('0.001');
        await expect(lastPip.locator('.rsPipVal')).toHaveText('0.009');
      });
    });

    test('should handle huge range (-1000000/1000000)', async ({ page }) => {
      const slider = page.locator('#edge-huge-range');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      await expect(handle).toHaveAttribute('aria-valuemin', '-1000000');
      await expect(handle).toHaveAttribute('aria-valuemax', '1000000');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('-1000000');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('1000000');
    });
  });

  test.describe('Invalid Min/Max Tests', () => {
    test('should handle zero-width range (50/50)', async ({ page }) => {
      const slider = page.locator('#edge-zero-width');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      // this fails because min: 50, max: 50 means the max is <= min, and resets to default values
      await expect(handle).toHaveAttribute('aria-valuemin', '0');
      await expect(handle).toHaveAttribute('aria-valuemax', '100');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('0');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('100');
    });

    test('should handle min greater than max (80/20)', async ({ page }) => {
      const slider = page.locator('#invalid-min-greater');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      // Should reset to default values
      await expect(handle).toHaveAttribute('aria-valuemin', '0');
      await expect(handle).toHaveAttribute('aria-valuemax', '100');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('0');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('100');
    });

    test('should handle max less than min (-20/-80)', async ({ page }) => {
      const slider = page.locator('#invalid-max-less');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      // Should reset to default values
      await expect(handle).toHaveAttribute('aria-valuemin', '0');
      await expect(handle).toHaveAttribute('aria-valuemax', '100');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('0');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('100');
    });

    test.describe('Handle Dragging Tests', () => {
      test('should clamp handle to min value when dragged below min', async ({ page }) => {
        const slider = page.locator('#minmax-20-80');
        const handle = slider.locator('.rangeHandle');

        await slider.scrollIntoViewIfNeeded();

        await dragHandleTo(page, slider, handle, -2);
        await expect(handle).toHaveAttribute('aria-valuenow', '20');
        await expect(handle).toHaveCSS('translate', '0px');
      });

      test('should clamp handle to max value when dragged above max', async ({ page }) => {
        const slider = page.locator('#minmax-20-80');
        const handle = slider.locator('.rangeHandle');

        await slider.scrollIntoViewIfNeeded();

        await dragHandleTo(page, slider, handle, 1.2);
        await expect(handle).toHaveAttribute('aria-valuenow', '80');
        await expect(handle).toHaveCSS('translate', '1000px');
      });

      test('should handle dragging with negative min/max values', async ({ page }) => {
        const slider = page.locator('#minmax-neg-80-neg-20');
        const handle = slider.locator('.rangeHandle');

        await slider.scrollIntoViewIfNeeded();

        // Drag to min
        await dragHandleTo(page, slider, handle, -1.2);
        await expect(handle).toHaveAttribute('aria-valuenow', '-80');
        await expect(handle).toHaveCSS('translate', '0px');

        // Drag to max
        await dragHandleTo(page, slider, handle, 1.2);
        await expect(handle).toHaveAttribute('aria-valuenow', '-20');
        await expect(handle).toHaveCSS('translate', '1000px');
      });
    });
  });

  test.describe('Invalid Min/Max Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/test/range-slider/minmax/invalid-min-max');
      await page.waitForLoadState('networkidle');
    });
    test('should handle NaN min', async ({ page }) => {
      const slider = page.locator('#invalid-min-nan');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      // Should reset to default values
      await expect(handle).toHaveAttribute('aria-valuemin', '0');
      await expect(handle).toHaveAttribute('aria-valuemax', '100');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('0');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('100');
    });

    test('should handle NaN max', async ({ page }) => {
      const slider = page.locator('#invalid-max-nan');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      // Should reset to default values
      await expect(handle).toHaveAttribute('aria-valuemin', '0');
      await expect(handle).toHaveAttribute('aria-valuemax', '100');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('0');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('100');
    });

    test('should handle Infinity min', async ({ page }) => {
      const slider = page.locator('#invalid-min-infinity');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      // Should reset to default values
      await expect(handle).toHaveAttribute('aria-valuemin', '0');
      await expect(handle).toHaveAttribute('aria-valuemax', '100');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('0');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('100');
    });

    test('should handle Infinity max', async ({ page }) => {
      const slider = page.locator('#invalid-max-infinity');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      // Should reset to default values
      await expect(handle).toHaveAttribute('aria-valuemin', '0');
      await expect(handle).toHaveAttribute('aria-valuemax', '100');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('0');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('100');
    });

    test('should handle -Infinity min', async ({ page }) => {
      const slider = page.locator('#invalid-min-negative-infinity');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      // Should reset to default values
      await expect(handle).toHaveAttribute('aria-valuemin', '0');
      await expect(handle).toHaveAttribute('aria-valuemax', '100');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('0');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('100');
    });

    test('should handle -Infinity max', async ({ page }) => {
      const slider = page.locator('#invalid-max-negative-infinity');
      const handle = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      // Should reset to default values
      await expect(handle).toHaveAttribute('aria-valuemin', '0');
      await expect(handle).toHaveAttribute('aria-valuemax', '100');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('0');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('100');
    });
  });

  test.describe('Dynamic Min/Max Tests', () => {
    test('should update min/max values via bound inputs and reflect changes visually and in data', async ({ page }) => {
      const slider = page.locator('#dynamic-minmax');
      const handles = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');
      const minInput = page.locator('input[type="number"]').first();
      const maxInput = page.locator('input[type="number"]').nth(1);

      await slider.scrollIntoViewIfNeeded();

      // Initial state: min=0, max=100, values=[25, 75]
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '0');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '100');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '25');
      await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '75');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('0');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('100');

      // Change min to 20
      await minInput.fill('20');
      await page.waitForTimeout(100);

      // Verify min update: min=20, max=100, values should be constrained
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '20');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '100');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '25'); // Still 25 since it's >= 20
      await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '75');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('20');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('100');

      // Change max to 50
      await maxInput.fill('50');
      await page.waitForTimeout(100);

      // Verify max update: min=20, max=50, values should be constrained
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '20');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '50');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '25'); // Still 25 since it's in range
      await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '50'); // Constrained to max
      await expect(firstPip.locator('.rsPipVal')).toHaveText('20');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('50');

      // Change min to 30 (should constrain first handle)
      await minInput.fill('30');
      await page.waitForTimeout(100);

      // Verify min update: min=30, max=50, first handle should be constrained
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '30');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '50');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '30'); // Constrained to min
      await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '50');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('30');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('50');
    });

    test('should handle negative min/max updates correctly', async ({ page }) => {
      const slider = page.locator('#dynamic-minmax');
      const handles = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');
      const minInput = page.locator('input[type="number"]').first();
      const maxInput = page.locator('input[type="number"]').nth(1);

      await slider.scrollIntoViewIfNeeded();

      // Set min to -50
      await minInput.fill('-50');
      await page.waitForTimeout(100);

      // Verify negative min update
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '-50');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '100');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '25'); // Still in range
      await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '75');
      // pips should be constrained to min/max
      await expect(firstPip.locator('.rsPipVal')).toHaveText('-50');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('100');

      // Set max to -20
      await maxInput.fill('-20');
      await page.waitForTimeout(100);

      // Verify negative max update: min=-50, max=-20
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '-50');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '-20');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '-20'); // Constrained to max
      await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '-20'); // Constrained to max
      // pips should be constrained to min/max
      await expect(firstPip.locator('.rsPipVal')).toHaveText('-50');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('-20');
    });

    test('should handle decimal min/max updates correctly', async ({ page }) => {
      const slider = page.locator('#dynamic-minmax');
      const handles = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');
      const minInput = page.locator('input[type="number"]').first();
      const maxInput = page.locator('input[type="number"]').nth(1);

      await slider.scrollIntoViewIfNeeded();

      // Set min to 10.5
      await minInput.fill('10.5');
      await page.waitForTimeout(100);

      // Verify decimal min update
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '10.5');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '100');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '25.5'); // Because the min is 10.5, each step will be 0.5
      await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '75.5'); // Because the max is 100, each step will be 0.5 until the last
      // pips should be constrained to min/max
      await expect(firstPip.locator('.rsPipVal')).toHaveText('10.5');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('100');

      // Set max to 90.5
      await maxInput.fill('90.5');
      await page.waitForTimeout(100);

      // Verify decimal max update: min=10.5, max=90.5
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '10.5');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '90.5');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '25.5'); // Because the min is 10.5, each step will be 0.5
      await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '75.5'); // Because the max is 90.5, each step will be 0.5
      // pips should be constrained to min/max
      await expect(firstPip.locator('.rsPipVal')).toHaveText('10.5');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('90.5');
    });

    test('should update min/max values via toggle buttons and constrain handles correctly', async ({ page }) => {
      const slider = page.locator('#toggle-minmax');
      const handles = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      await slider.scrollIntoViewIfNeeded();

      // Initial state: min=0, max=100, values=[30, 70]
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '0');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '100');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '30');
      await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '70');
      // pips should be constrained to min/max
      await expect(firstPip.locator('.rsPipVal')).toHaveText('0');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('100');

      // Set min to 20
      await page.locator('#btn_toggle_min_positive').click();
      await page.waitForTimeout(100);

      // Verify min update: min=20, max=100
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '20');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '100');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '30'); // Still in range
      await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '70');
      // pips should be constrained to min/max
      await expect(firstPip.locator('.rsPipVal')).toHaveText('20');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('100');

      // Set max to 50
      await page.locator('#btn_toggle_max_small').click();
      await page.waitForTimeout(100);

      // Verify max update: min=20, max=50, second handle should be constrained
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '20');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '50');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '30'); // Still in range
      await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '50'); // Constrained to max
      // pips should be constrained to min/max
      await expect(firstPip.locator('.rsPipVal')).toHaveText('20');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('50');

      // Set both min and max to negative range
      await page.locator('#btn_toggle_both_negative').click();
      await page.waitForTimeout(100);

      // Verify negative range update: min=-80, max=-20
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '-80');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '-20');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '-20'); // Constrained to max
      await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '-20'); // Constrained to max
      // pips should be constrained to min/max
      await expect(firstPip.locator('.rsPipVal')).toHaveText('-80');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('-20');
    });

    test('should handle cross-zero range updates correctly', async ({ page }) => {
      const slider = page.locator('#toggle-minmax');
      const handles = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      await slider.scrollIntoViewIfNeeded();

      // Initial state: min=0, max=100, values=[30, 70]
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '0');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '100');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '30');
      await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '70');

      // Set cross-zero range: min=-50, max=50
      await page.locator('#btn_toggle_both_cross_zero').click();
      await page.waitForTimeout(100);

      // Verify cross-zero range update
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '-50');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '50');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '30'); // No change as it's still in range
      await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '50'); // Constrained to max
      // pips should be constrained to min/max
      await expect(firstPip.locator('.rsPipVal')).toHaveText('-50');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('50');
    });

    test('should handle decimal range updates correctly', async ({ page }) => {
      const slider = page.locator('#toggle-minmax');
      const handles = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');

      await slider.scrollIntoViewIfNeeded();

      // Set decimal range: min=10.5, max=90.5
      await page.locator('#btn_toggle_both_decimal').click();
      await page.waitForTimeout(100);

      // Verify decimal range update
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '10.5');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '90.5');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '30.5'); // because min is 10.5, each step will be aligned to 0.5
      await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '70.5'); // because min is 10.5, each step will be aligned to 0.5
      // pips should be constrained to min/max
      await expect(firstPip.locator('.rsPipVal')).toHaveText('10.5');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('90.5');
    });

    test('should constrain handles when dragging after min/max updates', async ({ page }) => {
      const slider = page.locator('#dynamic-minmax');
      const handles = slider.locator('.rangeHandle');
      const minInput = page.locator('input[type="number"]').first();
      const maxInput = page.locator('input[type="number"]').nth(1);

      await slider.scrollIntoViewIfNeeded();

      // Set range to 20-80
      await minInput.fill('20');
      await maxInput.fill('80');
      await page.waitForTimeout(100);

      // Try to drag first handle below min
      await dragHandleTo(page, slider, handles.nth(0), -0.5);
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '20'); // Should be clamped to min

      // Try to drag second handle above max
      await dragHandleTo(page, slider, handles.nth(1), 1.5);
      await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '80'); // Should be clamped to max

      // Try to drag first handle above second handle (should be allowed in non-range mode)
      await dragHandleTo(page, slider, handles.nth(0), 0.8);
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '68'); // 80% of (80-20) is 48. 48 + 20 = 68.
    });

    test('should handle invalid min/max updates gracefully', async ({ page }) => {
      const slider = page.locator('#dynamic-minmax');
      const handles = slider.locator('.rangeHandle');
      const firstPip = slider.locator('.rsPip--first');
      const lastPip = slider.locator('.rsPip--last');
      const minInput = page.locator('input[type="number"]').first();
      const maxInput = page.locator('input[type="number"]').nth(1);

      await slider.scrollIntoViewIfNeeded();

      // Set min greater than max (invalid)
      await minInput.fill('80');
      await maxInput.fill('20');
      await page.waitForTimeout(100);

      // Should reset to default values or handle gracefully
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '0');
      await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '100');
      await expect(firstPip.locator('.rsPipVal')).toHaveText('0');
      await expect(lastPip.locator('.rsPipVal')).toHaveText('100');
    });
  });
});
