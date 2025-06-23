import { expect, test } from '@playwright/test';
import { dragHandleTo } from './helpers/tools.js';

test.describe('Handle Formatter Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/range-slider/formatters/handle');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Basic Handle Formatter Tests', () => {
    test('should use default formatter when none provided', async ({ page }) => {
      const slider = page.locator('#default-formatter');
      const handle = slider.locator('.rangeHandle');
      const float = handle.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await handle.hover();
      await expect(float).toContainText('50');
    });

    test('should use number formatter', async ({ page }) => {
      const slider = page.locator('#number-formatter');
      const handle = slider.locator('.rangeHandle');
      const float = handle.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await handle.hover();
      await expect(float).toContainText('50.00');
    });

    test('should use currency formatter', async ({ page }) => {
      const slider = page.locator('#currency-formatter');
      const handle = slider.locator('.rangeHandle');
      const float = handle.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await handle.hover();
      await expect(float).toContainText('$50.00');
    });

    test('should use percent formatter', async ({ page }) => {
      const slider = page.locator('#percent-formatter');
      const handle = slider.locator('.rangeHandle');
      const float = handle.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await handle.hover();
      await expect(float).toContainText('50.0%');
    });

    test('should use index formatter', async ({ page }) => {
      const slider = page.locator('#index-formatter');
      const handles = slider.locator('.rangeHandle');
      const floats = handles.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await handles.nth(0).hover();
      await expect(floats.nth(0)).toContainText('Handle 1: 10');

      await handles.nth(2).hover();
      await expect(floats.nth(2)).toContainText('Handle 3: 50');
    });

    test('should use HTML formatter', async ({ page }) => {
      const slider = page.locator('#html-formatter');
      const handle = slider.locator('.rangeHandle');
      const float = handle.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await handle.hover();
      await expect(float.locator('strong')).toContainText('50');
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle large numbers in handle formatter', async ({ page }) => {
      const slider = page.locator('#large-numbers');
      const handles = slider.locator('.rangeHandle');
      const floats = handles.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await handles.nth(0).hover();
      await expect(floats.nth(0)).toContainText('250K');

      await handles.nth(1).hover();
      await expect(floats.nth(1)).toContainText('2M');
    });

    test('should handle negative numbers in handle formatter', async ({ page }) => {
      const slider = page.locator('#negative-numbers');
      const handles = slider.locator('.rangeHandle');
      const floats = handles.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await handles.nth(0).hover();
      await expect(floats.nth(0)).toContainText('-50.00');

      await handles.nth(1).hover();
      await expect(floats.nth(1)).toContainText('-20.00');
    });

    test('should handle decimal numbers in handle formatter', async ({ page }) => {
      const slider = page.locator('#decimal-numbers');
      const handles = slider.locator('.rangeHandle');
      const floats = handles.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await handles.nth(0).hover();
      await expect(floats.nth(0)).toContainText('10.25');

      await handles.nth(1).hover();
      await expect(floats.nth(1)).toContainText('20.75');
    });

    test('should handle same values in handle formatter', async ({ page }) => {
      const slider = page.locator('#same-values');
      const handles = slider.locator('.rangeHandle');
      const floats = handles.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await expect(floats.nth(0)).toContainText('50.00');
      await expect(floats.nth(1)).toContainText('50.00');
    });

    test('should handle zero values in handle formatter', async ({ page }) => {
      const slider = page.locator('#zero-values');
      const handles = slider.locator('.rangeHandle');
      const floats = handles.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await expect(floats.nth(0)).toContainText('0.00');
      await expect(floats.nth(1)).toContainText('0.00');
    });

    test('should handle extreme values in handle formatter', async ({ page }) => {
      const slider = page.locator('#extreme-values');
      const handles = slider.locator('.rangeHandle');
      const floats = handles.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await handles.nth(0).hover();
      await expect(floats.nth(0)).toContainText('-1000000.00');

      await handles.nth(1).hover();
      await expect(floats.nth(1)).toContainText('1000000.00');
    });

    test('should fallback to formatter when handleFormatter is undefined', async ({ page }) => {
      const slider = page.locator('#undefined-formatter');
      const handle = slider.locator('.rangeHandle');
      const float = handle.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await handle.hover();
      await expect(float).toContainText('x'); // Should show 'x' from the formatter prop
    });
  });

  test.describe('Accessibility Tests', () => {
    test('should announce values via aria-valuetext with basic formatter', async ({ page }) => {
      const slider = page.locator('#aria-basic');
      const handles = slider.locator('.rangeHandle');

      await expect(handles.first()).toHaveAttribute('aria-valuetext', '25.00');
      await expect(handles.nth(1)).toHaveAttribute('aria-valuetext', '75.00');
    });

    test('should announce values via aria-valuetext with HTML formatter', async ({ page }) => {
      const slider = page.locator('#aria-html');
      const handles = slider.locator('.rangeHandle');

      await expect(handles.first()).toHaveAttribute('aria-valuetext', '25');
      await expect(handles.nth(1)).toHaveAttribute('aria-valuetext', '75');
    });

    test('should announce values via aria-valuetext with locale formatter', async ({ page }) => {
      const slider = page.locator('#aria-locale');
      const handles = slider.locator('.rangeHandle');

      await expect(handles.first()).toHaveAttribute('aria-valuetext', '25');
      await expect(handles.nth(1)).toHaveAttribute('aria-valuetext', '75');
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
      const handle = slider.locator('.rangeHandle');
      const float = handle.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await handle.hover();
      await expect(float).toContainText('50.0%');
    });

    test('should format values correctly in vertical mode', async ({ page }) => {
      const slider = page.locator('#vertical-mode');
      const handle = slider.locator('.rangeHandle');
      const float = handle.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await handle.hover();
      await expect(float).toContainText('50.0%');
    });

    test('should handle different min/max ranges correctly', async ({ page }) => {
      const slider = page.locator('#custom-range');
      const handle = slider.locator('.rangeHandle');
      const float = handle.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await handle.hover();
      await expect(float).toContainText('50.0%');
    });

    test('should respect step values in percentage calculations', async ({ page }) => {
      const slider = page.locator('#step-values');
      const handle = slider.locator('.rangeHandle');
      const float = handle.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await handle.hover();
      await expect(float).toContainText('65.0%');
    });
  });

  test.describe('Prefix and Suffix Tests', () => {
    test('should handle prefix and suffix with formatters', async ({ page }) => {
      const slider = page.locator('#dynamic-formatter');
      const handle = slider.locator('.rangeHandle');
      const float = handle.locator('.rangeFloat');
      const addPrefixButton = () => page.locator('#btn_prefix');
      const addSuffixButton = () => page.locator('#btn_suffix');

      await slider.scrollIntoViewIfNeeded();
      // Start with no prefix/suffix
      await handle.hover();
      await expect(float).toContainText('42');

      // Add prefix
      await addPrefixButton().click();
      await expect(float).toContainText('Value: 42');

      // Add suffix
      await addSuffixButton().click();
      await expect(float).toContainText('Value: 42 units');

      // Remove prefix
      await addPrefixButton().click();
      await expect(float).toContainText('42 units');

      // Remove suffix
      await addSuffixButton().click();
      await expect(float).toContainText('42');
    });
  });

  test.describe('Dynamic Formatter Tests', () => {
    test('should update handle formatter when cycling through formatters', async ({ page }) => {
      const slider = page.locator('#dynamic-formatter');
      const handle = slider.locator('.rangeHandle');
      const float = handle.locator('.rangeFloat');
      const cycleButton = page.getByRole('button', { name: /Change Formatter/ });

      await slider.scrollIntoViewIfNeeded();
      // Start with default formatter
      await handle.hover();
      await expect(float).toContainText('42');

      // Cycle to number formatter
      await cycleButton.click();
      await expect(float).toContainText('42.00');

      // Cycle to currency formatter
      await cycleButton.click();
      await expect(float).toContainText('$42.00');

      // Cycle to percent formatter
      await cycleButton.click();
      await expect(float).toContainText('42.0%');
    });

    test('should update handle formatter when value changes', async ({ page }) => {
      const slider = page.locator('#dynamic-formatter');
      const handle = slider.locator('.rangeHandle');
      const float = handle.locator('.rangeFloat');
      const input = page.locator('input[type="number"]');

      await slider.scrollIntoViewIfNeeded();
      await handle.hover();
      await expect(float).toContainText('42');

      // Update value
      await input.fill('55');
      await expect(float).toContainText('55');
    });
  });

  test.describe('Formatter Enable/Disable Tests', () => {
    test('should correctly handle formatter enable/disable', async ({ page }) => {
      const slider = page.locator('#formatter-toggle');
      const handle = slider.locator('.rangeHandle');
      const float = handle.locator('.rangeFloat');
      const toggleButton = page.locator('#btn_toggle');

      await slider.scrollIntoViewIfNeeded();

      // Start with formatter enabled
      await handle.hover();
      await expect(float).toContainText('42.00'); // Should show formatted value

      // Disable formatter
      await toggleButton.click();
      await handle.hover();
      await expect(float).toContainText('42'); // Should show unformatted value

      // Enable formatter
      await toggleButton.click();
      await handle.hover();
      await expect(float).toContainText('42.00'); // Should show formatted value again
    });
  });

  test.describe('Performance Tests', () => {
    test('should handle many handles with formatters', async ({ page }) => {
      const slider = page.locator('#many-handles');
      const handles = slider.locator('.rangeHandle');

      await slider.scrollIntoViewIfNeeded();
      await expect(handles).toHaveCount(5);
      await expect(handles.nth(0)).toHaveAttribute('aria-valuetext', '💴10.00');
      await expect(handles.nth(4)).toHaveAttribute('aria-valuetext', '💴90.00');
    });

    test('should handle heavy formatter without performance issues', async ({ page }) => {
      const slider = page.locator('#heavy-formatter');
      const handle = slider.locator('.rangeHandle');
      const float = handle.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await handle.hover();
      await expect(float).toBeVisible();
      // The heavy formatter should still complete within a reasonable time
      await expect(float).toContainText('.');
      await dragHandleTo(page, slider, handle, 1);
      await expect(float).toContainText('.');
    });

    test('should handle rapid handle movements with formatters', async ({ page }) => {
      const slider = page.locator('#dynamic-formatter');
      const handle = slider.locator('.rangeHandle');
      const float = handle.locator('.rangeFloat');

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
      await expect(float).toBeVisible();
      await expect(float).toContainText('42');
    });
  });

  test.describe('Formatter Inheritance Tests', () => {
    test('handleFormatter inherits from formatter when not specified', async ({ page }) => {
      await page.goto('/test/range-slider/formatters/handle');
      await page.waitForLoadState('networkidle');

      // Get the formatter inheritance test slider
      const slider = page.locator('#formatter-inheritance');
      await slider.scrollIntoViewIfNeeded();
      const handles = slider.locator('.rangeHandle');
      const handle1 = slider.locator('.rangeHandle').first();
      const handle2 = slider.locator('.rangeHandle').nth(1);

      // Check that the handle values are formatted
      await expect(handle1).toHaveAttribute('aria-valuetext', 'Handle 1: 40');
      await expect(handle2).toHaveAttribute('aria-valuetext', 'Handle 2: 60');
      // Move handles to test values
      await dragHandleTo(page, slider, handle1, 0.33);
      await dragHandleTo(page, slider, handle2, 0.66);
      // Check that the handle values are formatted
      await expect(handle1).toHaveAttribute('aria-valuetext', 'Handle 1: 33');
      await expect(handle2).toHaveAttribute('aria-valuetext', 'Handle 2: 66');
    });
  });

  test.describe('Invalid Formatter Tests', () => {
    test('should handle null handleFormatter and fallback to default formatter', async ({ page }) => {
      // Set up console error listener before navigating
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.goto('/test/range-slider/formatters/handle');
      await page.waitForLoadState('networkidle');

      const slider = page.locator('#null-handle-formatter');
      const handle = slider.locator('.rangeHandle');
      const float = handle.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await handle.hover();
      await expect(float).toContainText('50'); // Should show unformatted value

      // Verify console error was logged
      expect(errors).toContain('handleFormatter must be a function');
    });

    test('should handle undefined handleFormatter and fallback to default formatter', async ({ page }) => {
      const slider = page.locator('#undefined-handle-formatter');
      const handle = slider.locator('.rangeHandle');
      const float = handle.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();
      await handle.hover();
      // Check that the handle values are formatted
      await expect(float).toContainText('Handle 1: 50');
    });
  });
});
