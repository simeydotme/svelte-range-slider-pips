import { expect, test } from './helpers/assertions.js';

test.describe('Values Tests', () => {
  test('single value set to: 75', async ({ page }) => {
    await page.goto('/test/range-slider/values/single-value');
    const handle = page.getByRole('slider');

    await expect(handle).toHaveAttribute('aria-valuenow', '75');
    let left = await handle.evaluate((el) => el.style.left);
    await expect(left, 'to be positioned at 75%').toBe('75%');
  });

  test('multiple handles set to: [25, 125]', async ({ page }) => {
    await page.goto('/test/range-slider/values/multiple-values');
    const handles = page.getByRole('slider');

    // Check count of handles
    await expect(handles).toHaveCount(2);

    // First handle: 25
    await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '25');
    await expect(handles.nth(0), 'handle should be positioned at 25%').toHaveStyle('left', '25%');

    // Second handle: 125
    // should be constrained to max=100
    await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '100');
    await expect(handles.nth(1), 'handle should be positioned at 100%').toHaveStyle('left', '100%');
  });

  test('seven handles set to: [10, 20, 30, 40, 60, 80, 90]', async ({ page }) => {
    await page.goto('/test/range-slider/values/seven-values');
    const handles = page.getByRole('slider');

    const expectedValues = [10, 20, 30, 40, 60, 80, 90];

    // Check count of handles
    await expect(handles).toHaveCount(7);

    // Check each handle's value
    for (let i = 0; i < expectedValues.length; i++) {
      await expect(handles.nth(i)).toHaveAttribute('aria-valuenow', expectedValues[i].toString());
      await expect(
        handles.nth(i),
        `handle ${i} should be positioned at ${expectedValues[i]}%`
      ).toHaveStyle('left', `${expectedValues[i]}%`);
    }
  });

  test('values outside default min/max are constrained: [-20, 120] -> [0, 100]', async ({
    page
  }) => {
    await page.goto('/test/range-slider/values/constrained-values');
    const handles = page.getByRole('slider');

    // Check count of handles
    await expect(handles).toHaveCount(2);

    // First handle should be constrained to min=0
    await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '0');
    await expect(handles.nth(0), 'handle should be positioned at 0%').toHaveStyle('left', '0%');

    // Second handle should be constrained to max=100
    await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '100');
    await expect(handles.nth(1), 'handle should be positioned at 100%').toHaveStyle('left', '100%');
  });

  test('when both value/values props provided, value[0] = value, value[1] = values[1]', async ({
    page
  }) => {
    await page.goto('/test/range-slider/values/value-values');
    const handles = page.getByRole('slider');

    // Should have two handles since both value and values props are provided
    await expect(handles).toHaveCount(2);

    // Handle 1 should be set to value (75)
    await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '75');
    await expect(handles.nth(0), 'handle should be positioned at 75%').toHaveStyle('left', '75%');

    // Handle 2 should be set to values[1] (90)
    await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '90');
    await expect(handles.nth(1), 'handle should be positioned at 90%').toHaveStyle('left', '90%');
  });

  test('two-way binding works between slider and number input', async ({ page }) => {
    await page.goto('/test/range-slider/values/binding/single');
    const handle = page.getByRole('slider');
    const input = page.getByLabel('Current value:');
    const v = '55';

    // Test input -> slider binding
    await input.focus();
    await page.waitForTimeout(500); // need to wait for the input to be focused
    await input.fill(v);
    await page.waitForTimeout(500); // need to wait for the input to be filled
    await input.blur();
    await page.waitForTimeout(500); // need to wait for slider animation to complete
    await expect(input).toHaveValue(v);
    await expect(handle).toHaveAttribute('aria-valuenow', v);
    await expect(handle, 'handle should be positioned at 55%').toHaveStyle('left', '55%');

    // Test slider -> input binding
    await handle.focus();
    await page.keyboard.press('ArrowRight'); // Move to 56
    await expect(input).toHaveValue((parseInt(v) + 1).toString());
  });
});
