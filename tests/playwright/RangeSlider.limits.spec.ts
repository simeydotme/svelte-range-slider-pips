import { expect, test } from '@playwright/test';
import { dragHandleTo } from './helpers/tools.js';

test.describe('RangeSlider Limits Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/range-slider/limits');
    await page.waitForLoadState('networkidle');
  });

  test('single handle should be constrained by limits', async ({ page }) => {
    const slider = page.locator('#single-limits');
    const handle = slider.locator('.rangeHandle');

    // Try to drag handle below min limit
    await dragHandleTo(page, slider, handle, 0);
    await expect(handle).toHaveAttribute('aria-valuenow', '10');
    await expect(handle).toHaveCSS('translate', '100px'); // 10% from the left

    // Try to drag handle above max limit
    await dragHandleTo(page, slider, handle, 1);
    await expect(handle).toHaveAttribute('aria-valuenow', '70');
    await expect(handle).toHaveCSS('translate', '700px'); // 70% from the left
  });

  test('reversed horizontal slider should be constrained by limits', async ({ page }) => {
    const slider = page.locator('#reversed-limits');
    const handle = slider.locator('.rangeHandle');

    // In reversed mode, dragging to 0 should hit max limit
    await dragHandleTo(page, slider, handle, 0);
    await expect(handle).toHaveAttribute('aria-valuenow', '70');
    await expect(handle).toHaveCSS('translate', '300px'); // reversed mode, so 30% from the left (70% from the right)

    // In reversed mode, dragging to 1 should hit min limit
    await dragHandleTo(page, slider, handle, 1);
    await expect(handle).toHaveAttribute('aria-valuenow', '10');
    await expect(handle).toHaveCSS('translate', '900px'); // reversed mode, so 90% from the left (10% from the right)
  });

  test('range slider handles should be constrained by limits', async ({ page }) => {
    const slider = page.locator('#range-limits');
    const handles = slider.locator('.rangeHandle');

    // Try to drag min handle below min limit
    await dragHandleTo(page, slider, handles.nth(0), 0);
    await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '10');

    // Try to drag max handle above max limit
    await dragHandleTo(page, slider, handles.nth(1), 1);
    await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '70');
  });

  test('range slider with pushy should push handles when reaching limits', async ({ page }) => {
    const slider = page.locator('#range-limits-pushy');
    const handles = slider.locator('.rangeHandle');

    // Try to drag min handle below min limit
    await dragHandleTo(page, slider, handles.nth(0), 0);
    await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '10');
    await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '50');

    // Try to drag max handle above max limit
    await dragHandleTo(page, slider, handles.nth(0), 1);
    await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '70');
    await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '70');
  });

  test('range slider with rangeGap should respect both limits and gaps', async ({ page }) => {
    const slider = page.locator('#range-limits-gap');
    const handles = slider.locator('.rangeHandle');

    // Try to drag min handle below min limit
    await dragHandleTo(page, slider, handles.nth(0), 0);
    await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '10'); // constrained by limits min
    await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '30'); // doesn't move

    // Try to drag max handle above max limit
    await dragHandleTo(page, slider, handles.nth(1), 1);
    await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '10'); // doesnt move because pushy is false
    await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '40'); // constrained by rangeGapMax

    await dragHandleTo(page, slider, handles.nth(0), 1);
    await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '30'); // constrained by rangeGapMin
    await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '40'); // doesnt move because pushy is false
  });

  test('vertical slider should be constrained by limits', async ({ page }) => {
    const slider = page.locator('#vertical-limits');
    const handle = slider.locator('.rangeHandle');

    // Try to drag handle to bottom (1) should hit min limit
    await dragHandleTo(page, slider, handle, 1, true);
    await expect(handle).toHaveAttribute('aria-valuenow', '10');
    await expect(handle).toHaveCSS('translate', '0px 180px'); // vertical sliders are 200px tall and go from bottom->top, so 10% from the bottom

    // Try to drag handle to top (0) should hit max limit
    await dragHandleTo(page, slider, handle, 0, true);
    await expect(handle).toHaveAttribute('aria-valuenow', '70');
    await expect(handle).toHaveCSS('translate', '0px 60px'); // vertical sliders are 200px tall and go from bottom->top, so 70% from the bottom
  });

  test('reversed vertical slider should be constrained by limits', async ({ page }) => {
    const slider = page.locator('#reversed-vertical-limits');
    const handle = slider.locator('.rangeHandle');

    // In reversed vertical mode, dragging to bottom (1) should hit max limit
    await dragHandleTo(page, slider, handle, 1, true);
    await expect(handle).toHaveAttribute('aria-valuenow', '70');
    await expect(handle).toHaveCSS('translate', '0px 140px'); // vertical reversed sliders go from top->bottom, so 70% from the top

    // In reversed vertical mode, dragging to top (0) should hit min limit
    await dragHandleTo(page, slider, handle, 0, true);
    await expect(handle).toHaveAttribute('aria-valuenow', '10');
    await expect(handle).toHaveCSS('translate', '0px 20px'); // vertical reversed sliders go from top->bottom, so 10% from the top
  });

  test('dynamic controls should update limits correctly', async ({ page }) => {
    const slider = page.locator('#dynamic-controls');
    const handle = slider.locator('.rangeHandle');
    const toggleLimitsButton = page.locator('#toggle-limits');
    const toggleRangeButton = page.locator('#toggle-range');
    const minInput = page.locator('#min-limit');
    const maxInput = page.locator('#max-limit');

    // Enable limits
    await expect(slider.locator('.rangeLimit')).not.toBeVisible();
    await dragHandleTo(page, slider, handle, 0);
    await expect(handle).toHaveAttribute('aria-valuenow', '0');
    await toggleLimitsButton.click();
    await expect(toggleLimitsButton).toHaveText('Remove Limits');
    // after turning on limits, the handle should be set within the limits
    await expect(slider.locator('.rangeLimit')).toBeVisible();
    await expect(handle).toHaveAttribute('aria-valuenow', '10');

    // Try to drag handle above max limit
    await dragHandleTo(page, slider, handle, 1);
    await expect(handle).toHaveAttribute('aria-valuenow', '70');

    // turn on range
    await expect(slider.locator('.rangeBar')).not.toBeVisible();
    await toggleRangeButton.click();
    await expect(toggleRangeButton).toHaveText('Remove Range');
    await expect(slider.locator('.rangeBar')).toBeVisible();

    // after turning on range, the handles should be set within the limits
    const rangeHandles = slider.locator('.rangeHandle');
    await expect(rangeHandles).toHaveCount(2);
    await dragHandleTo(page, slider, rangeHandles.nth(0), 0);
    await expect(rangeHandles.nth(0)).toHaveAttribute('aria-valuenow', '10');
    await dragHandleTo(page, slider, rangeHandles.nth(1), 1);
    await expect(rangeHandles.nth(1)).toHaveAttribute('aria-valuenow', '70');

    // Update limits
    await minInput.fill('20');
    await maxInput.fill('60');
    await minInput.press('Enter');
    await maxInput.press('Enter');
    // after changing limits, the handles should be set within the new limits
    await expect(rangeHandles.nth(0)).toHaveAttribute('aria-valuenow', '20');
    await expect(rangeHandles.nth(1)).toHaveAttribute('aria-valuenow', '60');

    // Try to drag handle below new min limit
    await dragHandleTo(page, slider, rangeHandles.nth(0), 0);
    await expect(rangeHandles.nth(0)).toHaveAttribute('aria-valuenow', '20');

    // Try to drag handle above new max limit
    await dragHandleTo(page, slider, rangeHandles.nth(1), 1);
    await expect(rangeHandles.nth(1)).toHaveAttribute('aria-valuenow', '60');

    // Disable limits
    await toggleLimitsButton.click();
    await expect(toggleLimitsButton).toHaveText('Add Limits');

    // Should be able to drag beyond previous limits
    await dragHandleTo(page, slider, rangeHandles.nth(0), 0);
    await expect(rangeHandles.nth(0)).toHaveAttribute('aria-valuenow', '0');

    await dragHandleTo(page, slider, rangeHandles.nth(1), 1);
    await expect(rangeHandles.nth(1)).toHaveAttribute('aria-valuenow', '100');
  });

  test('keyboard navigation should respect limits', async ({ page }) => {
    const slider = page.locator('#single-limits');
    const handle = slider.locator('.rangeHandle');

    // Focus the handle
    await handle.focus();

    // Try to move below min limit
    for (let i = 0; i < 50; i++) {
      await page.keyboard.press('ArrowLeft');
    }
    await expect(handle).toHaveAttribute('aria-valuenow', '10');

    // Try to move above max limit
    for (let i = 0; i < 100; i++) {
      await page.keyboard.press('ArrowRight');
    }
    await expect(handle).toHaveAttribute('aria-valuenow', '70');
  });

  test('range slider keyboard navigation should respect limits', async ({ page }) => {
    const slider = page.locator('#range-limits-pushy');
    const handles = slider.locator('.rangeHandle');

    // Focus min handle
    await handles.nth(0).focus();

    // Try to move below min limit
    for (let i = 0; i < 50; i++) {
      await page.keyboard.press('ArrowLeft');
    }
    await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '10');

    // Focus max handle
    await handles.nth(1).focus();

    // Try to move above max limit
    for (let i = 0; i < 100; i++) {
      await page.keyboard.press('ArrowRight');
    }
    await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '70');

    // reset handles to original position
    await dragHandleTo(page, slider, handles.nth(0), 0.3);
    await dragHandleTo(page, slider, handles.nth(1), 0.7);
    await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '30');
    await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '70');

    // Try to move below min limit
    for (let i = 0; i < 100; i++) {
      await page.keyboard.press('ArrowLeft');
    }
    // should push the first handle to the min limit
    await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '10');
    await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '10');
  });
});
