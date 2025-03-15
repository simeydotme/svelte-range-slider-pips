import { expect, test } from '@playwright/test';
import { dragHandleTo } from './helpers/tools.js';

test.describe('Range Tests', () => {
  test.describe('pushy=false', () => {
    test('handles should block each other', async ({ page }) => {
      await page.goto('/test/range-slider/range/pushy');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#not-pushy');
      const handles = slider.locator('.rangeHandle');
      const range = slider.locator('.rangeBar');

      await expect(range).toBeAttached();
      await expect(range).toHaveCSS('left', '400px');
      await expect(range).toHaveCSS('right', '400px');

      await slider.isVisible();
      const sliderBounds = await slider.boundingBox();
      if (!sliderBounds) throw new Error('Could not get slider bounds');

      // Drag the handle to 90%
      await dragHandleTo(page, slider, handles.nth(0), 0.9);

      // expect the first handle to be stuck at the second handle (75%)
      await expect(handles.nth(0)).toHaveCSS('left', '600px');
      await expect(handles.nth(1)).toHaveCSS('left', '600px');

      // reset the first handle to 40% and should not move the second handle
      await page.mouse.click(sliderBounds.x + sliderBounds.width * 0.4, sliderBounds.y + sliderBounds.height / 2);
      await expect(handles.nth(0)).toHaveCSS('left', '400px');
      await expect(handles.nth(1)).toHaveCSS('left', '600px');

      // Drag the handle to 10%
      await dragHandleTo(page, slider, handles.nth(1), 0.1);

      // expect the second handle to be stuck at the first handle (40%)
      await expect(handles.nth(0)).toHaveCSS('left', '400px');
      await expect(handles.nth(1)).toHaveCSS('left', '400px');
    });
  });

  test.describe('pushy=true', () => {
    test('handles should push each other', async ({ page }) => {
      await page.goto('/test/range-slider/range/pushy');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#pushy');
      const handles = slider.locator('.rangeHandle');
      const range = slider.locator('.rangeBar');

      await expect(range).toBeAttached();
      await expect(range).toHaveCSS('left', '400px');
      await expect(range).toHaveCSS('right', '400px');

      await slider.isVisible();
      const sliderBounds = await slider.boundingBox();
      if (!sliderBounds) throw new Error('Could not get slider bounds');

      // Drag the handle to 90%
      await dragHandleTo(page, slider, handles.nth(0), 0.9);

      // expect the first handle to push the second handle to 90%
      await expect(handles.nth(0)).toHaveCSS('left', '900px');
      await expect(handles.nth(1)).toHaveCSS('left', '900px');

      // reset the first handle to 40% and should not move the second handle
      await page.mouse.click(sliderBounds.x + sliderBounds.width * 0.4, sliderBounds.y + sliderBounds.height / 2);
      await expect(handles.nth(0)).toHaveCSS('left', '400px');
      await expect(handles.nth(1)).toHaveCSS('left', '900px');

      // Drag the handle to 10%
      await dragHandleTo(page, slider, handles.nth(1), 0.1);

      // expect the second handle to push the first handle to 10%
      await expect(handles.nth(0)).toHaveCSS('left', '100px');
      await expect(handles.nth(1)).toHaveCSS('left', '100px');
    });
  });

  test.describe('pushy toggle button', () => {
    test('should toggle pushy behavior when clicked', async ({ page }) => {
      await page.goto('/test/range-slider/range/pushy');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#pushy-toggle');
      const handles = slider.locator('.rangeHandle');
      const toggleButton = page.getByRole('button', { name: 'Toggle Pushy' });

      await slider.isVisible();
      const sliderBounds = await slider.boundingBox();
      if (!sliderBounds) throw new Error('Could not get slider bounds');

      // Initially pushy=false, handles should block
      await dragHandleTo(page, slider, handles.nth(0), 0.9);
      await expect(handles.nth(0)).toHaveCSS('left', '600px'); // Should be blocked at 60%
      await expect(handles.nth(1)).toHaveCSS('left', '600px');

      // Reset position
      await page.mouse.click(sliderBounds.x + sliderBounds.width * 0.4, sliderBounds.y + sliderBounds.height / 2);
      await expect(handles.nth(0)).toHaveCSS('left', '400px');
      await expect(handles.nth(1)).toHaveCSS('left', '600px');

      // Toggle pushy to true
      await toggleButton.click();

      // Now with pushy=true, handles should push
      await dragHandleTo(page, slider, handles.nth(0), 0.9);
      await expect(handles.nth(0)).toHaveCSS('left', '900px'); // Should push to 90%
      await expect(handles.nth(1)).toHaveCSS('left', '900px');
    });
  });
});
