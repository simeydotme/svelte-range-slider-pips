import { expect, test } from '@playwright/test';
import { dragHandleTo } from './helpers/tools.js';

test.describe('Range and Limits Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/range-slider/pips/limits');
    await page.waitForLoadState('networkidle');
  });

  test('default range mode should not apply rsInRange class', async ({ page }) => {
    const slider = page.locator('#default-range');
    const pips = slider.locator('.rsPip');

    // No pips should have rsInRange class
    await expect(pips).toHaveCount(21);
    await expect(pips.nth(10)).toHaveClass(/rsSelected/);
    await expect(pips.nth(10)).not.toHaveClass(/rsInRange/);
  });

  test('range="min" should apply rsInRange class to pips between 0 and value', async ({ page }) => {
    const slider = page.locator('#range-min');
    const pips = slider.locator('.rsPip');

    // Pips between 0 and value should have rsInRange class
    for (let i = 0; i < (await pips.count()); i++) {
      if (i < 10) {
        await expect(pips.nth(i)).toHaveClass(/rsInRange/);
      } else {
        await expect(pips.nth(i)).not.toHaveClass(/rsInRange/);
      }
    }
  });

  test('range="max" should apply rsInRange class to pips between value and 100', async ({ page }) => {
    const slider = page.locator('#range-max');
    const pips = slider.locator('.rsPip');

    // Pips between value and 100 should have rsInRange class
    for (let i = 0; i < (await pips.count()); i++) {
      if (i > 10) {
        await expect(pips.nth(i)).toHaveClass(/rsInRange/);
      } else {
        await expect(pips.nth(i)).not.toHaveClass(/rsInRange/);
      }
    }
  });

  test('range={true} should apply rsInRange class to pips between handles', async ({ page }) => {
    const slider = page.locator('#range-true');
    const pips = slider.locator('.rsPip');

    // Pips between values 40 and 60 should have rsInRange class
    for (let i = 0; i < (await pips.count()); i++) {
      if (i > 8 && i < 12) {
        await expect(pips.nth(i)).toHaveClass(/rsInRange/);
      } else {
        await expect(pips.nth(i)).not.toHaveClass(/rsInRange/);
      }
    }
  });

  test('limits should apply rsOutOfLimit class to pips outside limits', async ({ page }) => {
    const slider = page.locator('#limits');
    const pips = slider.locator('.rsPip');

    // Pips outside limits should have rsOutOfLimit class
    for (let i = 0; i < (await pips.count()); i++) {
      if (i < 4 || i > 16) {
        await expect(pips.nth(i)).toHaveClass(/rsOutOfLimit/);
      } else {
        await expect(pips.nth(i)).not.toHaveClass(/rsOutOfLimit/);
      }
    }
  });

  test('range="min" with limits should apply both rsInRange and rsOutOfLimit classes correctly', async ({ page }) => {
    const slider = page.locator('#range-min-limits');
    const pips = slider.locator('.rsPip');

    // Pips between 0 and value should have rsInRange class
    for (let i = 0; i < (await pips.count()); i++) {
      if (i < 10) {
        await expect(pips.nth(i)).toHaveClass(/rsInRange/);
      } else {
        await expect(pips.nth(i)).not.toHaveClass(/rsInRange/);
      }
    }

    // Pips outside limits should have rsOutOfLimit class
    for (let i = 0; i < (await pips.count()); i++) {
      if (i < 4 || i > 16) {
        await expect(pips.nth(i)).toHaveClass(/rsOutOfLimit/);
      } else {
        await expect(pips.nth(i)).not.toHaveClass(/rsOutOfLimit/);
      }
    }
  });

  test('range="max" with limits should apply both rsInRange and rsOutOfLimit classes correctly', async ({ page }) => {
    const slider = page.locator('#range-max-limits');
    const pips = slider.locator('.rsPip');

    // Pips between value and 100 should have rsInRange class
    for (let i = 0; i < (await pips.count()); i++) {
      if (i > 10) {
        await expect(pips.nth(i)).toHaveClass(/rsInRange/);
      } else {
        await expect(pips.nth(i)).not.toHaveClass(/rsInRange/);
      }
    }

    // Pips outside limits should have rsOutOfLimit class
    for (let i = 0; i < (await pips.count()); i++) {
      if (i < 4 || i > 16) {
        await expect(pips.nth(i)).toHaveClass(/rsOutOfLimit/);
      } else {
        await expect(pips.nth(i)).not.toHaveClass(/rsOutOfLimit/);
      }
    }
  });

  test('range={true} with limits should apply both rsInRange and rsOutOfLimit classes correctly', async ({ page }) => {
    const slider = page.locator('#range-true-limits');
    const pips = slider.locator('.rsPip');

    // Pips between handles should have rsInRange class
    for (let i = 0; i < (await pips.count()); i++) {
      if (i > 8 && i < 12) {
        await expect(pips.nth(i)).toHaveClass(/rsInRange/);
      } else {
        await expect(pips.nth(i)).not.toHaveClass(/rsInRange/);
      }
    }

    // Pips outside limits should have rsOutOfLimit class
    for (let i = 0; i < (await pips.count()); i++) {
      if (i < 4 || i > 16) {
        await expect(pips.nth(i)).toHaveClass(/rsOutOfLimit/);
      } else {
        await expect(pips.nth(i)).not.toHaveClass(/rsOutOfLimit/);
      }
    }
  });

  test('moving handles should update rsInRange class correctly', async ({ page }) => {
    const slider = page.locator('#range-true');
    const pips = slider.locator('.rsPip');
    const handles = slider.locator('.rangeHandle');

    // Initial state
    // Pips between handles should have rsInRange class
    for (let i = 0; i < (await pips.count()); i++) {
      if (i > 8 && i < 12) {
        await expect(pips.nth(i)).toHaveClass(/rsInRange/);
      } else {
        await expect(pips.nth(i)).not.toHaveClass(/rsInRange/);
      }
    }

    // Move min handle to 40
    await dragHandleTo(page, slider, handles.nth(0), 0.2);
    await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '20');
    await dragHandleTo(page, slider, handles.nth(1), 1);
    await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '100');

    // Pips between handles should have rsInRange class
    for (let i = 0; i < (await pips.count()); i++) {
      if (i > 4 && i < 20) {
        await expect(pips.nth(i)).toHaveClass(/rsInRange/);
      } else {
        await expect(pips.nth(i)).not.toHaveClass(/rsInRange/);
      }
    }
  });

  test('dynamic range and limits controls should work correctly', async ({ page }) => {
    const slider = page.locator('#dynamic-controls');
    const pips = slider.locator('.rsPip');
    const toggleLimitsButton = page.locator('#toggle-limits');
    const toggleRangeButton = page.locator('#toggle-range');
    const minInput = page.locator('#min-limit');
    const maxInput = page.locator('#max-limit');

    // Initial state - no limits, no range
    await expect(pips).toHaveCount(21);
    await expect(pips.nth(0)).not.toHaveClass(/rsOutOfLimit/);
    await expect(pips.nth(20)).not.toHaveClass(/rsOutOfLimit/);
    await expect(pips.nth(10)).toHaveClass(/rsSelected/);
    await expect(pips.nth(10)).not.toHaveClass(/rsInRange/);

    // Click button to add range
    await toggleRangeButton.click();
    await expect(toggleRangeButton).toHaveText('Remove Range');

    // After adding range
    for (let i = 0; i < (await pips.count()); i++) {
      if (i > 8 && i < 12) {
        await expect(pips.nth(i)).toHaveClass(/rsInRange/);
      } else {
        await expect(pips.nth(i)).not.toHaveClass(/rsInRange/);
      }
    }

    // Click button to add limits
    await toggleLimitsButton.click();
    await expect(toggleLimitsButton).toHaveText('Remove Limits');

    // After adding limits
    for (let i = 0; i < (await pips.count()); i++) {
      if (i < 4 || i > 16) {
        await expect(pips.nth(i)).toHaveClass(/rsOutOfLimit/);
      } else {
        await expect(pips.nth(i)).not.toHaveClass(/rsOutOfLimit/);
      }
    }

    // Set custom limits
    await minInput.fill('30');
    await maxInput.fill('70');
    await minInput.press('Enter');
    await maxInput.press('Enter');

    // After updating limits
    for (let i = 0; i < (await pips.count()); i++) {
      if (i < 6 || i > 14) {
        await expect(pips.nth(i)).toHaveClass(/rsOutOfLimit/);
      } else {
        await expect(pips.nth(i)).not.toHaveClass(/rsOutOfLimit/);
      }
    }

    // Click button to remove range
    await toggleRangeButton.click();
    await expect(toggleRangeButton).toHaveText('Add Range');

    // After removing range
    await expect(pips.nth(10)).toHaveClass(/rsSelected/);
    await expect(pips.nth(10)).not.toHaveClass(/rsInRange/);

    // Click button to remove limits
    await toggleLimitsButton.click();
    await expect(toggleLimitsButton).toHaveText('Add Limits');

    // After removing limits
    for (let i = 0; i < (await pips.count()); i++) {
      await expect(pips.nth(i)).not.toHaveClass(/rsOutOfLimit/);
    }
  });
});
