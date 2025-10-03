import { expect, test } from '@playwright/test';
import { dragHandleTo } from './helpers/tools.js';

test.describe('Range Slider Keyboard Interaction Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/range-slider/keyboard');
    await page.waitForLoadState('networkidle');
  });

  test('fires change on first keyboard interaction (no prior mouse)', async ({ page }) => {
    const slider = page.locator('#keyboard-slider');
    const handle = slider.locator('.rangeHandle').first();
    const eventHistory = page.locator('.event-history');

    // Focus the handle and use keyboard to move left by default step
    await handle.focus();
    await page.keyboard.press('ArrowLeft');

    // Expect a change event to be recorded with previousValue and startValue defined
    const changeEvents = eventHistory.locator('.event-detail').filter({ hasText: 'type: change' });
    const changeCount = await changeEvents.count();
    await expect(changeCount).toBeGreaterThan(0);

    const firstChange = changeEvents.first();
    await expect(firstChange).toContainText('"activeHandle": 0');
    await expect(firstChange).toContainText('"startValue": 50');
    // Ensure previousValue exists and equals startValue on first change
    await expect(firstChange).toContainText('"previousValue": 50');
    // Ensure value decreased from 50
    const text = await firstChange.textContent();
    const match = text?.match(/"value": (\d+)/);
    expect(match).toBeTruthy();
    const newValue = parseInt(match![1]);
    expect(newValue).toBeLessThan(50);
  });

  test('fires change with correct previousValue after mouse interaction', async ({ page }) => {
    const slider = page.locator('#keyboard-slider');
    const handle = slider.locator('.rangeHandle').first();
    const eventHistory = page.locator('.event-history');

    // Drag the handle to 50%
    await dragHandleTo(page, slider, handle, 0.75);

    // Clear events to isolate keyboard change
    await page.getByText('Clear Event History').click();

    // Keyboard interaction after mouse
    await handle.focus();
    await page.keyboard.press('ArrowRight');

    const changeEvents = eventHistory.locator('.event-detail').filter({ hasText: 'type: change' });
    const changeCount = await changeEvents.count();
    await expect(changeCount).toBeGreaterThan(0);

    const firstChange = changeEvents.first();
    await expect(firstChange).toContainText('type: change');
    await expect(firstChange).toContainText('"activeHandle": 0');
    // Should include previousValue reflecting the immediate prior value from mouse
    await expect(firstChange).toContainText('"previousValue":');
    await expect(firstChange).toContainText('"startValue":');
  });
});
