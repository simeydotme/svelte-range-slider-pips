import { expect, test } from '@playwright/test';
import { dragHandleTo } from './helpers/tools.js';

test.describe('Range Slider Event Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/range-slider/events');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Single Handle Events', () => {
    test('should fire correct events when dragging handle', async ({ page }) => {
      const slider = page.locator('#range-slider');
      const handle = slider.locator('.rangeHandle').first();
      const eventHistory = page.locator('.event-history');

      // Initial state check
      await expect(handle).toHaveAttribute('aria-valuenow', '50');

      // Start dragging
      await dragHandleTo(page, slider, handle, 0.8);

      // Check start event
      const startEvent = eventHistory.locator('.event-detail').first();
      await expect(startEvent).toContainText('"activeHandle": 0');
      await expect(startEvent).toContainText('"value": 50');
      await expect(startEvent).toContainText(`"values": [
        50,
        75
      ]`);

      // Check change events
      const changeEvents = eventHistory.locator('.event-detail').filter({ hasText: 'type: change' });

      // Verify we have at least some change events
      const changeCount = await changeEvents.count();
      expect(changeCount).toBeGreaterThan(0);

      // Sample 3 change events at different positions in the sequence
      const firstChange = changeEvents.first();
      const middleChange = changeEvents.nth(Math.floor(changeCount / 2));
      const lastChange = changeEvents.last();

      // Verify first change event
      await expect(firstChange).toContainText('"activeHandle": 0');
      await expect(firstChange).toContainText('"startValue": 50');
      const firstChangeValue = await firstChange.textContent();
      const firstChangeValueMatch = firstChangeValue?.match(/"value": (\d+)/);
      expect(firstChangeValueMatch).toBeTruthy();
      const firstValue = parseInt(firstChangeValueMatch![1]);
      expect(firstValue).toBeGreaterThan(50);
      expect(firstValue).toBeLessThan(80);
      // Check values array for first change
      const firstValuesMatch = firstChangeValue?.match(/"values":\s*\[([\d\s,]+)\]/);
      expect(firstValuesMatch).toBeTruthy();
      const firstValues = firstValuesMatch![1].split(',').map((v) => parseInt(v.trim()));
      expect(firstValues).toHaveLength(2);
      expect(firstValues[0]).toBe(firstValue);
      expect(firstValues[1]).toBe(75);

      // Verify middle change event
      await expect(middleChange).toContainText('"activeHandle": 0');
      await expect(middleChange).toContainText('"startValue": 50');
      const middleChangeValue = await middleChange.textContent();
      const middleChangeValueMatch = middleChangeValue?.match(/"value": (\d+)/);
      expect(middleChangeValueMatch).toBeTruthy();
      const middleValue = parseInt(middleChangeValueMatch![1]);
      expect(middleValue).toBeGreaterThan(firstValue);
      expect(middleValue).toBeLessThan(80);
      // Check values array for middle change
      const middleValuesMatch = middleChangeValue?.match(/"values":\s*\[([\d\s,]+)\]/);
      expect(middleValuesMatch).toBeTruthy();
      const middleValues = middleValuesMatch![1].split(',').map((v) => parseInt(v.trim()));
      expect(middleValues).toHaveLength(2);
      expect(middleValues[0]).toBe(middleValue);
      expect(middleValues[1]).toBe(75);

      // Verify last change event
      await expect(lastChange).toContainText('"activeHandle": 0');
      await expect(lastChange).toContainText('"startValue": 50');
      const lastChangeValue = await lastChange.textContent();
      const lastChangeValueMatch = lastChangeValue?.match(/"value": (\d+)/);
      expect(lastChangeValueMatch).toBeTruthy();
      const lastValue = parseInt(lastChangeValueMatch![1]);
      expect(lastValue).toBeGreaterThan(middleValue);
      expect(lastValue).toBeLessThanOrEqual(80);
      // Check values array for last change
      const lastValuesMatch = lastChangeValue?.match(/"values":\s*\[([\d\s,]+)\]/);
      expect(lastValuesMatch).toBeTruthy();
      const lastValues = lastValuesMatch![1].split(',').map((v) => parseInt(v.trim()));
      expect(lastValues).toHaveLength(2);
      expect(lastValues[0]).toBe(lastValue);
      expect(lastValues[1]).toBe(75);

      // Check stop event
      const stopEvent = eventHistory.locator('.event-detail').last();
      await expect(stopEvent).toContainText('"activeHandle": 0');
      await expect(stopEvent).toContainText('"startValue": 50');
      await expect(stopEvent).toContainText('"value": 80');
      await expect(stopEvent).toContainText(`"values": [
        80,
        75
      ]`);
    });

    test('should fire correct events when clicking handle', async ({ page }) => {
      const slider = page.locator('#single-handle-slider');
      const handle = slider.locator('.rangeHandle').first();
      const eventHistory = page.locator('.event-history');

      // Click handle
      await handle.click();

      // Check start event
      await expect(eventHistory.locator('.event-detail').first()).toContainText('type: start');
      await expect(eventHistory.locator('.event-detail').first()).toContainText('"activeHandle": 0');
      await expect(eventHistory.locator('.event-detail').first()).toContainText('"value": 50');

      // Check stop event
      const stopEvent = eventHistory.locator('.event-detail').filter({ hasText: 'type: stop' }).first();
      await expect(stopEvent).toContainText('"activeHandle": 0');
      await expect(stopEvent).toContainText('"startValue": 50');
      await expect(stopEvent).toContainText('"value": 50');

      // Verify no change events were fired
      const changeEvents = eventHistory.locator('.event-detail').filter({ hasText: 'type: change' });
      await expect(changeEvents).toHaveCount(0);
    });
  });

  test.describe('Range Mode Events', () => {
    test.beforeEach(async ({ page }) => {
      // Enable range mode
      await page.getByLabel('Enable Range Mode').check();
    });

    test('should fire correct events when dragging range handles', async ({ page }) => {
      const slider = page.locator('#range-slider');
      const handles = slider.locator('.rangeHandle');
      const eventHistory = page.locator('.event-history');

      // Drag first handle
      await dragHandleTo(page, slider, handles.first(), 0.3);

      // Check start event for first handle
      await expect(eventHistory.locator('.event-detail').first()).toContainText('type: start');
      await expect(eventHistory.locator('.event-detail').first()).toContainText('"activeHandle": 0');
      await expect(eventHistory.locator('.event-detail').first()).toContainText(`"values": [
        50,
        75
      ]`);

      // Check change events for first handle
      const changeEvents = eventHistory.locator('.event-detail').filter({ hasText: 'type: change' });

      // Verify we have at least some change events
      const changeCount = await changeEvents.count();
      expect(changeCount).toBeGreaterThan(0);

      // Sample 3 change events at different positions in the sequence
      const firstChange = changeEvents.first();
      const middleChange = changeEvents.nth(Math.floor(changeCount / 2));
      const lastChange = changeEvents.last();

      // Verify first change event
      await expect(firstChange).toContainText('"activeHandle": 0');
      await expect(firstChange).toContainText('"startValue": 50');
      const firstChangeValue = await firstChange.textContent();
      const firstChangeValueMatch = firstChangeValue?.match(/"value": (\d+)/);
      expect(firstChangeValueMatch).toBeTruthy();
      const firstValue = parseInt(firstChangeValueMatch![1]);
      expect(firstValue).toBeLessThan(50);
      expect(firstValue).toBeGreaterThan(30);
      // Check values array for first change
      const firstValuesMatch = firstChangeValue?.match(/"values":\s*\[([\d\s,]+)\]/);
      expect(firstValuesMatch).toBeTruthy();
      const firstValues = firstValuesMatch![1].split(',').map((v) => parseInt(v.trim()));
      expect(firstValues).toHaveLength(2);
      expect(firstValues[0]).toBe(firstValue);
      expect(firstValues[1]).toBe(75);

      // Verify middle change event
      await expect(middleChange).toContainText('"activeHandle": 0');
      await expect(middleChange).toContainText('"startValue": 50');
      const middleChangeValue = await middleChange.textContent();
      const middleChangeValueMatch = middleChangeValue?.match(/"value": (\d+)/);
      expect(middleChangeValueMatch).toBeTruthy();
      const middleValue = parseInt(middleChangeValueMatch![1]);
      expect(middleValue).toBeLessThan(firstValue);
      expect(middleValue).toBeGreaterThan(30);
      // Check values array for middle change
      const middleValuesMatch = middleChangeValue?.match(/"values":\s*\[([\d\s,]+)\]/);
      expect(middleValuesMatch).toBeTruthy();
      const middleValues = middleValuesMatch![1].split(',').map((v) => parseInt(v.trim()));
      expect(middleValues).toHaveLength(2);
      expect(middleValues[0]).toBe(middleValue);
      expect(middleValues[1]).toBe(75);

      // Verify last change event
      await expect(lastChange).toContainText('"activeHandle": 0');
      await expect(lastChange).toContainText('"startValue": 50');
      const lastChangeValue = await lastChange.textContent();
      const lastChangeValueMatch = lastChangeValue?.match(/"value": (\d+)/);
      expect(lastChangeValueMatch).toBeTruthy();
      const lastValue = parseInt(lastChangeValueMatch![1]);
      expect(lastValue).toBeLessThan(middleValue);
      expect(lastValue).toBeGreaterThanOrEqual(30);
      // Check values array for last change
      const lastValuesMatch = lastChangeValue?.match(/"values":\s*\[([\d\s,]+)\]/);
      expect(lastValuesMatch).toBeTruthy();
      const lastValues = lastValuesMatch![1].split(',').map((v) => parseInt(v.trim()));
      expect(lastValues).toHaveLength(2);
      expect(lastValues[0]).toBe(lastValue);
      expect(lastValues[1]).toBe(75);

      // Check stop event for first handle
      const stopEvent = eventHistory.locator('.event-detail').filter({ hasText: 'type: stop' }).first();
      await expect(stopEvent).toContainText('"activeHandle": 0');
      await expect(stopEvent).toContainText('"startValue": 50');
      await expect(stopEvent).toContainText(`"values": [
        30,
        75
      ]`);

      // Clear event history
      await page.getByText('Clear Event History').click();

      // Drag second handle
      await dragHandleTo(page, slider, handles.nth(1), 0.7);

      // Check start event for second handle
      await expect(eventHistory.locator('.event-detail').first()).toContainText('type: start');
      await expect(eventHistory.locator('.event-detail').first()).toContainText('"activeHandle": 1');
      await expect(eventHistory.locator('.event-detail').first()).toContainText(`"values": [
        30,
        75
      ]`);

      // Check change events for second handle
      const secondChangeEvents = eventHistory.locator('.event-detail').filter({ hasText: 'type: change' });

      // Verify we have at least some change events
      const secondChangeCount = await secondChangeEvents.count();
      expect(secondChangeCount).toBeGreaterThan(0);

      // Sample 3 change events at different positions in the sequence
      const secondFirstChange = secondChangeEvents.first();
      const secondMiddleChange = secondChangeEvents.nth(Math.floor(secondChangeCount / 2));
      const secondLastChange = secondChangeEvents.last();

      // Verify first change event
      await expect(secondFirstChange).toContainText('"activeHandle": 1');
      await expect(secondFirstChange).toContainText('"startValue": 75');
      const secondFirstChangeValue = await secondFirstChange.textContent();
      const secondFirstChangeValueMatch = secondFirstChangeValue?.match(/"value": (\d+)/);
      expect(secondFirstChangeValueMatch).toBeTruthy();
      const secondFirstValue = parseInt(secondFirstChangeValueMatch![1]);
      expect(secondFirstValue).toBeLessThan(75);
      expect(secondFirstValue).toBeGreaterThan(50);
      // Check values array for first change
      const secondFirstValuesMatch = secondFirstChangeValue?.match(/"values":\s*\[([\d\s,]+)\]/);
      expect(secondFirstValuesMatch).toBeTruthy();
      const secondFirstValues = secondFirstValuesMatch![1].split(',').map((v) => parseInt(v.trim()));
      expect(secondFirstValues).toHaveLength(2);
      expect(secondFirstValues[0]).toBe(30);
      expect(secondFirstValues[1]).toBe(secondFirstValue);

      // Verify middle change event
      await expect(secondMiddleChange).toContainText('"activeHandle": 1');
      await expect(secondMiddleChange).toContainText('"startValue": 75');
      const secondMiddleChangeValue = await secondMiddleChange.textContent();
      const secondMiddleChangeValueMatch = secondMiddleChangeValue?.match(/"value": (\d+)/);
      expect(secondMiddleChangeValueMatch).toBeTruthy();
      const secondMiddleValue = parseInt(secondMiddleChangeValueMatch![1]);
      expect(secondMiddleValue).toBeLessThan(secondFirstValue);
      expect(secondMiddleValue).toBeGreaterThan(50);
      // Check values array for middle change
      const secondMiddleValuesMatch = secondMiddleChangeValue?.match(/"values":\s*\[([\d\s,]+)\]/);
      expect(secondMiddleValuesMatch).toBeTruthy();
      const secondMiddleValues = secondMiddleValuesMatch![1].split(',').map((v) => parseInt(v.trim()));
      expect(secondMiddleValues).toHaveLength(2);
      expect(secondMiddleValues[0]).toBe(30);
      expect(secondMiddleValues[1]).toBe(secondMiddleValue);

      // Verify last change event
      await expect(secondLastChange).toContainText('"activeHandle": 1');
      await expect(secondLastChange).toContainText('"startValue": 75');
      const secondLastChangeValue = await secondLastChange.textContent();
      const secondLastChangeValueMatch = secondLastChangeValue?.match(/"value": (\d+)/);
      expect(secondLastChangeValueMatch).toBeTruthy();
      const secondLastValue = parseInt(secondLastChangeValueMatch![1]);
      expect(secondLastValue).toBeLessThan(secondMiddleValue);
      expect(secondLastValue).toBeGreaterThanOrEqual(50);
      // Check values array for last change
      const secondLastValuesMatch = secondLastChangeValue?.match(/"values":\s*\[([\d\s,]+)\]/);
      expect(secondLastValuesMatch).toBeTruthy();
      const secondLastValues = secondLastValuesMatch![1].split(',').map((v) => parseInt(v.trim()));
      expect(secondLastValues).toHaveLength(2);
      expect(secondLastValues[0]).toBe(30);
      expect(secondLastValues[1]).toBe(secondLastValue);

      // Check stop event for second handle
      const secondStopEvent = eventHistory.locator('.event-detail').filter({ hasText: 'type: stop' }).last();
      await expect(secondStopEvent).toContainText('"activeHandle": 1');
      await expect(secondStopEvent).toContainText('"startValue": 75');
      await expect(secondStopEvent).toContainText(`"values": [
        30,
        70
      ]`);
    });
  });

  test.describe('Draggy Range Mode Events', () => {
    test.beforeEach(async ({ page }) => {
      // Enable range mode and draggy mode
      await page.getByLabel('Enable Range Mode').check();
      await page.getByLabel('Enable Draggable Range').check();
    });

    test('should fire correct events when dragging range bar', async ({ page }) => {
      const slider = page.locator('#range-slider');
      const rangeBar = slider.locator('.rangeBar');
      const eventHistory = page.locator('.event-history');

      // Drag range bar
      await dragHandleTo(page, slider, rangeBar, 0.4);

      // Check start event
      await expect(eventHistory.locator('.event-detail').first()).toContainText('type: start');
      await expect(eventHistory.locator('.event-detail').first()).toContainText('"activeHandle": -1');
      await expect(eventHistory.locator('.event-detail').first()).toContainText(`"values": [
        50,
        75
      ]`);
      // Verify value property is not present in start event
      const startEventText = await eventHistory.locator('.event-detail').first().textContent();
      expect(startEventText).not.toContain('"value":');

      // Check change events
      const changeEvents = eventHistory.locator('.event-detail').filter({ hasText: 'type: change' });

      // Verify we have at least some change events
      const changeCount = await changeEvents.count();
      expect(changeCount).toBeGreaterThan(0);

      // Sample 3 change events at different positions in the sequence
      const firstChange = changeEvents.first();
      const middleChange = changeEvents.nth(Math.floor(changeCount / 2));
      const lastChange = changeEvents.last();

      // Verify first change event
      await expect(firstChange).toContainText('"activeHandle": -1');
      await expect(firstChange).toContainText(`"startValue": [
        50,
        75
      ]`);
      await expect(firstChange).toContainText(`"previousValue": [
        50,
        75
      ]`);
      // Verify value property is not present in first change event
      const firstChangeText = await firstChange.textContent();
      expect(firstChangeText).not.toContain('"value":');
      const firstChangeValue = await firstChange.textContent();
      const firstValuesMatch = firstChangeValue?.match(/"values":\s*\[([\d\s,]+)\]/);
      expect(firstValuesMatch).toBeTruthy();
      const firstValues = firstValuesMatch![1].split(',').map((v) => parseInt(v.trim()));
      expect(firstValues).toHaveLength(2);
      expect(firstValues[0]).toBeLessThan(50);
      expect(firstValues[0]).toBeGreaterThan(27);
      expect(firstValues[1]).toBeLessThan(75);
      expect(firstValues[1]).toBeGreaterThan(52);

      // Verify middle change event
      await expect(middleChange).toContainText('"activeHandle": -1');
      await expect(middleChange).toContainText(`"startValue": [
        50,
        75
      ]`);
      // Verify value property is not present in middle change event
      const middleChangeText = await middleChange.textContent();
      expect(middleChangeText).not.toContain('"value":');
      const middleChangeValue = await middleChange.textContent();
      const middlePreviousValueMatch = middleChangeValue?.match(/"previousValue":\s*\[([\d\s,]+)\]/);
      expect(middlePreviousValueMatch).toBeTruthy();
      const middlePreviousValues = middlePreviousValueMatch![1].split(',').map((v) => parseInt(v.trim()));
      expect(middlePreviousValues).toHaveLength(2);
      expect(middlePreviousValues[0]).toBeLessThanOrEqual(firstValues[0]);
      expect(middlePreviousValues[1]).toBeLessThanOrEqual(firstValues[1]);
      const middleValuesMatch = middleChangeValue?.match(/"values":\s*\[([\d\s,]+)\]/);
      expect(middleValuesMatch).toBeTruthy();
      const middleValues = middleValuesMatch![1].split(',').map((v) => parseInt(v.trim()));
      expect(middleValues).toHaveLength(2);
      expect(middleValues[0]).toBeLessThan(middlePreviousValues[0]);
      expect(middleValues[0]).toBeGreaterThan(27);
      expect(middleValues[1]).toBeLessThan(middlePreviousValues[1]);
      expect(middleValues[1]).toBeGreaterThan(52);

      // Verify last change event
      await expect(lastChange).toContainText('"activeHandle": -1');
      await expect(lastChange).toContainText(`"startValue": [
        50,
        75
      ]`);
      // Verify value property is not present in last change event
      const lastChangeText = await lastChange.textContent();
      expect(lastChangeText).not.toContain('"value":');
      const lastChangeValue = await lastChange.textContent();
      const lastPreviousValueMatch = lastChangeValue?.match(/"previousValue":\s*\[([\d\s,]+)\]/);
      expect(lastPreviousValueMatch).toBeTruthy();
      const lastPreviousValues = lastPreviousValueMatch![1].split(',').map((v) => parseInt(v.trim()));
      expect(lastPreviousValues).toHaveLength(2);
      expect(lastPreviousValues[0]).toBeLessThanOrEqual(middleValues[0]);
      expect(lastPreviousValues[1]).toBeLessThanOrEqual(middleValues[1]);
      const lastValuesMatch = lastChangeValue?.match(/"values":\s*\[([\d\s,]+)\]/);
      expect(lastValuesMatch).toBeTruthy();
      const lastValues = lastValuesMatch![1].split(',').map((v) => parseInt(v.trim()));
      expect(lastValues).toHaveLength(2);
      expect(lastValues[0]).toBeLessThan(lastPreviousValues[0]);
      expect(lastValues[0]).toBeGreaterThanOrEqual(27);
      expect(lastValues[1]).toBeLessThan(lastPreviousValues[1]);
      expect(lastValues[1]).toBeGreaterThanOrEqual(52);

      // Check stop event
      const stopEvent = eventHistory.locator('.event-detail').filter({ hasText: 'type: stop' }).first();
      await expect(stopEvent).toContainText('"activeHandle": -1');
      await expect(stopEvent).toContainText(`"startValue": [
        50,
        75
      ]`);
      await expect(stopEvent).toContainText(`"values": [
        27,
        52
      ]`);
      // Verify value property is not present in stop event
      const stopEventText = await stopEvent.textContent();
      expect(stopEventText).not.toContain('"value":');
    });
  });

  test.describe('Single Handle Mode Events', () => {
    test('should fire correct events when dragging handle', async ({ page }) => {
      const slider = page.locator('#range-slider');
      const handle = slider.locator('.rangeHandle').first();
      const eventHistory = page.locator('.event-history');

      // Drag handle
      await dragHandleTo(page, slider, handle, 0.3);

      // Check start event
      await expect(eventHistory.locator('.event-detail').first()).toContainText('type: start');
      await expect(eventHistory.locator('.event-detail').first()).toContainText('"activeHandle": 0');
      await expect(eventHistory.locator('.event-detail').first()).toContainText('"value": 50');

      // Check change events
      const changeEvents = eventHistory.locator('.event-detail').filter({ hasText: 'type: change' });

      // Verify we have at least some change events
      const changeCount = await changeEvents.count();
      expect(changeCount).toBeGreaterThan(0);

      // Sample 3 change events at different positions in the sequence
      const firstChange = changeEvents.first();
      const middleChange = changeEvents.nth(Math.floor(changeCount / 2));
      const lastChange = changeEvents.last();

      // Verify first change event
      await expect(firstChange).toContainText('"activeHandle": 0');
      await expect(firstChange).toContainText('"startValue": 50');
      const firstChangeValue = await firstChange.textContent();
      const firstChangeValueMatch = firstChangeValue?.match(/"value": (\d+)/);
      expect(firstChangeValueMatch).toBeTruthy();
      const firstValue = parseInt(firstChangeValueMatch![1]);
      expect(firstValue).toBeLessThan(50);
      expect(firstValue).toBeGreaterThan(30);
      // Check values array for first change
      const firstValuesMatch = firstChangeValue?.match(/"values":\s*\[([\d\s,]+)\]/);
      expect(firstValuesMatch).toBeTruthy();
      const firstValues = firstValuesMatch![1].split(',').map((v) => parseInt(v.trim()));
      expect(firstValues).toHaveLength(2);
      expect(firstValues[0]).toBe(firstValue);
      expect(firstValues[1]).toBe(75);

      // Verify middle change event
      await expect(middleChange).toContainText('"activeHandle": 0');
      await expect(middleChange).toContainText('"startValue": 50');
      const middleChangeValue = await middleChange.textContent();
      const middleChangeValueMatch = middleChangeValue?.match(/"value": (\d+)/);
      expect(middleChangeValueMatch).toBeTruthy();
      const middleValue = parseInt(middleChangeValueMatch![1]);
      expect(middleValue).toBeLessThan(firstValue);
      expect(middleValue).toBeGreaterThan(30);
      // Check values array for middle change
      const middleValuesMatch = middleChangeValue?.match(/"values":\s*\[([\d\s,]+)\]/);
      expect(middleValuesMatch).toBeTruthy();
      const middleValues = middleValuesMatch![1].split(',').map((v) => parseInt(v.trim()));
      expect(middleValues).toHaveLength(2);
      expect(middleValues[0]).toBe(middleValue);
      expect(middleValues[1]).toBe(75);

      // Verify last change event
      await expect(lastChange).toContainText('"activeHandle": 0');
      await expect(lastChange).toContainText('"startValue": 50');
      const lastChangeValue = await lastChange.textContent();
      const lastChangeValueMatch = lastChangeValue?.match(/"value": (\d+)/);
      expect(lastChangeValueMatch).toBeTruthy();
      const lastValue = parseInt(lastChangeValueMatch![1]);
      expect(lastValue).toBeLessThan(middleValue);
      expect(lastValue).toBeGreaterThanOrEqual(30);
      // Check values array for last change
      const lastValuesMatch = lastChangeValue?.match(/"values":\s*\[([\d\s,]+)\]/);
      expect(lastValuesMatch).toBeTruthy();
      const lastValues = lastValuesMatch![1].split(',').map((v) => parseInt(v.trim()));
      expect(lastValues).toHaveLength(2);
      expect(lastValues[0]).toBe(lastValue);
      expect(lastValues[1]).toBe(75);

      // Check stop event
      const stopEvent = eventHistory.locator('.event-detail').filter({ hasText: 'type: stop' }).first();
      await expect(stopEvent).toContainText('"activeHandle": 0');
      await expect(stopEvent).toContainText('"startValue": 50');
      await expect(stopEvent).toContainText('"value": 30');
      await expect(stopEvent).toContainText(`"values": [
        30,
        75
      ]`);
    });
  });

  test.describe('Disabled Slider Events', () => {
    test('should not fire events when interacting with disabled slider', async ({ page }) => {
      const slider = page.locator('#disabled-slider');
      const handle = slider.locator('.rangeHandle').first();
      const rangeBar = slider.locator('.rangeBar');
      const pipLabels = slider.locator('.rsPipVal');
      const eventHistory = page.locator('.event-history');

      // First verify elements are disabled
      await expect(handle).toHaveAttribute('aria-disabled', 'true');
      await expect(slider).toHaveClass(/\brsDisabled\b/);

      // Get bounding boxes for elements
      const handleBox = await handle.boundingBox();
      const rangeBarBox = await rangeBar.boundingBox();
      const firstPipBox = await pipLabels.first().boundingBox();
      const lastPipBox = await pipLabels.last().boundingBox();

      // Try clicking handle
      await page.mouse.click(handleBox!.x + handleBox!.width / 2, handleBox!.y + handleBox!.height / 2);

      // Try clicking range bar
      await page.mouse.click(rangeBarBox!.x + rangeBarBox!.width / 2, rangeBarBox!.y + rangeBarBox!.height / 2);

      // Try clicking pip labels
      await page.mouse.click(firstPipBox!.x + firstPipBox!.width / 2, firstPipBox!.y + firstPipBox!.height / 2);
      await page.mouse.click(lastPipBox!.x + lastPipBox!.width / 2, lastPipBox!.y + lastPipBox!.height / 2);

      // Try dragging handle
      await page.mouse.move(handleBox!.x + handleBox!.width / 2, handleBox!.y + handleBox!.height / 2);
      await page.mouse.down();
      await page.mouse.move(handleBox!.x + 100, handleBox!.y + handleBox!.height / 2);
      await page.mouse.up();

      // Verify no events were fired
      const events = eventHistory.locator('.event-detail');
      await expect(events).toHaveCount(0);
    });
  });

  test.describe('Multi-Handle Slider Events', () => {
    test('should fire correct events when dragging handles', async ({ page }) => {
      const slider = page.locator('#multi-handle-slider');
      const handles = slider.locator('.rangeHandle');
      const eventHistory = page.locator('.event-history');

      // Drag first handle
      await dragHandleTo(page, slider, handles.first(), 0.2);

      // Check start event
      await expect(eventHistory.locator('.event-detail').first()).toContainText('type: start');
      await expect(eventHistory.locator('.event-detail').first()).toContainText('"activeHandle": 0');
      await expect(eventHistory.locator('.event-detail').first()).toContainText(`"values": [
        10,
        30,
        50,
        70,
        90
      ]`);

      // Check change events
      const changeEvents = eventHistory.locator('.event-detail').filter({ hasText: 'type: change' });

      // Verify we have at least some change events
      const changeCount = await changeEvents.count();
      expect(changeCount).toBeGreaterThan(0);

      // Sample 3 change events at different positions in the sequence
      const firstChange = changeEvents.first();
      const middleChange = changeEvents.nth(Math.floor(changeCount / 2));
      const lastChange = changeEvents.last();

      // Verify first change event
      await expect(firstChange).toContainText('"activeHandle": 0');
      await expect(firstChange).toContainText('"startValue": 10');
      const firstChangeValue = await firstChange.textContent();
      const firstChangeValueMatch = firstChangeValue?.match(/"value": (\d+)/);
      expect(firstChangeValueMatch).toBeTruthy();
      const firstValue = parseInt(firstChangeValueMatch![1]);
      expect(firstValue).toBeGreaterThan(10);
      expect(firstValue).toBeLessThan(20);
      // Check values array for first change
      const firstValuesMatch = firstChangeValue?.match(/"values":\s*\[([\d\s,]+)\]/);
      expect(firstValuesMatch).toBeTruthy();
      const firstValues = firstValuesMatch![1].split(',').map((v) => parseInt(v.trim()));
      expect(firstValues).toHaveLength(5);
      expect(firstValues[0]).toBe(firstValue);
      expect(firstValues[1]).toBe(30);
      expect(firstValues[2]).toBe(50);
      expect(firstValues[3]).toBe(70);
      expect(firstValues[4]).toBe(90);

      // Verify middle change event
      await expect(middleChange).toContainText('"activeHandle": 0');
      await expect(middleChange).toContainText('"startValue": 10');
      const middleChangeValue = await middleChange.textContent();
      const middleChangeValueMatch = middleChangeValue?.match(/"value": (\d+)/);
      expect(middleChangeValueMatch).toBeTruthy();
      const middleValue = parseInt(middleChangeValueMatch![1]);
      expect(middleValue).toBeGreaterThan(firstValue);
      expect(middleValue).toBeLessThan(20);
      // Check values array for middle change
      const middleValuesMatch = middleChangeValue?.match(/"values":\s*\[([\d\s,]+)\]/);
      expect(middleValuesMatch).toBeTruthy();
      const middleValues = middleValuesMatch![1].split(',').map((v) => parseInt(v.trim()));
      expect(middleValues).toHaveLength(5);
      expect(middleValues[0]).toBe(middleValue);
      expect(middleValues[1]).toBe(30);
      expect(middleValues[2]).toBe(50);
      expect(middleValues[3]).toBe(70);
      expect(middleValues[4]).toBe(90);

      // Verify last change event
      await expect(lastChange).toContainText('"activeHandle": 0');
      await expect(lastChange).toContainText('"startValue": 10');
      const lastChangeValue = await lastChange.textContent();
      const lastChangeValueMatch = lastChangeValue?.match(/"value": (\d+)/);
      expect(lastChangeValueMatch).toBeTruthy();
      const lastValue = parseInt(lastChangeValueMatch![1]);
      expect(lastValue).toBeGreaterThan(middleValue);
      expect(lastValue).toBeLessThanOrEqual(20);
      // Check values array for last change
      const lastValuesMatch = lastChangeValue?.match(/"values":\s*\[([\d\s,]+)\]/);
      expect(lastValuesMatch).toBeTruthy();
      const lastValues = lastValuesMatch![1].split(',').map((v) => parseInt(v.trim()));
      expect(lastValues).toHaveLength(5);
      expect(lastValues[0]).toBe(lastValue);
      expect(lastValues[1]).toBe(30);
      expect(lastValues[2]).toBe(50);
      expect(lastValues[3]).toBe(70);
      expect(lastValues[4]).toBe(90);

      // Check stop event
      const stopEvent = eventHistory.locator('.event-detail').filter({ hasText: 'type: stop' }).first();
      await expect(stopEvent).toContainText('"activeHandle": 0');
      await expect(stopEvent).toContainText('"startValue": 10');
      await expect(stopEvent).toContainText('"value": 20');
      await expect(stopEvent).toContainText(`"values": [
        20,
        30,
        50,
        70,
        90
      ]`);

      // Clear event history
      await page.getByText('Clear Event History').click();

      // Drag middle handle
      await dragHandleTo(page, slider, handles.nth(2), 0.6);

      // Check start event
      await expect(eventHistory.locator('.event-detail').first()).toContainText('type: start');
      await expect(eventHistory.locator('.event-detail').first()).toContainText('"activeHandle": 2');
      await expect(eventHistory.locator('.event-detail').first()).toContainText(`"values": [
        20,
        30,
        50,
        70,
        90
      ]`);

      // Check change events
      const secondChangeEvents = eventHistory.locator('.event-detail').filter({ hasText: 'type: change' });

      // Verify we have at least some change events
      const secondChangeCount = await secondChangeEvents.count();
      expect(secondChangeCount).toBeGreaterThan(0);

      // Sample 3 change events at different positions in the sequence
      const secondFirstChange = secondChangeEvents.first();
      const secondMiddleChange = secondChangeEvents.nth(Math.floor(secondChangeCount / 2));
      const secondLastChange = secondChangeEvents.last();

      // Verify first change event
      await expect(secondFirstChange).toContainText('"activeHandle": 2');
      await expect(secondFirstChange).toContainText('"startValue": 50');
      const secondFirstChangeValue = await secondFirstChange.textContent();
      const secondFirstChangeValueMatch = secondFirstChangeValue?.match(/"value": (\d+)/);
      expect(secondFirstChangeValueMatch).toBeTruthy();
      const secondFirstValue = parseInt(secondFirstChangeValueMatch![1]);
      expect(secondFirstValue).toBeGreaterThan(50);
      expect(secondFirstValue).toBeLessThan(70);
      // Check values array for first change
      const secondFirstValuesMatch = secondFirstChangeValue?.match(/"values":\s*\[([\d\s,]+)\]/);
      expect(secondFirstValuesMatch).toBeTruthy();
      const secondFirstValues = secondFirstValuesMatch![1].split(',').map((v) => parseInt(v.trim()));
      expect(secondFirstValues).toHaveLength(5);
      expect(secondFirstValues[0]).toBe(20);
      expect(secondFirstValues[1]).toBe(30);
      expect(secondFirstValues[2]).toBe(secondFirstValue);
      expect(secondFirstValues[3]).toBe(70);
      expect(secondFirstValues[4]).toBe(90);

      // Verify middle change event
      await expect(secondMiddleChange).toContainText('"activeHandle": 2');
      await expect(secondMiddleChange).toContainText('"startValue": 50');
      const secondMiddleChangeValue = await secondMiddleChange.textContent();
      const secondMiddleChangeValueMatch = secondMiddleChangeValue?.match(/"value": (\d+)/);
      expect(secondMiddleChangeValueMatch).toBeTruthy();
      const secondMiddleValue = parseInt(secondMiddleChangeValueMatch![1]);
      expect(secondMiddleValue).toBeGreaterThan(secondFirstValue);
      expect(secondMiddleValue).toBeLessThan(70);
      // Check values array for middle change
      const secondMiddleValuesMatch = secondMiddleChangeValue?.match(/"values":\s*\[([\d\s,]+)\]/);
      expect(secondMiddleValuesMatch).toBeTruthy();
      const secondMiddleValues = secondMiddleValuesMatch![1].split(',').map((v) => parseInt(v.trim()));
      expect(secondMiddleValues).toHaveLength(5);
      expect(secondMiddleValues[0]).toBe(20);
      expect(secondMiddleValues[1]).toBe(30);
      expect(secondMiddleValues[2]).toBe(secondMiddleValue);
      expect(secondMiddleValues[3]).toBe(70);
      expect(secondMiddleValues[4]).toBe(90);

      // Verify last change event
      await expect(secondLastChange).toContainText('"activeHandle": 2');
      await expect(secondLastChange).toContainText('"startValue": 50');
      const secondLastChangeValue = await secondLastChange.textContent();
      const secondLastChangeValueMatch = secondLastChangeValue?.match(/"value": (\d+)/);
      expect(secondLastChangeValueMatch).toBeTruthy();
      const secondLastValue = parseInt(secondLastChangeValueMatch![1]);
      expect(secondLastValue).toBeGreaterThan(secondMiddleValue);
      expect(secondLastValue).toBeLessThanOrEqual(70);
      // Check values array for last change
      const secondLastValuesMatch = secondLastChangeValue?.match(/"values":\s*\[([\d\s,]+)\]/);
      expect(secondLastValuesMatch).toBeTruthy();
      const secondLastValues = secondLastValuesMatch![1].split(',').map((v) => parseInt(v.trim()));
      expect(secondLastValues).toHaveLength(5);
      expect(secondLastValues[0]).toBe(20);
      expect(secondLastValues[1]).toBe(30);
      expect(secondLastValues[2]).toBe(secondLastValue);
      expect(secondLastValues[3]).toBe(70);
      expect(secondLastValues[4]).toBe(90);

      // Check stop event
      const secondStopEvent = eventHistory.locator('.event-detail').filter({ hasText: 'type: stop' }).last();
      await expect(secondStopEvent).toContainText('"activeHandle": 2');
      await expect(secondStopEvent).toContainText('"startValue": 50');
      await expect(secondStopEvent).toContainText('"value": 60');
      await expect(secondStopEvent).toContainText(`"values": [
        20,
        30,
        60,
        70,
        90
      ]`);
    });
  });
});
