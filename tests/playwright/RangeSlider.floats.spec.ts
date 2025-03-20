import { expect, test } from '@playwright/test';
import { dragHandleTo } from './helpers/tools.js';

test.describe('Float Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/range-slider/floats');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Basic Float Tests', () => {
    test('should show/hide float based on prop', async ({ page }) => {
      const withFloat = page.locator('#basic-float .rangeFloat');
      const withoutFloat = page.locator('#basic-no-float .rangeFloat');

      await expect(withFloat).toBeVisible();
      await expect(withoutFloat).not.toBeVisible();
    });

    test('should position float correctly above the handle', async ({ page }) => {
      const slider = page.locator('#basic-float');
      const handle = slider.locator('.rangeHandle').first();
      const float = handle.locator('.rangeFloat');

      await handle.hover();
      const floatBox = await float.boundingBox();
      const handleBox = await handle.boundingBox();

      // Float should be positioned above the handle in normal mode
      expect(floatBox!.y).toBeLessThan(handleBox!.y);
    });

    test('float should update when handle moves', async ({ page }) => {
      const slider = page.locator('#basic-float');
      const handle = slider.locator('.rangeHandle');
      const float = handle.locator('.rangeFloat');

      await dragHandleTo(page, slider, handle, 0.75);
      await expect(float).toContainText('75');
    });
  });

  test.describe('Basic RangeFloat Tests', () => {
    test('should show/hide rangeFloat based on prop', async ({ page }) => {
      const withFloat = page.locator('#basic-range-float .rangeBar .rangeFloat');
      const withoutFloat = page.locator('#basic-no-range-float .rangeBar .rangeFloat');

      await expect(withFloat).toBeVisible();
      await expect(withoutFloat).not.toBeVisible();
    });

    test('rangeFloat should update when handles move', async ({ page }) => {
      const slider = page.locator('#basic-range-float');
      const handles = slider.locator('.rangeHandle');
      const rangeFloat = slider.locator('.rangeBar .rangeFloat');

      await dragHandleTo(page, slider, handles.nth(0), 0.3);
      await dragHandleTo(page, slider, handles.nth(1), 0.8);
      await expect(rangeFloat).toContainText('30 - 80');
    });

    test('rangeFloat should show during range drag', async ({ page }) => {
      const slider = page.locator('#basic-range-float');
      const rangeBar = slider.locator('.rangeBar');
      const rangeFloat = rangeBar.locator('.rangeFloat');

      await expect(rangeFloat).toHaveCSS('opacity', '0');
      const box = await rangeBar.boundingBox();
      await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
      await page.mouse.down();
      await expect(rangeFloat).toHaveCSS('opacity', '1');
      await page.mouse.up();
    });

    test('rangeFloat should show when slider is focused', async ({ page }) => {
      const slider = page.locator('#focus-float');
      const rangeFloat = slider.locator('.rangeBar .rangeFloat');
      const handle = slider.locator('.rangeHandle').first();

      await expect(rangeFloat).toHaveCSS('opacity', '0');
      await handle.focus();
      await expect(rangeFloat).toHaveCSS('opacity', '1');
    });
  });

  test.describe('Formatted Floats', () => {
    test('should respect prefix and suffix', async ({ page }) => {
      const slider = page.locator('#formatted-float');
      const floats = slider.locator('.rangeFloat');

      await expect(floats.nth(0)).toContainText('$40%');
      await expect(floats.nth(1)).toContainText('$60%');
      await expect(floats.nth(2)).toContainText('$40% - $60%');
    });

    test('should use custom formatters', async ({ page }) => {
      const slider = page.locator('#custom-formatted');
      const handle = slider.locator('.rangeHandle').first();
      const float = handle.locator('.rangeFloat');
      const rangeFloat = slider.locator('.rangeBar .rangeFloat');

      await expect(float).toContainText('$40.00');
      await expect(rangeFloat).toContainText('From: $40.00 to $60.00');
    });

    test('should handle HTML in formatters', async ({ page }) => {
      const slider = page.locator('#html-formatted');
      const handle = slider.locator('.rangeHandle').first();
      const float = handle.locator('.rangeFloat');
      const rangeFloat = slider.locator('.rangeBar .rangeFloat');

      await expect(float).toContainText('40');
      await expect(float.locator('strong')).toBeVisible();
      await expect(rangeFloat).toContainText('40 to 60');
      await expect(rangeFloat.locator('strong')).toBeVisible();
      await expect(rangeFloat.locator('em')).toBeVisible();
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle large numbers in floats', async ({ page }) => {
      const slider = page.locator('#large-numbers');
      const floats = slider.locator('.rangeFloat');

      await expect(floats.nth(0)).toContainText('1000000');
      await expect(floats.nth(1)).toContainText('2000000');
      await expect(floats.nth(2)).toContainText('1000000 - 2000000');
    });

    test('should handle negative numbers in floats', async ({ page }) => {
      const slider = page.locator('#negative-numbers');
      const floats = slider.locator('.rangeFloat');

      await expect(floats.nth(0)).toContainText('-50');
      await expect(floats.nth(1)).toContainText('-20');
      await expect(floats.nth(2)).toContainText('-50 - -20');
    });

    test('should handle decimal numbers in floats', async ({ page }) => {
      const slider = page.locator('#decimal-numbers');
      const handles = slider.locator('.rangeHandle');
      const floats = slider.locator('.rangeFloat');

      await expect(floats.nth(0)).toContainText('10.25');
      await expect(floats.nth(1)).toContainText('20.75');
      await expect(floats.nth(2)).toContainText('10.25 - 20.75');

      await dragHandleTo(page, slider, handles.nth(1), 0.525);
      await expect(floats.nth(0)).toContainText('10.25');
      await expect(floats.nth(1)).toContainText('52.5');
      await expect(floats.nth(2)).toContainText('10.25 - 52.5');
    });
  });

  test.describe('Float + RangeFloat Interactions', () => {
    test('should maintain correct z-index stacking', async ({ page }) => {
      const slider = page.locator('#float-z-index');
      const handle = slider.locator('.rangeHandle').first();
      const float = handle.locator('.rangeFloat');
      const rangeFloat = slider.locator('.rangeBar .rangeFloat');

      await slider.scrollIntoViewIfNeeded();

      // Hover handle
      await handle.hover();

      // Handle float should be above range float
      const floatZIndex = parseInt(await float.evaluate((el) => window.getComputedStyle(el).zIndex));
      const rangeFloatZIndex = parseInt(await rangeFloat.evaluate((el) => window.getComputedStyle(el).zIndex));
      expect(floatZIndex).toBeGreaterThan(rangeFloatZIndex);
    });

    test('should handle hover interactions between float and rangeFloat', async ({ page }) => {
      const slider = page.locator('#float-interactions');
      const handles = slider.locator('.rangeHandle');
      const floats = slider.locator('.rangeFloat');
      const rangeBar = slider.locator('.rangeBar');
      const rangeFloat = rangeBar.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();

      await handles.nth(0).hover();
      await expect(floats.nth(0)).toHaveCSS('opacity', '1');
      await expect(floats.nth(1)).toHaveCSS('opacity', '0');
      await expect(rangeFloat).toHaveCSS('opacity', '0');

      await handles.nth(1).hover();
      await expect(floats.nth(0)).toHaveCSS('opacity', '0');
      await expect(floats.nth(1)).toHaveCSS('opacity', '1');
      await expect(rangeFloat).toHaveCSS('opacity', '0');

      await rangeBar.hover();
      await expect(floats.nth(0)).toHaveCSS('opacity', '0');
      await expect(floats.nth(1)).toHaveCSS('opacity', '0');
      await expect(rangeFloat).toHaveCSS('opacity', '1');
    });

    test('should handle focus/active states and classes for floats', async ({ page }) => {
      const slider = page.locator('#float-interactions');
      const handles = slider.locator('.rangeHandle');
      const floats = slider.locator('.rangeFloat');
      const rangeBar = slider.locator('.rangeBar');
      const rangeFloat = rangeBar.locator('.rangeFloat');

      await slider.scrollIntoViewIfNeeded();

      // Focus first handle
      await handles.nth(0).click();
      await expect(slider).toHaveClass(/\brsFocus\b/);
      await expect(handles.nth(0)).toHaveClass(/\brsActive\b/);
      await expect(floats.nth(0)).toHaveCSS('opacity', '1');
      await expect(floats.nth(1)).toHaveCSS('opacity', '0');
      await expect(rangeFloat).toHaveCSS('opacity', '1');

      // Focus second handle
      await handles.nth(1).click();
      await expect(slider).toHaveClass(/\brsFocus\b/);
      await expect(handles.nth(0)).not.toHaveClass(/\brsActive\b/);
      await expect(handles.nth(1)).toHaveClass(/\brsActive\b/);
      await expect(floats.nth(0)).toHaveCSS('opacity', '0');
      await expect(floats.nth(1)).toHaveCSS('opacity', '1');
      await expect(rangeFloat).toHaveCSS('opacity', '1');

      // Focus range bar
      await rangeBar.click();
      await expect(slider).toHaveClass(/\brsFocus\b/);
      await expect(floats.nth(0)).toHaveCSS('opacity', '0');
      await expect(floats.nth(1)).toHaveCSS('opacity', '0');
      await expect(rangeFloat).toHaveCSS('opacity', '1');
    });
  });

  test.describe('Orientation Tests', () => {
    test('should position float correctly in vertical mode', async ({ page }) => {
      const slider = page.locator('#vertical-float');
      const handle = slider.locator('.rangeHandle').first();
      const float = handle.locator('.rangeFloat');

      await handle.hover();
      const floatBox = await float.boundingBox();
      const handleBox = await handle.boundingBox();

      // Float should be positioned to the left of the handle in vertical mode
      expect(floatBox!.x).toBeLessThan(handleBox!.x);
    });

    test('should position rangeFloat correctly in vertical mode', async ({ page }) => {
      const slider = page.locator('#vertical-range-float');
      const rangeBar = slider.locator('.rangeBar');
      const rangeFloat = rangeBar.locator('.rangeFloat');

      const rangeFloatBox = await rangeFloat.boundingBox();
      const rangeBarBox = await rangeBar.boundingBox();

      // RangeFloat should be positioned to the left of the range bar in vertical mode
      expect(rangeFloatBox!.x).toBeLessThan(rangeBarBox!.x);
    });

    test('should position float correctly in reversed mode', async ({ page }) => {
      const slider = page.locator('#reversed-float');
      const handle = slider.locator('.rangeHandle').first();
      const float = handle.locator('.rangeFloat');

      await handle.hover();
      const floatBox = await float.boundingBox();
      const handleBox = await handle.boundingBox();

      // Float should be above the handle in reversed mode
      expect(floatBox!.y).toBeLessThan(handleBox!.y);
    });

    test('should position float correctly in reversed vertical mode', async ({ page }) => {
      const slider = page.locator('#reversed-vertical');
      const handle = slider.locator('.rangeHandle').first();
      const float = handle.locator('.rangeFloat');

      await handle.hover();
      const floatBox = await float.boundingBox();
      const handleBox = await handle.boundingBox();

      // Float should be to the right of handle in reversed vertical mode
      expect(floatBox!.x).toBeLessThan(handleBox!.x);
    });
  });

  test.describe('Accessibility Tests', () => {
    test('should announce values via aria-valuetext', async ({ page }) => {
      const slider = page.locator('#a11y-test');
      const handles = slider.locator('.rangeHandle');
      const rangeBar = slider.locator('.rangeBar');

      await expect(handles.first()).toHaveAttribute('aria-valuetext', '30');
      await expect(handles.nth(1)).toHaveAttribute('aria-valuetext', '70');
      await expect(rangeBar).not.toHaveAttribute('aria-valuetext');

      // Move handle and verify aria-valuetext updates
      await dragHandleTo(page, slider, handles.first(), 0.4);
      await expect(handles.first()).toHaveAttribute('aria-valuetext', '40');
      await expect(rangeBar).not.toHaveAttribute('aria-valuetext');
    });

    test('should respect aria labels', async ({ page }) => {
      const slider = page.locator('#a11y-test');
      const handles = slider.locator('.rangeHandle');

      await expect(handles.first()).toHaveAttribute('aria-label', 'First handle');
      await expect(handles.nth(1)).toHaveAttribute('aria-label', 'Second handle');
    });

    test('should support keyboard navigation with floats', async ({ page }) => {
      const slider = page.locator('#a11y-test');
      const handle = slider.locator('.rangeHandle').first();
      const float = handle.locator('.rangeFloat');

      await handle.focus();
      await expect(float).toBeVisible();

      // Move with arrow keys
      await page.keyboard.press('ArrowRight');
      await expect(handle).toHaveAttribute('aria-valuenow', '31');
      await expect(float).toContainText('31');

      // Move with larger steps
      await page.keyboard.down('Shift');
      await page.keyboard.press('ArrowRight');
      await expect(handle).toHaveAttribute('aria-valuenow', '41');
      await expect(float).toContainText('41');
      await page.keyboard.up('Shift');
    });
  });

  test.describe('Dynamic Property Toggling', () => {
    test('should toggle float visibility during interaction', async ({ page }) => {
      const slider = page.locator('#dynamic-float');
      const handle = slider.locator('.rangeHandle').first();
      const float = handle.locator('.rangeFloat');
      const toggleFloat = page.getByRole('button', { name: /Toggle float/ });

      // Start with float off
      await expect(float).toBeHidden();

      // Turn float on during hover
      await handle.hover();
      await toggleFloat.click();
      await expect(float).toBeVisible();

      // Turn float off during hover
      await toggleFloat.click();
      await expect(float).toBeHidden();
    });

    test('should toggle rangeFloat visibility during drag', async ({ page }) => {
      const slider = page.locator('#dynamic-float');
      const rangeBar = slider.locator('.rangeBar');
      const rangeFloat = rangeBar.locator('.rangeFloat');
      const toggleRangeFloat = page.getByRole('button', { name: /Toggle rangeFloat/ });

      // Start with rangeFloat off
      await expect(rangeFloat).toBeHidden();

      // Turn rangeFloat on during hover
      await rangeBar.hover();
      await toggleRangeFloat.click();
      await expect(rangeFloat).toBeVisible();

      // Turn rangeFloat off during hover
      await toggleRangeFloat.click();
      await expect(rangeFloat).toBeHidden();
    });

    test('should handle rapid toggling without visual glitches', async ({ page }) => {
      const slider = page.locator('#dynamic-float');
      const handle = slider.locator('.rangeHandle').first();
      const float = handle.locator('.rangeFloat');
      const toggleFloat = page.getByRole('button', { name: /Toggle float/ });

      await handle.hover();

      // Rapid toggling
      for (let i = 0; i < 5; i++) {
        await toggleFloat.click();
        await expect(float).toBeVisible();
        await toggleFloat.click();
        await expect(float).toBeHidden();
      }
    });

    test('should maintain float state when changing orientation', async ({ page }) => {
      const slider = page.locator('#dynamic-float');
      const handle = slider.locator('.rangeHandle').first();
      const float = handle.locator('.rangeFloat');
      const toggleFloat = page.getByRole('button', { name: /Toggle float/ });
      const toggleVertical = page.getByRole('button', { name: /Toggle vertical/ });

      // Enable float
      await toggleFloat.click();
      await handle.hover();
      await expect(float).toBeVisible();

      // Change orientation
      await toggleVertical.click();
      await handle.hover();
      await expect(float).toBeVisible();
    });
  });
});
