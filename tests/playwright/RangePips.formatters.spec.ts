import { expect, test } from '@playwright/test';

test.describe('Pip Formatter Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/range-slider/formatters/pips');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Basic Formatter Tests', () => {
    test('should use default formatter when none provided', async ({ page }) => {
      const slider = page.locator('#default-formatter');
      const pips = slider.locator('.rsPipVal');

      await expect(pips.first()).toHaveText('0');
      await expect(pips.nth(10)).toHaveText('50');
      await expect(pips.last()).toHaveText('100');
    });

    test('should use number formatter with 2 decimal places', async ({ page }) => {
      const slider = page.locator('#number-formatter');
      const pips = slider.locator('.rsPipVal');

      await expect(pips.first()).toHaveText('0.00');
      await expect(pips.nth(10)).toHaveText('50.00');
      await expect(pips.last()).toHaveText('100.00');
    });

    test('should use currency formatter with $ prefix', async ({ page }) => {
      const slider = page.locator('#currency-formatter');
      const pips = slider.locator('.rsPipVal');

      await expect(pips.first()).toHaveText('$0.00');
      await expect(pips.nth(10)).toHaveText('$50.00');
      await expect(pips.last()).toHaveText('$100.00');
    });

    test('should use percent formatter with percentage values', async ({ page }) => {
      const slider = page.locator('#percent-formatter');
      const pips = slider.locator('.rsPipVal');

      await expect(pips.first()).toHaveText('0.0%');
      await expect(pips.nth(10)).toHaveText('50.0%');
      await expect(pips.last()).toHaveText('100.0%');
    });

    test('should use index formatter showing pip numbers', async ({ page }) => {
      const slider = page.locator('#index-formatter');
      const pips = slider.locator('.rsPipVal');

      await expect(pips.first()).toHaveText('Pip 1: 0');
      await expect(pips.nth(10)).toHaveText('Pip 11: 50');
      await expect(pips.last()).toHaveText('Pip 21: 100');
    });

    test('should use HTML formatter with strong tags', async ({ page }) => {
      const slider = page.locator('#html-formatter');
      const pips = slider.locator('.rsPipVal');

      await expect(pips.first().locator('strong')).toHaveText('0');
      await expect(pips.nth(10).locator('strong')).toHaveText('50');
      await expect(pips.last().locator('strong')).toHaveText('100');
    });

    test('should use locale formatter with German formatting', async ({ page }) => {
      const slider = page.locator('#locale-formatter');
      const pips = slider.locator('.rsPipVal');

      await expect(pips.first()).toHaveText('0');
      await expect(pips.nth(10)).toHaveText('50');
      await expect(pips.last()).toHaveText('100');
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle large numbers with compact notation', async ({ page }) => {
      const slider = page.locator('#large-numbers');
      const pips = slider.locator('.rsPipVal');

      await expect(pips.first()).toHaveText('0');
      await expect(pips.nth(10)).toHaveText('2.5M');
      await expect(pips.last()).toHaveText('5M');
    });

    test('should handle negative numbers', async ({ page }) => {
      const slider = page.locator('#negative-numbers');
      const pips = slider.locator('.rsPipVal');

      await expect(pips.first()).toHaveText('-100.00');
      await expect(pips.nth(10)).toHaveText('-50.00');
      await expect(pips.last()).toHaveText('0.00');
    });

    test('should handle decimal numbers', async ({ page }) => {
      const slider = page.locator('#decimal-numbers');
      const pips = slider.locator('.rsPipVal');

      await expect(pips.first()).toHaveText('0.00');
      await expect(pips.nth(2)).toHaveText('2.50');
      await expect(pips.last()).toHaveText('100.00');
    });

    test('should handle extreme values', async ({ page }) => {
      const slider = page.locator('#extreme-values');
      const pips = slider.locator('.rsPipVal');

      await expect(pips.first()).toHaveText('-1000000.00');
      await expect(pips.nth(10)).toHaveText('0.00');
      await expect(pips.last()).toHaveText('1000000.00');
    });
  });

  test.describe('Dynamic Formatter Tests', () => {
    test('should update pip values when cycling through formatters', async ({ page }) => {
      const slider = page.locator('#dynamic-formatter');
      const pips = slider.locator('.rsPipVal');
      const cycleButton = page.locator('#btn_change');

      // Default formatter
      await expect(pips.nth(10)).toHaveText('50');

      // Number formatter
      await cycleButton.click();
      await expect(pips.nth(10)).toHaveText('50.00');

      // Currency formatter
      await cycleButton.click();
      await expect(pips.nth(10)).toHaveText('$50.00');

      // Percent formatter
      await cycleButton.click();
      await expect(pips.nth(10)).toHaveText('50.0%');

      // Index formatter
      await cycleButton.click();
      await expect(pips.nth(10)).toHaveText('Pip 11: 50');

      // HTML formatter
      await cycleButton.click();
      await expect(pips.nth(10).locator('strong')).toHaveText('50');

      // Locale formatter
      await cycleButton.click();
      await expect(pips.nth(10)).toHaveText('50');
    });

    test('should handle prefix and suffix', async ({ page }) => {
      const slider = page.locator('#dynamic-formatter');
      const pips = slider.locator('.rsPipVal');
      const prefixButton = page.locator('#btn_prefix');
      const suffixButton = page.locator('#btn_suffix');

      // Start with no prefix/suffix
      await expect(pips.nth(10)).toHaveText('50');

      // Add prefix
      await prefixButton.click();
      await expect(pips.nth(10)).toHaveText('Value: 50');

      // Add suffix
      await suffixButton.click();
      await expect(pips.nth(10)).toHaveText('Value: 50 units');

      // Remove prefix
      await prefixButton.click();
      await expect(pips.nth(10)).toHaveText('50 units');

      // Remove suffix
      await suffixButton.click();
      await expect(pips.nth(10)).toHaveText('50');
    });

    test('should move handle when clicking on prefix or suffix in pip label', async ({ page }) => {
      const slider = page.locator('#dynamic-formatter');
      const handle = slider.locator('.rangeHandle');
      const prefixButton = page.locator('#btn_prefix');
      const suffixButton = page.locator('#btn_suffix');

      // Add prefix and suffix
      await prefixButton.click();
      await suffixButton.click();

      // Get pip at value 70 (index 14)
      const targetPip = slider.locator('.rsPip').filter({ has: page.locator('[data-val="70"]') });
      const targetPipLabel = targetPip.locator('.rsPipVal');

      // Verify the label has prefix and suffix
      await expect(targetPipLabel).toHaveText('Value: 70 units');

      // Get the prefix span specifically
      const prefixSpan = targetPipLabel.locator('.rsPipValPrefix');
      await expect(prefixSpan).toHaveText('Value: ');

      // Get the suffix span specifically
      const suffixSpan = targetPipLabel.locator('.rsPipValSuffix');
      await expect(suffixSpan).toHaveText(' units');

      // Click on the prefix span
      await prefixSpan.click();

      // Wait a moment for the handle to move
      await page.waitForTimeout(100);

      // Check that handle moved to value 70
      await expect(handle).toHaveAttribute('aria-valuenow', '70');

      // Reset handle position by moving to value 30
      const resetPip = slider.locator('.rsPip').filter({ has: page.locator('[data-val="30"]') });
      await resetPip.click();
      await page.waitForTimeout(100);
      await expect(handle).toHaveAttribute('aria-valuenow', '30');

      // Now click on the suffix span of value 70 pip
      await suffixSpan.click();
      await page.waitForTimeout(100);

      // Check that handle moved to value 70 again
      await expect(handle).toHaveAttribute('aria-valuenow', '70');
    });

    test('should handle formatter enable/disable toggle', async ({ page }) => {
      const slider = page.locator('#formatter-toggle');
      const pips = slider.locator('.rsPipVal');
      const toggleButton = page.locator('#btn_toggle');

      // Start with formatter enabled (showing formatted values)
      await expect(pips.nth(20)).toHaveText('100.00');

      // Disable formatter
      await toggleButton.click();
      await expect(pips.nth(10)).toHaveText('50');

      // Enable formatter
      await toggleButton.click();
      await expect(pips.nth(5)).toHaveText('25.00');
    });
  });

  test.describe('Failing Cases', () => {
    test('should not show formatted values when pips are disabled', async ({ page }) => {
      const slider = page.locator('#no-pips');
      const pips = slider.locator('.rsPipVal');

      await expect(slider).toBeAttached();
      await expect(pips).toHaveCount(0);
    });

    test('should not show formatted values when pips have no labels', async ({ page }) => {
      const slider = page.locator('#pips-no-labels');
      const pips = slider.locator('.rsPipVal');

      await expect(slider).toBeAttached();
      await expect(pips).toHaveCount(0);
    });

    test('should not show formatted values when all=false', async ({ page }) => {
      const slider = page.locator('#pips-all-false');
      const pips = slider.locator('.rsPipVal');

      await expect(slider).toBeAttached();
      await expect(pips).toHaveCount(0);
    });

    test('should only show first pip label', async ({ page }) => {
      const slider = page.locator('#first-pip-only');
      const pipLabels = slider.locator('.rsPipVal');
      const allPips = slider.locator('.rsPip');
      const firstPipLabel = slider.locator('.rsPip--first .rsPipVal');
      const lastPipLabel = slider.locator('.rsPip--last .rsPipVal');
      const restPipLabels = slider.locator('.rsPip:not(.rsPip--first):not(.rsPip--last) .rsPipVal');

      // Should have more pips than formatted values
      await expect(pipLabels).toHaveCount(1);
      await expect(allPips).toHaveCount(21);

      // Only first pip should have a formatted value
      await expect(firstPipLabel).toHaveText('$0.00');
      await expect(lastPipLabel).toHaveCount(0);
      await expect(restPipLabels).toHaveCount(0);
    });

    test('should only show last pip label', async ({ page }) => {
      const slider = page.locator('#last-pip-only');
      const pips = slider.locator('.rsPipVal');
      const allPips = slider.locator('.rsPip');
      const firstPip = slider.locator('.rsPip--first .rsPipVal');
      const lastPip = slider.locator('.rsPip--last .rsPipVal');
      const restPips = slider.locator('.rsPip:not(.rsPip--first):not(.rsPip--last) .rsPipVal');

      // Should have more pips than formatted values
      const pipsCount = await allPips.count();
      const formattedCount = await pips.count();
      expect(formattedCount).toBe(1);
      expect(pipsCount).toBeGreaterThan(formattedCount);

      // Only last pip should have a formatted value
      await expect(firstPip).toHaveCount(0);
      await expect(lastPip).toHaveText('$100.00');
      await expect(restPips).toHaveCount(0);
    });

    test('should only show rest pip labels', async ({ page }) => {
      const slider = page.locator('#rest-pip-only');
      const allPips = slider.locator('.rsPip');
      const pipLabels = slider.locator('.rsPipVal');
      const firstPipLabel = slider.locator('.rsPip--first .rsPipVal');
      const lastPipLabel = slider.locator('.rsPip--last .rsPipVal');
      const restPipLabels = slider.locator('.rsPip:not(.rsPip--first):not(.rsPip--last) .rsPipVal');

      // Should have more pips than formatted values
      await expect(pipLabels).toHaveCount(19);
      await expect(allPips).toHaveCount(21);

      // Only rest pips should have formatted values
      await expect(firstPipLabel).toHaveCount(0);
      await expect(lastPipLabel).toHaveCount(0);
      await expect(restPipLabels.first()).toHaveText('$5.00');
      await expect(restPipLabels.last()).toHaveText('$95.00');
    });

    test('should only show formatted values for first and last pips', async ({ page }) => {
      const slider = page.locator('#pips-selective');
      const allPips = slider.locator('.rsPip');
      const pipLabels = slider.locator('.rsPipVal');
      const firstPipLabel = slider.locator('.rsPip--first .rsPipVal');
      const lastPipLabel = slider.locator('.rsPip--last .rsPipVal');
      const restPipLabels = slider.locator('.rsPip:not(.rsPip--first):not(.rsPip--last) .rsPipVal');

      await expect(pipLabels).toHaveCount(2);
      await expect(allPips).toHaveCount(21);
      await expect(firstPipLabel).toHaveCount(1);
      await expect(lastPipLabel).toHaveCount(1);
      await expect(restPipLabels).toHaveCount(0);

      // Check first and last values are formatted
      await expect(pipLabels.first()).toHaveText('$0.00');
      await expect(pipLabels.last()).toHaveText('$100.00');
    });

    test('should only show formatted values for rest pips', async ({ page }) => {
      const slider = page.locator('#pips-rest-only');

      const allPips = slider.locator('.rsPip');
      const pipLabels = slider.locator('.rsPipVal');
      const firstPipLabel = slider.locator('.rsPip--first .rsPipVal');
      const lastPipLabel = slider.locator('.rsPip--last .rsPipVal');
      const restPipLabels = slider.locator('.rsPip:not(.rsPip--first):not(.rsPip--last) .rsPipVal');

      // First and last should not have formatted values
      await expect(pipLabels).toHaveCount(19);
      await expect(allPips).toHaveCount(21);
      await expect(firstPipLabel).toHaveCount(0);
      await expect(lastPipLabel).toHaveCount(0);

      // Rest pips should have formatted values
      await expect(restPipLabels.first()).toHaveText('$5.00');
      await expect(restPipLabels.last()).toHaveText('$95.00');
    });
  });

  test.describe('Performance Tests', () => {
    test('should handle heavy formatter without significant delay', async ({ page }) => {
      const slider = page.locator('#heavy-formatter');
      const pips = slider.locator('.rsPipVal');

      // The values should eventually appear
      await expect(pips.first()).toHaveText(/\d+\.\d+/);
      await expect(pips.last()).toHaveText(/\d+\.\d+/);
    });
  });

  test.describe('Formatter Context Tests', () => {
    test('should calculate percentages correctly in reversed mode', async ({ page }) => {
      const slider = page.locator('#reversed-mode');
      const pips = slider.locator('.rsPipVal');

      await expect(pips.first()).toHaveText('0.0%');
      await expect(pips.nth(10)).toHaveText('50.0%');
      await expect(pips.last()).toHaveText('100.0%');
    });

    test('should format values correctly in vertical mode', async ({ page }) => {
      const slider = page.locator('#vertical-mode');
      const pips = slider.locator('.rsPipVal');

      await expect(pips.first()).toHaveText('0.0%');
      await expect(pips.nth(5)).toHaveText('50.0%');
      await expect(pips.last()).toHaveText('100.0%');
    });

    test('should handle different min/max ranges correctly', async ({ page }) => {
      const slider = page.locator('#custom-range');
      const pips = slider.locator('.rsPipVal');

      await expect(pips.first()).toHaveText('0.0%');
      await expect(pips.nth(10)).toHaveText('50.0%');
      await expect(pips.last()).toHaveText('100.0%');
    });

    test('should respect step values in percentage calculations', async ({ page }) => {
      const slider = page.locator('#step-values');
      const pips = slider.locator('.rsPipVal');

      await expect(pips.first()).toHaveText('0.0%');
      await expect(pips.nth(10)).toHaveText('50.0%');
      await expect(pips.last()).toHaveText('100.0%');
    });
  });
});
