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
});
