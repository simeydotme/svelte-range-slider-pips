import { expect, test } from '@playwright/test';
import { dragHandleTo } from './helpers/tools.js';

test.describe('Range Gap Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/range-slider/range/gaps');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Basic Range Gap Tests', () => {
    test('should allow handles to move freely when no gaps are set', async ({ page }) => {
      const slider = page.locator('#default-gaps');
      const handles = slider.locator('.rangeHandle');
      const handle1 = handles.first();
      const handle2 = handles.nth(1);

      await slider.scrollIntoViewIfNeeded();
      await dragHandleTo(page, slider, handle1, 0);
      await dragHandleTo(page, slider, handle2, 0);

      // Verify handles can be moved to any position
      await expect(handle1).toHaveAttribute('aria-valuenow', '0');
      await expect(handle2).toHaveAttribute('aria-valuenow', '0');
    });

    test('should enforce minimum gap between handles (on drag)', async ({ page }) => {
      const slider = page.locator('#min-gap');
      const handles = slider.locator('.rangeHandle');
      const handle1 = handles.first();
      const handle2 = handles.nth(1);

      await slider.scrollIntoViewIfNeeded();
      await dragHandleTo(page, slider, handle1, 0.3);
      await dragHandleTo(page, slider, handle2, 0.3);

      // Get handle values and verify minimum gap of 20 is maintained
      await expect(handle1).toHaveAttribute('aria-valuenow', '30');
      await expect(handle2).toHaveAttribute('aria-valuenow', '50');

      // reset handles to original position
      await dragHandleTo(page, slider, handle1, 0.3);
      await dragHandleTo(page, slider, handle2, 0.7);
      await expect(handle1).toHaveAttribute('aria-valuenow', '30');
      await expect(handle2).toHaveAttribute('aria-valuenow', '70');

      // Try moving handles closer together
      await dragHandleTo(page, slider, handle1, 0);
      await dragHandleTo(page, slider, handle2, 0.05);
      // Verify gap still cannot be less than 20
      await expect(handle1).toHaveAttribute('aria-valuenow', '0');
      await expect(handle2).toHaveAttribute('aria-valuenow', '20');
    });

    test('should enforce minimum gap between handles (on click)', async ({ page }) => {
      const slider = page.locator('#min-gap');
      const handles = slider.locator('.rangeHandle');
      const handle1 = handles.first();
      const handle2 = handles.nth(1);

      await slider.scrollIntoViewIfNeeded();
      // Test rapid movements
      const sliderBounds = await slider.boundingBox();
      if (!sliderBounds) throw new Error('Could not get slider bounds');

      await page.mouse.click(sliderBounds.x + sliderBounds.width * 0.4, sliderBounds.y + sliderBounds.height / 2);
      await expect(handle1).toHaveCSS('translate', '400px');

      await page.mouse.click(sliderBounds.x + sliderBounds.width * 0.55, sliderBounds.y + sliderBounds.height / 2);
      await expect(handle2).toHaveCSS('translate', '600px');
    });

    test('should enforce maximum gap between handles', async ({ page }) => {
      const slider = page.locator('#max-gap');
      const handles = slider.locator('.rangeHandle');
      const handle1 = handles.first();
      const handle2 = handles.nth(1);

      await slider.scrollIntoViewIfNeeded();
      await dragHandleTo(page, slider, handle1, 0.5);
      await dragHandleTo(page, slider, handle2, 1);

      // Verify handles maintain maximum gap of 40
      await expect(handle1).toHaveAttribute('aria-valuenow', '50');
      await expect(handle2).toHaveAttribute('aria-valuenow', '90');

      // reset handles to original position
      await dragHandleTo(page, slider, handle2, 0.7);
      await dragHandleTo(page, slider, handle1, 0.3);
      await expect(handle1).toHaveAttribute('aria-valuenow', '30');
      await expect(handle2).toHaveAttribute('aria-valuenow', '70');

      // Try dragging handles further apart
      await dragHandleTo(page, slider, handle2, 0.5);
      await dragHandleTo(page, slider, handle1, 0);

      // Verify gap still cannot exceed 40
      await expect(handle1).toHaveAttribute('aria-valuenow', '10');
      await expect(handle2).toHaveAttribute('aria-valuenow', '50');
    });

    test('should enforce both minimum and maximum gaps', async ({ page }) => {
      const slider = page.locator('#both-gaps');
      const handles = slider.locator('.rangeHandle');
      const handle1 = handles.first();
      const handle2 = handles.nth(1);

      await slider.scrollIntoViewIfNeeded();
      await dragHandleTo(page, slider, handle1, 0.2);
      await dragHandleTo(page, slider, handle2, 0.8);

      // Verify handles maintain maximum gap constraints
      await expect(handle1).toHaveAttribute('aria-valuenow', '30');
      await expect(handle2).toHaveAttribute('aria-valuenow', '70');

      await dragHandleTo(page, slider, handle1, 0.45);
      await dragHandleTo(page, slider, handle2, 0.55);

      // Verify handles maintain minimum gap constraints
      await expect(handle1).toHaveAttribute('aria-valuenow', '45');
      await expect(handle2).toHaveAttribute('aria-valuenow', '65');
    });
  });

  test.describe('Edge Cases and Limits', () => {
    test('should handle equal minimum and maximum gaps', async ({ page }) => {
      const slider = page.locator('#equal-gaps');
      const handles = slider.locator('.rangeHandle');
      const handle1 = handles.first();
      const handle2 = handles.nth(1);
      const button = page.locator('#btn_equal_gaps_pushy');

      await slider.scrollIntoViewIfNeeded();

      // try to move handles to the left
      await dragHandleTo(page, slider, handle1, 0);
      await dragHandleTo(page, slider, handle2, 0.1);

      // Verify handles maintain exact gap
      await expect(handle1).toHaveAttribute('aria-valuenow', '35');
      await expect(handle2).toHaveAttribute('aria-valuenow', '65');

      // try to move handles to the right, further apart
      await dragHandleTo(page, slider, handle2, 0.9);

      // Verify handles maintain exact gap
      await expect(handle1).toHaveAttribute('aria-valuenow', '35');
      await expect(handle2).toHaveAttribute('aria-valuenow', '65');

      // toggle the pushy button
      await button.click();

      // try to move handles to the left, closer together
      await dragHandleTo(page, slider, handle2, 0.1);

      // now they push each other, but still maintain the exact gap
      await expect(handle1).toHaveAttribute('aria-valuenow', '0');
      await expect(handle2).toHaveAttribute('aria-valuenow', '30');

      // try to move handles to the right, further apart
      await dragHandleTo(page, slider, handle2, 1);
      // the second handle will pull the first handle maintaining the minimum gap
      await expect(handle1).toHaveAttribute('aria-valuenow', '70');
    });

    test('should allow handles to overlap when gaps are zero', async ({ page }) => {
      const slider = page.locator('#zero-gaps');
      const handles = slider.locator('.rangeHandle');
      const handle1 = handles.first();
      const handle2 = handles.nth(1);

      await slider.scrollIntoViewIfNeeded();
      await dragHandleTo(page, slider, handle1, 0.5);
      await dragHandleTo(page, slider, handle2, 0.5);

      // Verify handles can be at the same position
      await expect(handle1).toHaveAttribute('aria-valuenow', '50');
      await expect(handle2).toHaveAttribute('aria-valuenow', '50');
    });

    test('should handle large gap constraints', async ({ page }) => {
      const slider = page.locator('#large-gaps');
      const handles = slider.locator('.rangeHandle');
      const handle1 = handles.first();
      const handle2 = handles.nth(1);

      await slider.scrollIntoViewIfNeeded();
      await dragHandleTo(page, slider, handle1, 0);
      await dragHandleTo(page, slider, handle2, 0);

      // first handle couldn't move because the disantce was the same as the max gap
      await expect(handle1).toHaveAttribute('aria-valuenow', '-400000');
      // second handle could move but not more than the min gap
      await expect(handle2).toHaveAttribute('aria-valuenow', '-390000');
    });
  });

  test.describe('Accessibility Tests', () => {
    test('should update aria attributes correctly with gaps', async ({ page }) => {
      const slider = page.locator('#aria-gaps');
      const handles = slider.locator('.rangeHandle');
      const handle1 = handles.first();
      const handle2 = handles.nth(1);

      await slider.scrollIntoViewIfNeeded();

      // Verify aria attributes reflect gap constraints
      await expect(handle1).toHaveAttribute('aria-valuemin', '0');
      await expect(handle1).toHaveAttribute('aria-valuemax', '70');
      await expect(handle2).toHaveAttribute('aria-valuemin', '30');
      await expect(handle2).toHaveAttribute('aria-valuemax', '100');
    });

    test('should respect gap constraints during keyboard navigation', async ({ page }) => {
      const slider = page.locator('#keyboard-gaps');
      const handle1 = slider.locator('.rangeHandle').first();
      const handle2 = slider.locator('.rangeHandle').nth(1);

      await slider.scrollIntoViewIfNeeded();
      // original min/max is -10 to 10, but the rangeGapMax is 5.5, and so
      //
      await expect(handle1).toHaveAttribute('aria-valuenow', '-5');
      await expect(handle2).toHaveAttribute('aria-valuenow', '0.5');

      await handle1.focus();

      // Test arrow keys
      await handle1.press('ArrowRight');
      await expect(handle1).toHaveAttribute('aria-valuenow', '-4.9');
      await expect(handle2).toHaveAttribute('aria-valuenow', '0.5');

      await handle2.press('ArrowRight');
      await handle2.press('ArrowRight');
      await handle2.press('ArrowRight');
      await expect(handle1).toHaveAttribute('aria-valuenow', '-4.9');
      await expect(handle2).toHaveAttribute('aria-valuenow', '0.6');

      // Test home/end
      await handle1.press('Home');
      await expect(handle1).toHaveAttribute('aria-valuenow', '-4.9');
      await expect(handle2).toHaveAttribute('aria-valuenow', '0.6');

      await handle1.press('End');
      await expect(handle1).toHaveAttribute('aria-valuenow', '-1.9');
      await handle2.press('End');
      await expect(handle2).toHaveAttribute('aria-valuenow', '3.6');
    });

    test('should update aria-valuetext with constrained values', async ({ page }) => {
      const slider = page.locator('#aria-gaps');
      const handles = slider.locator('.rangeHandle');
      const handle1 = handles.first();
      const handle2 = handles.nth(1);

      await slider.scrollIntoViewIfNeeded();
      await dragHandleTo(page, slider, handle1, 0.4);
      await dragHandleTo(page, slider, handle2, 0.5);

      // Verify text reflects actual constrained values
      await expect(handle1).toHaveAttribute('aria-valuetext', '40');
      await expect(handle2).toHaveAttribute('aria-valuetext', '60');
    });
  });

  test.describe('Event Handling Tests', () => {
    test('should emit correct constrained values in change events', async ({ page }) => {
      const slider = page.locator('#event-gaps');
      const handle1 = slider.locator('.rangeHandle').first();
      const handle2 = slider.locator('.rangeHandle').nth(1);

      await slider.scrollIntoViewIfNeeded();

      // listen for emitted console logs
      const changeEvents: string[] = [];
      page.on('console', (message) => {
        // push change events only
        if (message.text().includes('Change event:')) {
          changeEvents.push(message.text());
        }
      });

      // Move handles to trigger the max gap constraint
      await dragHandleTo(page, slider, handle2, 0.5);
      await dragHandleTo(page, slider, handle1, 0.1);
      await page.waitForTimeout(200);
      expect(changeEvents.at(-1)).toContain('[10, 50]');

      // Move handles to trigger the min gap constraint
      await dragHandleTo(page, slider, handle1, 0.5);
      await page.waitForTimeout(200);
      expect(changeEvents.at(-1)).toContain('[30, 50]');
    });

    test('should emit correct constrained values in start/stop events', async ({ page }) => {
      const slider = page.locator('#event-gaps');
      const handle1 = slider.locator('.rangeHandle').first();
      const handle2 = slider.locator('.rangeHandle').nth(1);

      await slider.scrollIntoViewIfNeeded();

      // Listen for start/stop events
      const startEvents: string[] = [];
      const stopEvents: string[] = [];
      page.on('console', (message) => {
        if (message.text().includes('Start event:')) {
          startEvents.push(message.text());
        } else if (message.text().includes('Stop event:')) {
          stopEvents.push(message.text());
        }
      });
      // Move handles to trigger the max gap constraint
      await dragHandleTo(page, slider, handle2, 0.5);
      await dragHandleTo(page, slider, handle1, 0.1);
      await page.waitForTimeout(200);
      expect(startEvents.at(0)).toContain('[30, 70]');
      expect(startEvents.at(1)).toContain('[30, 50]');
      expect(stopEvents.at(0)).toContain('[30, 50]');
      expect(stopEvents.at(1)).toContain('[10, 50]');

      // Move handles to trigger the min gap constraint
      await dragHandleTo(page, slider, handle1, 0.5);
      await page.waitForTimeout(200);
      expect(startEvents.at(-1)).toContain('[10, 50]');
      expect(stopEvents.at(-1)).toContain('[30, 50]');
    });
  });

  test.describe('Error Handling and Fallbacks', () => {
    test('should handle when rangeGapMin is greater than rangeGapMax', async ({ page }) => {
      const slider = page.locator('#invalid-gaps');
      const handles = slider.locator('.rangeHandle');
      const handle1 = handles.first();
      const handle2 = handles.nth(1);

      await slider.scrollIntoViewIfNeeded();
      await dragHandleTo(page, slider, handle1, 0.2);

      // The rangeGapMax is 20, and the rangeGapMin is 40,
      // so min will be set to the same as max (20)
      await expect(handle1).toHaveAttribute('aria-valuenow', '20');
      await expect(handle2).toHaveAttribute('aria-valuenow', '40');
    });

    test('should ignore negative gap values', async ({ page }) => {
      const slider = page.locator('#negative-gaps');
      const handles = slider.locator('.rangeHandle');
      const handle1 = handles.first();
      const handle2 = handles.nth(1);

      await slider.scrollIntoViewIfNeeded();
      await dragHandleTo(page, slider, handle1, 0.3);
      await dragHandleTo(page, slider, handle2, 0.7);

      // Should treat negative values as 0
      await expect(handle1).toHaveAttribute('aria-valuenow', '30');
      await expect(handle2).toHaveAttribute('aria-valuenow', '70');
    });

    test('should handle gaps starting outside of range', async ({ page }) => {
      const slider = page.locator('#large-range-gaps');
      const handles = slider.locator('.rangeHandle');
      const handle1 = handles.first();
      const handle2 = handles.nth(1);

      await slider.scrollIntoViewIfNeeded();
      // slider starts in an 'invalid' state (30 + 80 = 110, which is outside of the range)
      // but this is not critical so we put the burden on the developer to ensure the values are within the range
      await dragHandleTo(page, slider, handle1, 0.3);
      await dragHandleTo(page, slider, handle2, 0.7);
      // but after trying to move a handle, the values are constrained to the range
      // and reset to a valid state
      await expect(handle1).toHaveAttribute('aria-valuenow', '20');
      await expect(handle2).toHaveAttribute('aria-valuenow', '100');
    });

    test('should use default behavior when props are undefined', async ({ page }) => {
      const slider = page.locator('#default-gaps');
      const handles = slider.locator('.rangeHandle');
      const handle1 = handles.first();
      const handle2 = handles.nth(1);

      await slider.scrollIntoViewIfNeeded();

      // Verify handles can move freely without gap constraints
      await dragHandleTo(page, slider, handle1, 0);
      await dragHandleTo(page, slider, handle2, 1);
      await expect(handle1).toHaveAttribute('aria-valuenow', '0');
      await expect(handle2).toHaveAttribute('aria-valuenow', '100');

      // Verify handles can move freely without gap constraints
      await dragHandleTo(page, slider, handle1, 0.65);
      await dragHandleTo(page, slider, handle2, 0.65);
      await expect(handle1).toHaveAttribute('aria-valuenow', '65');
      await expect(handle2).toHaveAttribute('aria-valuenow', '65');
    });

    test('should maintain gap constraints when disabled', async ({ page }) => {
      const slider = page.locator('#disabled-gaps');
      const handles = slider.locator('.rangeHandle');
      const handle1 = handles.first();
      const handle2 = handles.nth(1);

      await slider.scrollIntoViewIfNeeded();

      // Verify handles maintain gap constraints even when disabled
      // values are 20 and 80, but the rangeGapMax is 40, so the values are constrained to 20 and 60
      await expect(handle1).toHaveAttribute('aria-valuenow', '20');
      await expect(handle2).toHaveAttribute('aria-valuenow', '60');
      await expect(handle1).toHaveAttribute('aria-disabled', 'true');
      await expect(handle2).toHaveAttribute('aria-disabled', 'true');
    });
  });

  test.describe('Dynamic Gap Tests', () => {
    test('should update handle values when rangeGapMin is increased beyond current gap', async ({ page }) => {
      const slider = page.locator('#dynamic-gaps');
      const handles = slider.locator('.rangeHandle');
      const handle1 = handles.first();
      const handle2 = handles.nth(1);
      const increaseMinButton = page.locator('#btn_increase_min');

      await slider.scrollIntoViewIfNeeded();

      // Verify initial state: values [40, 60] with gap 20, constraints min: 10, max: 30
      await expect(handle1).toHaveAttribute('aria-valuenow', '40');
      await expect(handle2).toHaveAttribute('aria-valuenow', '60');

      // Increase minimum gap from 10 to 15 - should NOT change values since 20 > 15
      await increaseMinButton.click();
      await expect(handle1).toHaveAttribute('aria-valuenow', '40');
      await expect(handle2).toHaveAttribute('aria-valuenow', '60');

      // Increase minimum gap to 25 - should force second handle to move
      await increaseMinButton.click(); // 15 -> 20
      await increaseMinButton.click(); // 20 -> 25
      await expect(handle1).toHaveAttribute('aria-valuenow', '40');
      await expect(handle2).toHaveAttribute('aria-valuenow', '65');
    });

    test('should update handle values when rangeGapMin is decreased', async ({ page }) => {
      const slider = page.locator('#dynamic-gaps');
      const handles = slider.locator('.rangeHandle');
      const handle1 = handles.first();
      const handle2 = handles.nth(1);
      const decreaseMinButton = page.locator('#btn_decrease_min');

      await slider.scrollIntoViewIfNeeded();

      // Verify initial state: values [40, 60] with gap 20, constraints min: 10, max: 30
      await expect(handle1).toHaveAttribute('aria-valuenow', '40');
      await expect(handle2).toHaveAttribute('aria-valuenow', '60');

      // Decrease minimum gap from 10 to 5 - should NOT change values since 20 > 5
      await decreaseMinButton.click();
      await expect(handle1).toHaveAttribute('aria-valuenow', '40');
      await expect(handle2).toHaveAttribute('aria-valuenow', '60');

      // Now we can move handles closer together
      await dragHandleTo(page, slider, handle1, 0.45);
      await dragHandleTo(page, slider, handle2, 0.5);
      await expect(handle1).toHaveAttribute('aria-valuenow', '45');
      await expect(handle2).toHaveAttribute('aria-valuenow', '50');
    });

    test('should update handle values when rangeGapMax is decreased below current gap', async ({ page }) => {
      const slider = page.locator('#dynamic-gaps');
      const handles = slider.locator('.rangeHandle');
      const handle1 = handles.first();
      const handle2 = handles.nth(1);
      const decreaseMaxButton = page.locator('#btn_decrease_max');

      await slider.scrollIntoViewIfNeeded();

      // Verify initial state: values [40, 60] with gap 20, constraints min: 10, max: 30
      await expect(handle1).toHaveAttribute('aria-valuenow', '40');
      await expect(handle2).toHaveAttribute('aria-valuenow', '60');

      // Decrease maximum gap from 30 to 25 - should NOT change values since 20 < 25
      await decreaseMaxButton.click();
      await expect(handle1).toHaveAttribute('aria-valuenow', '40');
      await expect(handle2).toHaveAttribute('aria-valuenow', '60');

      // Decrease maximum gap to 15 - should force second handle to move
      await decreaseMaxButton.click(); // 25 -> 20
      await decreaseMaxButton.click(); // 20 -> 15
      await expect(handle1).toHaveAttribute('aria-valuenow', '40');
      await expect(handle2).toHaveAttribute('aria-valuenow', '55');
    });

    test('should update handle values when rangeGapMax is increased', async ({ page }) => {
      const slider = page.locator('#dynamic-gaps');
      const handles = slider.locator('.rangeHandle');
      const handle1 = handles.first();
      const handle2 = handles.nth(1);
      const increaseMaxButton = page.locator('#btn_increase_max');

      await slider.scrollIntoViewIfNeeded();

      // Verify initial state: values [40, 60] with gap 20, constraints min: 10, max: 30
      await expect(handle1).toHaveAttribute('aria-valuenow', '40');
      await expect(handle2).toHaveAttribute('aria-valuenow', '60');

      // try dragging handles apart but it will fail because the gap is too small
      await dragHandleTo(page, slider, handle1, 0.3);
      await expect(handle1).toHaveAttribute('aria-valuenow', '30');
      await dragHandleTo(page, slider, handle2, 0.7);
      await expect(handle2).toHaveAttribute('aria-valuenow', '60');

      // try dragging handles apart but it will fail because the gap is too small
      await dragHandleTo(page, slider, handle1, 0.1);
      await expect(handle1).toHaveAttribute('aria-valuenow', '30');

      // Increase maximum gap from 30 to 50 - should NOT change values since 20 < 35
      await increaseMaxButton.click();
      await increaseMaxButton.click();
      await increaseMaxButton.click();
      await increaseMaxButton.click();

      await expect(handle1).toHaveAttribute('aria-valuenow', '30');
      await expect(handle2).toHaveAttribute('aria-valuenow', '60');

      // Now we can move handles further apart, but constrained by the gap
      await dragHandleTo(page, slider, handle1, 0.2);
      await expect(handle1).toHaveAttribute('aria-valuenow', '20');
      await dragHandleTo(page, slider, handle2, 1);
      await expect(handle2).toHaveAttribute('aria-valuenow', '70');
    });

    test('should handle both min and max gap changes simultaneously', async ({ page }) => {
      const slider = page.locator('#dynamic-gaps');
      const handles = slider.locator('.rangeHandle');
      const handle1 = handles.first();
      const handle2 = handles.nth(1);
      const increaseMinButton = page.locator('#btn_increase_min');
      const decreaseMaxButton = page.locator('#btn_decrease_max');

      await slider.scrollIntoViewIfNeeded();

      // Verify initial state: values [40, 60] with gap 20, constraints min: 10, max: 30
      await expect(handle1).toHaveAttribute('aria-valuenow', '40');
      await expect(handle2).toHaveAttribute('aria-valuenow', '60');

      // Increase minimum gap to 25 and decrease maximum gap to 15
      for (let i = 0; i < 3; i++) {
        await increaseMinButton.click(); // min: 10 -> 25
      }
      for (let i = 0; i < 3; i++) {
        await decreaseMaxButton.click(); // max: 30 -> 15, min -> 15
      }

      // Verify handles are adjusted to fit within the new constraints
      await expect(handle1).toHaveAttribute('aria-valuenow', '40');
      await expect(handle2).toHaveAttribute('aria-valuenow', '55');
    });

    test('should handle edge case when gap constraints become invalid', async ({ page }) => {
      const slider = page.locator('#dynamic-gaps');
      const handles = slider.locator('.rangeHandle');
      const handle1 = handles.first();
      const handle2 = handles.nth(1);
      const increaseMinButton = page.locator('#btn_increase_min');
      const decreaseMaxButton = page.locator('#btn_decrease_max');

      await slider.scrollIntoViewIfNeeded();

      // Verify initial state: values [40, 60] with gap 20, constraints min: 10, max: 30
      await expect(handle1).toHaveAttribute('aria-valuenow', '40');
      await expect(handle2).toHaveAttribute('aria-valuenow', '60');

      // Make min gap larger than max gap
      for (let i = 0; i < 5; i++) {
        await increaseMinButton.click(); // min: 10 -> 35
      }
      for (let i = 0; i < 5; i++) {
        await decreaseMaxButton.click(); // max: 30 -> 5
      }

      // Verify handles are adjusted to a valid state (min gap = max gap)
      await expect(handle1).toHaveAttribute('aria-valuenow', '40');
      await expect(handle2).toHaveAttribute('aria-valuenow', '45');
    });

    test("should maintain handle positions when gap changes don't affect current values", async ({ page }) => {
      const slider = page.locator('#dynamic-gaps');
      const handles = slider.locator('.rangeHandle');
      const handle1 = handles.first();
      const handle2 = handles.nth(1);
      const increaseMaxButton = page.locator('#btn_increase_max');

      await slider.scrollIntoViewIfNeeded();

      // Verify initial state: values [40, 60] with gap 20, constraints min: 10, max: 30
      await expect(handle1).toHaveAttribute('aria-valuenow', '40');
      await expect(handle2).toHaveAttribute('aria-valuenow', '60');

      // Increase maximum gap - should not affect current values since 20 < 35
      await increaseMaxButton.click();
      await expect(handle1).toHaveAttribute('aria-valuenow', '40');
      await expect(handle2).toHaveAttribute('aria-valuenow', '60');
    });

    test('should NOT emit change events when handles are adjusted due to gap changes', async ({ page }) => {
      const slider = page.locator('#dynamic-gaps');
      const handles = slider.locator('.rangeHandle');
      const handle1 = handles.first();
      const handle2 = handles.nth(1);
      const increaseMinButton = page.locator('#btn_increase_min');

      await slider.scrollIntoViewIfNeeded();

      // Verify initial state: values [40, 60] with gap 20, constraints min: 10, max: 30
      await expect(handle1).toHaveAttribute('aria-valuenow', '40');
      await expect(handle2).toHaveAttribute('aria-valuenow', '60');

      // Listen for change events
      const changeEvents: string[] = [];
      page.on('console', (message) => {
        if (message.text().includes('Change event:')) {
          changeEvents.push(message.text());
        }
      });

      // Increase minimum gap to 25 to trigger handle adjustment
      for (let i = 0; i < 3; i++) {
        await increaseMinButton.click(); // min: 10 -> 25
      }
      await page.waitForTimeout(200);

      // Verify NO change event was emitted when gap constraints changed
      expect(changeEvents.length).toBe(0);

      // Verify handles were adjusted correctly
      await expect(handle1).toHaveAttribute('aria-valuenow', '40');
      await expect(handle2).toHaveAttribute('aria-valuenow', '65');
    });
  });

  test.describe('Performance Tests', () => {
    test('should handle gap values without performance issues', async ({ page }) => {
      const slider = page.locator('#large-gap-values');
      const handles = slider.locator('.rangeHandle');
      const handle1 = handles.first();
      const handle2 = handles.nth(1);

      await slider.scrollIntoViewIfNeeded();

      // Verify initial state
      await expect(handle1).toHaveAttribute('aria-valuenow', '10');
      await expect(handle2).toHaveAttribute('aria-valuenow', '90');

      // Test rapid movements
      const sliderBounds = await slider.boundingBox();
      if (!sliderBounds) throw new Error('Could not get slider bounds');

      await page.mouse.move(sliderBounds.x + sliderBounds.width * 0.5, sliderBounds.y + sliderBounds.height / 2);
      await page.mouse.down();

      // Quick movements back and forth
      for (const position of [0.8, 0.2, 0.6, 0.4, 0.9]) {
        await page.mouse.move(
          sliderBounds.x + sliderBounds.width * position,
          sliderBounds.y + sliderBounds.height / 2,
          { steps: 5 }
        );
      }

      await page.mouse.up();

      // Verify final state respects gaps
      await expect(handle1).toHaveAttribute('aria-valuenow', '40');
      await expect(handle2).toHaveAttribute('aria-valuenow', '90');
    });
  });
});
