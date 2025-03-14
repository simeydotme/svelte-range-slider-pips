import { expect, test } from './helpers/assertions.js';
import { waitTime } from './utils.js';

test.describe('Values Tests', () => {
  test('single value set to: 75', async ({ page }) => {
    await page.goto('/test/range-slider/values/single-value');
    await page.waitForLoadState('networkidle');
    const handle = page.getByRole('slider');

    await expect(handle).toHaveAttribute('aria-valuenow', '75');
    let left = await handle.evaluate((el) => el.style.left);
    await expect(left, 'to be positioned at 75%').toBe('75%');
  });

  test('multiple handles set to: [25, 125]', async ({ page }) => {
    await page.goto('/test/range-slider/values/multiple-values');
    await page.waitForLoadState('networkidle');
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
    await page.waitForLoadState('networkidle');
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
    await page.waitForLoadState('networkidle');
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
    await page.waitForLoadState('networkidle');
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
    await page.waitForLoadState('networkidle');
    const handle = page.getByRole('slider');
    const input = page.getByLabel('Current value:');
    const v = '55';

    // Test input -> slider binding
    await input.focus();
    await input.fill(v);
    await input.blur();
    await expect(input).toHaveValue(v);
    await expect(handle).toHaveAttribute('aria-valuenow', v);
    await expect(handle, 'handle should be positioned at 55%').toHaveStyle('left', '55%');

    // Test slider -> input binding
    await handle.focus();
    await page.keyboard.press('ArrowRight'); // Move to 56
    await expect(input).toHaveValue((parseInt(v) + 1).toString());
  });

  test('input values are constrained to min/max bounds', async ({ page }) => {
    await page.goto('/test/range-slider/values/binding/single');
    await page.waitForLoadState('networkidle');
    const handle = page.getByRole('slider');
    const input = page.getByLabel('Current value:');

    // Test value below minimum
    await input.focus();
    await input.fill('-10');
    await input.blur();
    await expect(input).toHaveValue('0');
    await expect(handle).toHaveAttribute('aria-valuenow', '0');
    await expect(handle, 'handle should be positioned at 0%').toHaveStyle('left', '0%');

    // Test value above maximum
    await input.focus();
    await input.fill('150');
    await input.blur();
    await expect(input).toHaveValue('100');
    await expect(handle).toHaveAttribute('aria-valuenow', '100');
    await expect(handle, 'handle should be positioned at 100%').toHaveStyle('left', '100%');
  });

  test('two-way binding works between slider and number inputs (multiple values)', async ({
    page
  }) => {
    await page.goto('/test/range-slider/values/binding/multiple');
    await page.waitForLoadState('networkidle');
    const handles = page.getByRole('slider');
    const input1 = page.getByLabel('First value:');
    const input2 = page.getByLabel('Second value:');

    // Test inputs -> slider binding
    // Update first handle
    await input1.focus();
    await input1.fill('30');
    await input1.blur();
    await expect(input1).toHaveValue('30');
    await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '30');
    await expect(handles.nth(0), 'first handle should be positioned at 30%').toHaveStyle(
      'left',
      '30%'
    );

    // Update second handle
    await input2.focus();
    await input2.fill('80');
    await input2.blur();
    await expect(input2).toHaveValue('80');
    await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '80');
    await expect(handles.nth(1), 'second handle should be positioned at 80%').toHaveStyle(
      'left',
      '80%'
    );

    // Test slider -> inputs binding
    // Move first handle
    await handles.nth(0).focus();
    await page.keyboard.press('ArrowRight'); // Move to 31
    await expect(input1).toHaveValue('31');

    // Move second handle
    await handles.nth(1).focus();
    await page.keyboard.press('ArrowLeft'); // Move to 79
    await expect(input2).toHaveValue('79');
  });
});
