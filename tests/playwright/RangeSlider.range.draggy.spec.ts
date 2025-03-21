import { expect, test } from '@playwright/test';
import { dragHandleTo } from './helpers/tools.js';

test.describe('Range Tests', () => {
  test.describe('draggy=false', () => {
    test('range bar should not be draggable', async ({ page }) => {
      await page.goto('/test/range-slider/range/draggy');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#not-draggy');
      const handles = slider.locator('.rangeHandle');
      const range = slider.locator('.rangeBar');

      await expect(slider).not.toHaveClass(/\brsDrag\b/);
      await expect(range).toBeAttached();
      await expect(range).toHaveCSS('translate', '400px');
      await expect(range).toHaveCSS('width', '200px');

      // Try to drag the range bar
      const rangeBounds = await range.boundingBox();
      if (!rangeBounds) throw new Error('Could not get range bounds');

      // Click in middle of range and drag to 80%
      await dragHandleTo(page, slider, range, 0.8);

      // If the range is not draggy, the slider will revert to click-to-move the closest handle
      // and the closest handle would be the first handle, so we expect the first handle to move to 60%
      // while the second handle stays at it's original position
      await expect(handles.nth(0)).toHaveCSS('translate', '600px');
      await expect(handles.nth(1)).toHaveCSS('translate', '600px');
    });
  });

  test.describe('draggy=true', () => {
    test('range bar should be draggable and maintain handle spacing', async ({ page }) => {
      await page.goto('/test/range-slider/range/draggy');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#draggy');
      const handles = slider.locator('.rangeHandle');
      const range = slider.locator('.rangeBar');

      await expect(slider).toHaveClass(/\brsDrag\b/);
      await expect(range).toBeAttached();
      await expect(range).toHaveCSS('translate', '400px');
      await expect(range).toHaveCSS('width', '200px');

      const sliderBounds = await slider.boundingBox();
      if (!sliderBounds) throw new Error('Could not get range bounds');

      // Initial handle spacing is 20% (200px)
      const initialSpacing = 200;

      // Click in middle of range and drag to 80%
      await dragHandleTo(page, slider, range, 0.8);

      // Both handles should have moved while maintaining spacing
      await expect(handles.nth(0)).toHaveCSS('translate', '700px');
      await expect(handles.nth(1)).toHaveCSS('translate', '900px');
      await expect(range).toHaveCSS('translate', '700px');
      await expect(range).toHaveCSS('width', '200px');

      // Drag range back to left
      await dragHandleTo(page, slider, range, 0.2);

      // Both handles should have moved while maintaining spacing
      await expect(handles.nth(0)).toHaveCSS('translate', '100px');
      await expect(handles.nth(1)).toHaveCSS('translate', '300px');
      await expect(range).toHaveCSS('translate', '100px');
      await expect(range).toHaveCSS('width', '200px');
    });

    test('handles should start to converge when dragged to range limits', async ({ page }) => {
      await page.goto('/test/range-slider/range/draggy');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#draggy');
      const handles = slider.locator('.rangeHandle');
      const range = slider.locator('.rangeBar');

      // Initial position check
      await expect(handles.nth(0)).toHaveCSS('translate', '400px');
      await expect(handles.nth(1)).toHaveCSS('translate', '600px');

      // Drag to 95%
      await dragHandleTo(page, slider, range, 0.95);
      // The gap should have collapsed to 150px
      await expect(handles.nth(0)).toHaveCSS('translate', '850px');
      await expect(handles.nth(1)).toHaveCSS('translate', '1000px');
      // reset the handles
      await dragHandleTo(page, slider, handles.nth(0), 0.4);
      await dragHandleTo(page, slider, handles.nth(1), 0.6);
      await expect(handles.nth(0)).toHaveCSS('translate', '400px');
      await expect(handles.nth(1)).toHaveCSS('translate', '600px');
      // Drag to 100%
      await dragHandleTo(page, slider, range, 1.05);
      // The gap should have collapsed to 50px
      await expect(handles.nth(0)).toHaveCSS('translate', '950px');
      await expect(handles.nth(1)).toHaveCSS('translate', '1000px');

      // reset the handles
      await dragHandleTo(page, slider, handles.nth(0), 0.4);
      await dragHandleTo(page, slider, handles.nth(1), 0.6);
      await expect(handles.nth(0)).toHaveCSS('translate', '400px');
      await expect(handles.nth(1)).toHaveCSS('translate', '600px');
      // Drag way past left limit (-30%)
      await dragHandleTo(page, slider, range, -0.3);
      // Handles should maintain 200px spacing at left limit
      await expect(handles.nth(0)).toHaveCSS('translate', '0px');
      await expect(handles.nth(1)).toHaveCSS('translate', '0px');
    });

    test('keyboard controls should work normally with draggy enabled', async ({ page }) => {
      await page.goto('/test/range-slider/range/draggy');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#draggy');
      const handles = slider.locator('.rangeHandle');

      // Focus first handle
      await handles.nth(0).focus();

      // Arrow right should move handle right
      await page.keyboard.press('ArrowRight');
      await expect(handles.nth(0)).toHaveCSS('translate', '410px');
      await expect(handles.nth(1)).toHaveCSS('translate', '600px');

      // Arrow left should move handle left
      await page.keyboard.press('ArrowLeft');
      await expect(handles.nth(0)).toHaveCSS('translate', '400px');
      await expect(handles.nth(1)).toHaveCSS('translate', '600px');

      // Page up should move handle by larger increment
      await page.keyboard.press('PageUp');
      await expect(handles.nth(0)).toHaveCSS('translate', '500px');
      await expect(handles.nth(1)).toHaveCSS('translate', '600px');
    });

    test('clicking handles should work normally with draggy enabled', async ({ page }) => {
      await page.goto('/test/range-slider/range/draggy');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#draggy');
      const handles = slider.locator('.rangeHandle');
      const range = slider.locator('.rangeBar');

      // First drag the range to a new position
      await dragHandleTo(page, slider, range, 0.8);
      await expect(handles.nth(0)).toHaveCSS('translate', '700px');
      await expect(handles.nth(1)).toHaveCSS('translate', '900px');

      // Then drag individual handles
      await dragHandleTo(page, slider, handles.nth(0), 0.4);
      await expect(handles.nth(0)).toHaveCSS('translate', '400px');
      await expect(handles.nth(1)).toHaveCSS('translate', '900px');

      await dragHandleTo(page, slider, handles.nth(1), 0.6);
      await expect(handles.nth(0)).toHaveCSS('translate', '400px');
      await expect(handles.nth(1)).toHaveCSS('translate', '600px');
    });

    test('should respect rangeGapMin/Max when dragging range', async ({ page }) => {
      await page.goto('/test/range-slider/range/draggy');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#draggy-gaps');
      const handles = slider.locator('.rangeHandle');
      const range = slider.locator('.rangeBar');

      // Set initial handle positions with minimum gap
      await dragHandleTo(page, slider, handles.nth(0), 0.4); // 40%
      await dragHandleTo(page, slider, handles.nth(1), 0.5); // 50% (minimum gap of 10%)
      await expect(handles.nth(0)).toHaveCSS('translate', '400px');
      await expect(handles.nth(1)).toHaveCSS('translate', '500px');

      // Try to drag range in a way that would violate minimum gap
      await dragHandleTo(page, slider, range, 1.2);

      // Handles should maintain minimum gap
      await expect(handles.nth(0)).toHaveCSS('translate', '900px');
      await expect(handles.nth(1)).toHaveCSS('translate', '1000px');

      // Try to drag range in a way that would violate maximum gap
      await dragHandleTo(page, slider, range, -0.2);

      // Handles should maintain maximum gap
      await expect(handles.nth(0)).toHaveCSS('translate', '0px');
      await expect(handles.nth(1)).toHaveCSS('translate', '100px');
    });

    test('should maintain spacing during rapid drags', async ({ page }) => {
      await page.goto('/test/range-slider/range/draggy');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#draggy');
      const handles = slider.locator('.rangeHandle');
      const range = slider.locator('.rangeBar');

      const sliderBounds = await slider.boundingBox();
      if (!sliderBounds) throw new Error('Could not get slider bounds');

      // Perform rapid drag movements
      await page.mouse.move(sliderBounds.x + sliderBounds.width * 0.5, sliderBounds.y + sliderBounds.height / 2);
      await page.mouse.down();

      // Quick movements back and forth
      for (const position of [0.8, 0.2, 0.6, 0.4, 0.9, 0.1, 1.5, -0.5, 0.5]) {
        await page.mouse.move(
          sliderBounds.x + sliderBounds.width * position,
          sliderBounds.y + sliderBounds.height / 2,
          { steps: 5 } // Make the movement very quick
        );
      }
      await expect(handles.nth(0)).toHaveCSS('translate', '400px');
      await expect(handles.nth(1)).toHaveCSS('translate', '600px');

      await page.mouse.up();
    });
  });

  test.describe('draggy toggle button', () => {
    test('should toggle draggy behavior when clicked', async ({ page }) => {
      await page.goto('/test/range-slider/range/draggy');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#draggy-toggle');
      const handles = slider.locator('.rangeHandle');
      const range = slider.locator('.rangeBar');
      const toggleButton = page.getByRole('button', { name: 'Toggle draggy' });

      const rangeBounds = await range.boundingBox();
      if (!rangeBounds) throw new Error('Could not get range bounds');

      // Initially draggy=false, range should not be draggable
      await dragHandleTo(page, slider, range, 0.8);

      // If the range is not draggy, the slider will revert to click-to-move the closest handle
      // and the closest handle would be the first handle, so we expect the first handle to move to 60%
      // while the second handle stays at it's original position
      await expect(handles.nth(0)).toHaveCSS('translate', '600px');
      await expect(handles.nth(1)).toHaveCSS('translate', '600px');

      // Toggle draggy to true
      await toggleButton.click();

      // reset the first handle to 40%
      await dragHandleTo(page, slider, handles.nth(0), 0.4);
      await expect(handles.nth(0)).toHaveCSS('translate', '400px');

      // Now range should be draggable
      await dragHandleTo(page, slider, range, 0.8);

      // Both handles should have moved while maintaining spacing
      await expect(handles.nth(0)).toHaveCSS('translate', '700px');
      await expect(handles.nth(1)).toHaveCSS('translate', '900px');
    });
  });
});
