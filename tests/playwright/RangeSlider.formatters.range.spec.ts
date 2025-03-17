import { expect, test } from '@playwright/test';
import { dragHandleTo } from './helpers/tools.js';

test.describe('Formatter Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/range-slider/formatters/range');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Basic Range Formatter Tests', () => {
    test('should use default range formatter when none provided', async ({ page }) => {
      const slider = page.locator('#default-range-formatter');
      const rangeBar = slider.locator('.rangeBar');
      const rangeFloat = rangeBar.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await slider.locator('.rangeBar');
      await expect(rangeFloat).toContainText('25 - 75');
    });

    test('should use custom range formatter with number formatter', async ({ page }) => {
      const slider = page.locator('#number-range-formatter');
      const rangeBar = slider.locator('.rangeBar');
      const rangeFloat = rangeBar.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await slider.locator('.rangeBar');
      await expect(rangeFloat).toContainText('25.00 - 75.00');
    });

    test('should use currency range formatter', async ({ page }) => {
      const slider = page.locator('#currency-range-formatter');
      const rangeBar = slider.locator('.rangeBar');
      const rangeFloat = rangeBar.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await slider.locator('.rangeBar');
      await expect(rangeFloat).toContainText('$25.00 - $75.00');
    });

    test('should use percent range formatter', async ({ page }) => {
      const slider = page.locator('#percent-range-formatter');
      const rangeBar = slider.locator('.rangeBar');
      const rangeFloat = rangeBar.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await slider.locator('.rangeBar');
      await expect(rangeFloat).toContainText('25.0% - 75.0%');
    });

    test('should use HTML range formatter', async ({ page }) => {
      const slider = page.locator('#html-range-formatter');
      const rangeBar = slider.locator('.rangeBar');
      const rangeFloat = rangeBar.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await slider.locator('.rangeBar');
      await expect(rangeFloat.locator('strong')).toContainText('25');
      await expect(rangeFloat.locator('em')).toContainText('75');
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle large numbers in range formatter', async ({ page }) => {
      const slider = page.locator('#large-numbers');
      const rangeBar = slider.locator('.rangeBar');
      const rangeFloat = rangeBar.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await slider.locator('.rangeBar');
      await expect(rangeFloat).toContainText('1000000.00 - 2000000.00');
    });

    test('should handle negative numbers in range formatter', async ({ page }) => {
      const slider = page.locator('#negative-numbers');
      const rangeBar = slider.locator('.rangeBar');
      const rangeFloat = rangeBar.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await slider.locator('.rangeBar');
      await expect(rangeFloat).toContainText('-50.00 - -20.00');
    });

    test('should handle decimal numbers in range formatter', async ({ page }) => {
      const slider = page.locator('#decimal-numbers');
      const rangeBar = slider.locator('.rangeBar');
      const rangeFloat = rangeBar.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await slider.locator('.rangeBar');
      await expect(rangeFloat).toContainText('10.25 - 20.75');
    });

    test('should handle same values in range formatter', async ({ page }) => {
      const slider = page.locator('#same-values');
      const rangeBar = slider.locator('.rangeBar');
      const rangeFloat = rangeBar.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await slider.locator('.rangeBar');
      await expect(rangeFloat).toContainText('50.00 - 50.00');
    });

    test('should handle zero values in range formatter', async ({ page }) => {
      const slider = page.locator('#zero-values');
      const rangeBar = slider.locator('.rangeBar');
      const rangeFloat = rangeBar.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await slider.locator('.rangeBar');
      await expect(rangeFloat).toContainText('0.00 - 0.00');
    });

    test('should handle extreme values in range formatter', async ({ page }) => {
      const slider = page.locator('#extreme-values');
      const rangeBar = slider.locator('.rangeBar');
      const rangeFloat = rangeBar.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await slider.locator('.rangeBar');
      await expect(rangeFloat).toContainText('-1000000.00 - 1000000.00');
    });
  });

  test.describe('Accessibility Tests', () => {
    test('should announce values via aria-valuetext with basic formatter', async ({ page }) => {
      const slider = page.locator('#aria-basic');
      const handles = slider.locator('.rangeHandle');
      const rangeBar = slider.locator('.rangeBar');

      await expect(handles.first()).toHaveAttribute('aria-valuetext', '25.00');
      await expect(handles.nth(1)).toHaveAttribute('aria-valuetext', '75.00');
      await expect(rangeBar).not.toHaveAttribute('aria-valuetext');
    });

    test('should announce values via aria-valuetext with HTML formatter', async ({ page }) => {
      const slider = page.locator('#aria-html');
      const handles = slider.locator('.rangeHandle');
      const rangeBar = slider.locator('.rangeBar');

      await expect(handles.first()).toHaveAttribute('aria-valuetext', '25');
      await expect(handles.nth(1)).toHaveAttribute('aria-valuetext', '75');
      await expect(rangeBar).not.toHaveAttribute('aria-valuetext');
    });

    test('should announce values via aria-valuetext with locale formatter', async ({ page }) => {
      const slider = page.locator('#aria-locale');
      const handles = slider.locator('.rangeHandle');
      const rangeBar = slider.locator('.rangeBar');

      await expect(handles.first()).toHaveAttribute('aria-valuetext', '25');
      await expect(handles.nth(1)).toHaveAttribute('aria-valuetext', '75');
      await expect(rangeBar).not.toHaveAttribute('aria-valuetext');
    });

    test('should respect aria labels with formatters', async ({ page }) => {
      const slider = page.locator('#aria-basic');
      const handles = slider.locator('.rangeHandle');

      await expect(handles.first()).toHaveAttribute('aria-label', 'First handle');
      await expect(handles.nth(1)).toHaveAttribute('aria-label', 'Second handle');
    });
  });

  test.describe('Formatter Context Tests', () => {
    test('should calculate percentages correctly in reversed mode', async ({ page }) => {
      const slider = page.locator('#reversed-mode');
      const rangeBar = slider.locator('.rangeBar');
      const rangeFloat = rangeBar.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await slider.locator('.rangeBar');
      // the values[] array is not actually reversed, only the display is.
      // so the formatter is still in the same order. THe user can manually reverse
      // the formatter if they desire
      await expect(rangeFloat).toContainText('25.0% - 75.0%');
    });

    test('should format values correctly in vertical mode', async ({ page }) => {
      const slider = page.locator('#vertical-mode');
      const rangeBar = slider.locator('.rangeBar');
      const rangeFloat = rangeBar.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await slider.locator('.rangeBar');
      await expect(rangeFloat).toContainText('25.0% - 75.0%');
    });

    test('should handle different min/max ranges correctly', async ({ page }) => {
      const slider = page.locator('#custom-range');
      const rangeBar = slider.locator('.rangeBar');
      const rangeFloat = rangeBar.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await slider.locator('.rangeBar');
      await expect(rangeFloat).toContainText('15.0% - 85.0%');
    });

    test('should respect step values in percentage calculations', async ({ page }) => {
      const slider = page.locator('#step-values');
      const rangeBar = slider.locator('.rangeBar');
      const rangeFloat = rangeBar.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await slider.locator('.rangeBar');
      await expect(rangeFloat).toContainText('25.0% - 75.0%');
    });
  });

  test.describe('Prefix and Suffix Tests', () => {
    test('should handle prefix and suffix independently', async ({ page }) => {
      const slider = page.locator('#prefix-suffix-test');
      const rangeBar = slider.locator('.rangeBar');
      const rangeFloat = rangeBar.locator('.rangeFloat');
      const prefixButton = page.locator('#btn_prefix');
      const suffixButton = page.locator('#btn_suffix');

      await slider.scrollIntoViewIfNeeded();

      // Start with no prefix/suffix
      await rangeBar.hover();
      await expect(rangeFloat).toContainText('30 - 70');

      // Add prefix
      await prefixButton.click();
      await rangeBar.hover();
      await expect(rangeFloat).toContainText('Range: 30 - Range: 70');

      // Add suffix
      await suffixButton.click();
      await rangeBar.hover();
      await expect(rangeFloat).toContainText('Range: 30 units - Range: 70 units');

      // Remove prefix
      await prefixButton.click();
      await rangeBar.hover();
      await expect(rangeFloat).toContainText('30 units - 70 units');

      // Remove suffix
      await suffixButton.click();
      await rangeBar.hover();
      await expect(rangeFloat).toContainText('30 - 70');
    });
  });

  test.describe('Dynamic Formatter Tests', () => {
    test('should update range formatter when cycling through formatters', async ({ page }) => {
      const slider = page.locator('#dynamic-formatter');
      const rangeBar = slider.locator('.rangeBar');
      const rangeFloat = rangeBar.locator('.rangeFloat');
      const cycleButton = page.locator('#btn_cycle');

      await slider.scrollIntoViewIfNeeded();
      // Start with default formatter
      await rangeBar.hover();
      await expect(rangeFloat).toContainText('3000 - 7000');

      // Cycle to number formatter
      await cycleButton.click();
      await rangeBar.hover();
      await expect(rangeFloat).toContainText('3000.00 - 7000.00');

      // Cycle to currency formatter
      await cycleButton.click();
      await rangeBar.hover();
      await expect(rangeFloat).toContainText('$3000.00 - $7000.00');

      // Cycle to percent formatter
      await cycleButton.click();
      await rangeBar.hover();
      await expect(rangeFloat).toContainText('30.0% - 70.0%');

      // Cycle to HTML formatter
      await cycleButton.click();
      await rangeBar.hover();
      await expect(rangeFloat.locator('strong')).toContainText('3000');
      await expect(rangeFloat.locator('em')).toContainText('7000');

      // Cycle to locale (de-DE) formatter
      await cycleButton.click();
      await rangeBar.hover();
      await expect(rangeFloat).toContainText('3.000 - 7.000');
    });

    test('should handle formatter enable/disable at runtime', async ({ page }) => {
      const slider = page.locator('#dynamic-formatter');
      const rangeBar = slider.locator('.rangeBar');
      const rangeFloat = rangeBar.locator('.rangeFloat');
      const toggleButton = page.locator('#btn_toggle');
      const cycleButton = page.locator('#btn_cycle');
      await slider.scrollIntoViewIfNeeded();
      // Start with Currency formatter enabled
      await cycleButton.click();
      await cycleButton.click();
      await rangeBar.hover();
      await expect(rangeFloat).toContainText('$3000.00 - $7000.00'); // Currency formatter

      // Disable formatter
      await toggleButton.click();
      await rangeBar.hover();
      await expect(rangeFloat).toContainText('3000 - 7000'); // Should show unformatted values

      // Enable formatter again
      await toggleButton.click();
      await rangeBar.hover();
      await expect(rangeFloat).toContainText('$3000.00 - $7000.00'); // Currency formatter again
    });

    test('should update range formatter when values change', async ({ page }) => {
      const slider = page.locator('#dynamic-formatter');
      const rangeBar = slider.locator('.rangeBar');
      const rangeFloat = rangeBar.locator('.rangeFloat');
      const inputs = page.locator('.value-inputs input');

      await slider.scrollIntoViewIfNeeded();
      await rangeBar.hover();
      await expect(rangeFloat).toContainText('3000 - 7000');

      // Update values
      await inputs.nth(0).fill('4000');
      await inputs.nth(1).fill('8000');
      await rangeBar.hover();
      await expect(rangeFloat).toContainText('4000 - 8000');
    });
  });

  test.describe('Performance Tests', () => {
    test('should handle many handles with formatters', async ({ page }) => {
      const slider = page.locator('#many-handles');
      const handles = slider.locator('.rangeHandle');

      await slider.scrollIntoViewIfNeeded();
      await expect(handles).toHaveCount(5);
      await expect(handles.nth(0)).toHaveAttribute('aria-valuetext', '10.00');
      await expect(handles.nth(4)).toHaveAttribute('aria-valuetext', '90.00');
    });

    test('should handle heavy range formatter without performance issues', async ({ page }) => {
      const slider = page.locator('#heavy-formatter');
      const rangeBar = slider.locator('.rangeBar');
      const rangeFloat = rangeBar.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await slider.locator('.rangeBar');
      await expect(rangeFloat).toBeVisible();
      // The heavy formatter should still complete within a reasonable time
      await expect(rangeFloat).toContainText('-');
    });

    test('should handle rapid handle movements with range formatters', async ({ page }) => {
      const slider = page.locator('#dynamic-formatter');
      const rangeBar = slider.locator('.rangeBar');
      const rangeFloat = rangeBar.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();

      await slider.scrollIntoViewIfNeeded();
      const sliderBounds = await slider.boundingBox();
      if (!sliderBounds) throw new Error('Could not get slider bounds');

      // Simulate rapid movements by quickly dragging the handle
      await page.mouse.move(sliderBounds.x + sliderBounds.width * 0.5, sliderBounds.y + sliderBounds.height / 2);
      await page.mouse.down();

      // Quick movements back and forth
      for (const position of [0.8, 0.2, 0.6, 0.4, 0.9, 0.1, 1.5, -0.5, 0.42]) {
        await page.mouse.move(
          sliderBounds.x + sliderBounds.width * position,
          sliderBounds.y + sliderBounds.height / 2,
          { steps: 5 } // Make the movement very quick
        );
      }

      await page.mouse.up();
      await expect(rangeFloat).toBeVisible();
      await expect(rangeFloat).toContainText('2200 - 6200');
    });
  });
});
