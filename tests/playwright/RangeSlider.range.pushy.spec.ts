import { expect, test } from '@playwright/test';
import { dragHandleTo } from './helpers/tools.js';

test.describe('Range Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/range-slider/range/pushy');
    await page.waitForLoadState('networkidle');
  });

  test.describe('pushy=false', () => {
    test('handles should block each other', async ({ page }) => {
      const slider = page.locator('#not-pushy');
      const handles = slider.locator('.rangeHandle');
      const range = slider.locator('.rangeBar');

      await expect(range).toBeAttached();
      await expect(range).toHaveCSS('translate', '400px');
      await expect(range).toHaveCSS('width', '200px');

      await slider.scrollIntoViewIfNeeded();
      await slider.isVisible();
      const sliderBounds = await slider.boundingBox();
      if (!sliderBounds) throw new Error('Could not get slider bounds');

      // Drag the handle to 90%
      await dragHandleTo(page, slider, handles.nth(0), 0.9);

      // expect the first handle to be stuck at the second handle (75%)
      await expect(handles.nth(0)).toHaveCSS('translate', '600px');
      await expect(handles.nth(1)).toHaveCSS('translate', '600px');
      await expect(range).toHaveCSS('translate', '600px');
      await expect(range).toHaveCSS('width', '0px');

      // reset the first handle to 40% and should not move the second handle
      await page.mouse.click(sliderBounds.x + sliderBounds.width * 0.4, sliderBounds.y + sliderBounds.height / 2);
      await expect(handles.nth(0)).toHaveCSS('translate', '400px');
      await expect(handles.nth(1)).toHaveCSS('translate', '600px');
      await expect(range).toHaveCSS('translate', '400px');
      await expect(range).toHaveCSS('width', '200px');

      // Drag the second handle to 10%
      await dragHandleTo(page, slider, handles.nth(1), 0.1);

      // expect the second handle to be stuck at the first handle (40%)
      await expect(handles.nth(0)).toHaveCSS('translate', '400px');
      await expect(handles.nth(1)).toHaveCSS('translate', '400px');
      await expect(range).toHaveCSS('translate', '400px');
      await expect(range).toHaveCSS('width', '0px');
    });
  });

  test.describe('pushy=true', () => {
    test('handles should push each other', async ({ page }) => {
      const slider = page.locator('#pushy');
      const handles = slider.locator('.rangeHandle');
      const range = slider.locator('.rangeBar');

      await expect(range).toBeAttached();
      await expect(range).toHaveCSS('translate', '400px');
      await expect(range).toHaveCSS('width', '200px');

      await slider.scrollIntoViewIfNeeded();
      await slider.isVisible();
      const sliderBounds = await slider.boundingBox();
      if (!sliderBounds) throw new Error('Could not get slider bounds');

      // Drag the handle to 90%
      await dragHandleTo(page, slider, handles.nth(0), 1);

      // expect the first handle to push the second handle to 100%
      await expect(handles.nth(0)).toHaveCSS('translate', '1000px');
      await expect(handles.nth(1)).toHaveCSS('translate', '1000px');
      await expect(range).toHaveCSS('translate', '1000px');
      await expect(range).toHaveCSS('width', '0px');

      // reset the first handle to 40% and should not move the second handle
      await page.mouse.click(sliderBounds.x + sliderBounds.width * 0.4, sliderBounds.y + sliderBounds.height / 2);
      await expect(handles.nth(0)).toHaveCSS('translate', '400px');
      await expect(handles.nth(1)).toHaveCSS('translate', '1000px');
      await expect(range).toHaveCSS('translate', '400px');
      await expect(range).toHaveCSS('width', '600px');

      // Drag the handle to 0%
      await dragHandleTo(page, slider, handles.nth(1), 0);

      // expect the second handle to push the first handle to 0%
      await expect(handles.nth(0)).toHaveCSS('translate', '0px');
      await expect(handles.nth(1)).toHaveCSS('translate', '0px');
      await expect(range).toHaveCSS('translate', '0px');
      await expect(range).toHaveCSS('width', '0px');
    });

    test('should handle decimal steps correctly', async ({ page }) => {
      const slider = page.locator('#decimal-steps');
      const handles = slider.locator('.rangeHandle');
      const range = slider.locator('.rangeBar');

      // Initial state
      await slider.scrollIntoViewIfNeeded();
      await expect(range).toBeVisible();
      await expect(range).toHaveCSS('translate', '400px');
      await expect(range).toHaveCSS('width', '200px');

      // correctly pushed first handle to 0%
      await dragHandleTo(page, slider, handles.nth(1), 0);
      await expect(handles.nth(0)).toHaveCSS('translate', '0px');
      await expect(handles.nth(1)).toHaveCSS('translate', '0px');
      await expect(range).toHaveCSS('translate', '0px');
      await expect(range).toHaveCSS('width', '0px');

      // reset second handle to 0.42;
      const sliderBounds = await slider.boundingBox();
      if (!sliderBounds) throw new Error('Could not get slider bounds');
      await page.mouse.click(sliderBounds.x + sliderBounds.width * 0.42, sliderBounds.y + sliderBounds.height / 2);
      await expect(handles.nth(1)).toHaveCSS('translate', '420px');

      // correctly pushed second handle to 100%
      await dragHandleTo(page, slider, handles.nth(0), 1.05);
      await expect(handles.nth(0)).toHaveCSS('translate', '1000px');
      await expect(handles.nth(1)).toHaveCSS('translate', '1000px');
      await expect(range).toHaveCSS('translate', '1000px');
      await expect(range).toHaveCSS('width', '0px');

      // reset handles to 0, 0.05
      await page.mouse.click(sliderBounds.x + 0, sliderBounds.y + sliderBounds.height / 2);
      await expect(handles.nth(0)).toHaveCSS('translate', '0px');
      await dragHandleTo(page, slider, handles.nth(1), 0.05);
      await expect(handles.nth(1)).toHaveCSS('translate', '50px');
      await expect(range).toHaveCSS('translate', '0px');
      await expect(range).toHaveCSS('width', '50px');

      // test using the first handle to push the second handle to various decimal positions
      const testPositions = [0.1, 0.25, 0.5, 0.3, 0.75, 0.05, 0.9, 1, 0.9];
      await page.mouse.move(sliderBounds.x + 0, sliderBounds.y + sliderBounds.height / 2);
      await page.mouse.down();
      await expect(handles.nth(0)).toHaveCSS('translate', '0px');
      await expect(handles.nth(1)).toHaveCSS('translate', '50px');
      let previousSecondHandlePos = 0; // Starting position of second handle
      for (const pos of testPositions) {
        await page.mouse.move(sliderBounds.x + sliderBounds.width * pos, sliderBounds.y + sliderBounds.height / 2);
        const newSecondHandlePos = pos * 1000;
        // First handle always moves to new position
        await expect(handles.nth(0)).toHaveCSS('translate', `${newSecondHandlePos}px`);
        // Second handle only moves if new position is greater than its current position
        await expect(handles.nth(1)).toHaveCSS(
          'translate',
          `${Math.max(previousSecondHandlePos, newSecondHandlePos)}px`
        );
        await expect(range).toHaveCSS('translate', `${newSecondHandlePos}px`);
        await expect(range).toHaveCSS(
          'width',
          `${Math.max(previousSecondHandlePos, newSecondHandlePos) - newSecondHandlePos}px`
        );
        previousSecondHandlePos = Math.max(previousSecondHandlePos, newSecondHandlePos);
      }
      await page.mouse.up();
      await expect(handles.nth(0)).toHaveCSS('translate', '900px');
      await expect(handles.nth(1)).toHaveCSS('translate', '1000px');
      await expect(range).toHaveCSS('translate', '900px');
      await expect(range).toHaveCSS('width', '100px');
    });

    test('should handle vertical orientation', async ({ page }) => {
      const slider = page.locator('#vertical-pushy');
      const handles = slider.locator('.rangeHandle');
      const range = slider.locator('.rangeBar');

      // Initial state
      // vertical sliders are 200px total height, and they are default reversed
      // so the 'lower' handle is actually the second handle, now...
      // and, max is at top, so higher pixel values correspond to lower values;
      await slider.scrollIntoViewIfNeeded();
      await page.mouse.wheel(0, 20);
      await expect(range).toBeVisible();
      await expect(range).toHaveCSS('translate', '0px 80px');
      await expect(range).toHaveCSS('height', '40px');

      // correctly pushed first handle to 0%
      await dragHandleTo(page, slider, handles.nth(0), 0, true);
      await expect(handles.nth(1)).toHaveCSS('translate', '0px');
      await expect(handles.nth(0)).toHaveCSS('translate', '0px');
      await expect(range).toHaveCSS('translate', '0px');
      await expect(range).toHaveCSS('height', '0px');

      // reset second handle to 0.40;
      const sliderBounds = await slider.boundingBox();
      if (!sliderBounds) throw new Error('Could not get slider bounds');
      await page.mouse.click(sliderBounds.x + sliderBounds.width / 2, sliderBounds.y + sliderBounds.height * 0.4);
      await expect(handles.nth(0)).toHaveCSS('translate', '0px 80px');

      // correctly pushed second handle to 100%
      await dragHandleTo(page, slider, handles.nth(1), 1, true);
      await expect(handles.nth(0)).toHaveCSS('translate', '0px 200px');
      await expect(handles.nth(1)).toHaveCSS('translate', '0px 200px');
      await expect(range).toHaveCSS('translate', '0px 200px');
      await expect(range).toHaveCSS('height', '0px');

      // reset handles to 0, 0.05
      await page.mouse.click(sliderBounds.x + sliderBounds.width / 2, sliderBounds.y + 0);
      await expect(handles.nth(1)).toHaveCSS('translate', '0px');
      await dragHandleTo(page, slider, handles.nth(0), 0.05, true);
      await expect(handles.nth(0)).toHaveCSS('translate', '0px 10px');
      await expect(range).toHaveCSS('translate', '0px');
      await expect(range).toHaveCSS('height', '10px');

      // test using the first handle to push the second handle to various decimal positions
      const testPositions = [0.1, 0.25, 0.5, 0.3, 0.75, 0.05, 0.9, 1, 0.9];
      await page.mouse.move(sliderBounds.x + sliderBounds.width / 2, sliderBounds.y + 0);
      await page.mouse.down();
      await expect(handles.nth(1)).toHaveCSS('translate', '0px');
      await expect(handles.nth(0)).toHaveCSS('translate', '0px 10px');
      let previousSecondHandlePos = 10; // Starting position of second handle
      for (const pos of testPositions) {
        await page.mouse.move(sliderBounds.x + sliderBounds.width / 2, sliderBounds.y + sliderBounds.height * pos);
        const newSecondHandlePos = pos * 200; // Vertical slider is 200px height
        // First handle always moves to new position
        await expect(handles.nth(1)).toHaveCSS('translate', `0px ${newSecondHandlePos}px`);
        // Second handle only moves if new position is greater than its current position
        await expect(handles.nth(0)).toHaveCSS(
          'translate',
          `0px ${Math.max(previousSecondHandlePos, newSecondHandlePos)}px`
        );
        await expect(range).toHaveCSS('translate', `0px ${newSecondHandlePos}px`);
        await expect(range).toHaveCSS(
          'height',
          `${Math.max(previousSecondHandlePos, newSecondHandlePos) - newSecondHandlePos}px`
        );
        previousSecondHandlePos = Math.max(previousSecondHandlePos, newSecondHandlePos);
      }
      await page.mouse.up();
      await expect(handles.nth(1)).toHaveCSS('translate', '0px 180px');
      await expect(handles.nth(0)).toHaveCSS('translate', '0px 200px');
      await expect(range).toHaveCSS('translate', '0px 180px');
      await expect(range).toHaveCSS('height', '20px');
    });

    test('should handle negative values', async ({ page }) => {
      const slider = page.locator('#negative-values');
      const handles = slider.locator('.rangeHandle');
      const range = slider.locator('.rangeBar');

      // Initial state
      await slider.scrollIntoViewIfNeeded();
      await expect(range).toBeAttached();
      await expect(range).toHaveCSS('translate', '800px');
      await expect(range).toHaveCSS('width', '200px');

      const sliderBounds = await slider.boundingBox();
      if (!sliderBounds) throw new Error('Could not get slider bounds');

      // Test pushing to various positions
      const testPositions = [0.7, 0.5, 0.3, 0];
      await page.mouse.move(sliderBounds.x + sliderBounds.width, sliderBounds.y + sliderBounds.height / 2);
      await page.mouse.down();
      for (const pos of testPositions) {
        await page.mouse.move(sliderBounds.x + sliderBounds.width * pos, sliderBounds.y + sliderBounds.height / 2);
        await expect(handles.nth(1)).toHaveCSS('translate', `${pos * 1000}px`);
        await expect(handles.nth(0)).toHaveCSS('translate', `${pos * 1000}px`);
        await expect(range).toHaveCSS('translate', `${pos * 1000}px`);
        await expect(range).toHaveCSS('width', '0px');
      }
      await page.mouse.up();
      await expect(handles.nth(0)).toHaveCSS('translate', '0px');
      await expect(handles.nth(1)).toHaveCSS('translate', '0px');
      await expect(range).toHaveCSS('translate', '0px');
      await expect(range).toHaveCSS('width', '0px');
    });
  });

  test.describe('pushy toggle button', () => {
    test('should toggle pushy behavior when clicked', async ({ page }) => {
      const slider = page.locator('#pushy-toggle');
      const handles = slider.locator('.rangeHandle');
      const range = slider.locator('.rangeBar');
      const toggleButton = page.getByRole('button', { name: 'Toggle Pushy' });

      await slider.isVisible();
      const sliderBounds = await slider.boundingBox();
      if (!sliderBounds) throw new Error('Could not get slider bounds');

      // Initially pushy=false, handles should block
      await dragHandleTo(page, slider, handles.nth(0), 0.9);
      await expect(handles.nth(0)).toHaveCSS('translate', '600px'); // Should be blocked at 60%
      await expect(handles.nth(1)).toHaveCSS('translate', '600px');
      await expect(range).toHaveCSS('translate', '600px');
      await expect(range).toHaveCSS('width', '0px');

      // Reset position
      await page.mouse.click(sliderBounds.x + sliderBounds.width * 0.4, sliderBounds.y + sliderBounds.height / 2);
      await expect(handles.nth(0)).toHaveCSS('translate', '400px');
      await expect(handles.nth(1)).toHaveCSS('translate', '600px');
      await expect(range).toHaveCSS('translate', '400px');
      await expect(range).toHaveCSS('width', '200px');

      // Toggle pushy to true
      await toggleButton.click();

      // Now with pushy=true, handles should push
      await dragHandleTo(page, slider, handles.nth(0), 0.9);
      await expect(handles.nth(0)).toHaveCSS('translate', '900px'); // Should push to 90%
      await expect(handles.nth(1)).toHaveCSS('translate', '900px');
      await expect(range).toHaveCSS('translate', '900px');
      await expect(range).toHaveCSS('width', '0px');
    });
  });
});
