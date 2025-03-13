import { expect, test } from './helpers/assertions.js';

test.describe('Range Tests', () => {
  test.describe('range=false', () => {
    test('should not have .range class', async ({ page }) => {
      await page.goto('/test/range-slider/range/false');
      const slider = page.locator('#single-handle-false');
      await expect(slider).not.toHaveClass(/\brange\b/);
    });

    test('should show no range with single handle', async ({ page }) => {
      await page.goto('/test/range-slider/range/false');
      const slider = page.locator('#single-handle-false');
      const range = slider.locator('.rangeBar');
      const handles = slider.locator('.rangeHandle');

      await expect(range).not.toBeAttached();
      await expect(handles).toHaveCount(1);
      await expect(handles.nth(0)).toHaveStyle('left', '60%');
    });

    test('should show no range with two handles', async ({ page }) => {
      await page.goto('/test/range-slider/range/false');
      const slider = page.locator('#double-handle-false');
      const range = slider.locator('.rangeBar');
      const handles = slider.locator('.rangeHandle');

      await expect(range).not.toBeAttached();
      await expect(handles).toHaveCount(2);
      await expect(handles.nth(0)).toHaveStyle('left', '35%');
      await expect(handles.nth(1)).toHaveStyle('left', '85%');
    });

    test('should show no range with three handles (sliced to two)', async ({ page }) => {
      await page.goto('/test/range-slider/range/false');
      const slider = page.locator('#triple-handle-false');
      const range = slider.locator('.rangeBar');
      const handles = slider.locator('.rangeHandle');

      await expect(range).not.toBeAttached();
      // When false, all handles are rendered
      await expect(handles).toHaveCount(3);
      await expect(handles.nth(0)).toHaveStyle('left', '20%');
      await expect(handles.nth(1)).toHaveStyle('left', '50%');
      await expect(handles.nth(2)).toHaveStyle('left', '80%');
    });
  });

  test.describe('range=true', () => {
    test('should not have .range class', async ({ page }) => {
      await page.goto('/test/range-slider/range/true');
      const slider = page.locator('#single-handle-true');
      await expect(slider).not.toHaveClass(/\brange\b/);
    });

    test('no range with single handle (values=[40])', async ({ page }) => {
      await page.goto('/test/range-slider/range/true');
      const slider = page.locator('#single-handle-true');
      const range = slider.locator('.rangeBar');
      const handles = slider.locator('.rangeHandle');

      await expect(range).not.toBeAttached();
      await expect(handles).toHaveCount(1);
      await expect(handles.nth(0)).toHaveStyle('left', '40%');
    });

    test('no range with single handle (value=40)', async ({ page }) => {
      await page.goto('/test/range-slider/range/true');
      const slider = page.locator('#single-handle-true-value');
      const range = slider.locator('.rangeBar');
      const handles = slider.locator('.rangeHandle');

      await expect(range).not.toBeAttached();
      await expect(handles).toHaveCount(1);
      await expect(handles.nth(0)).toHaveStyle('left', '40%');
    });

    test('range between handles (values=[25, 75])', async ({ page }) => {
      await page.goto('/test/range-slider/range/true');
      const slider = page.locator('#double-handle-true');
      const range = slider.locator('.rangeBar');

      await expect(range).toBeAttached();
      await expect(range).toHaveStyle('left', '25%');
      await expect(range).toHaveStyle('right', '25%');

      // Verify handle positions
      const handles = slider.locator('.rangeHandle');
      await expect(handles.nth(0)).toHaveStyle('left', '25%');
      await expect(handles.nth(1)).toHaveStyle('left', '75%');
    });

    test('range between handles (values=[25, 75]) with negative values', async ({ page }) => {
      await page.goto('/test/range-slider/range/true');
      const slider = page.locator('#double-handle-true-negative');
      const range = slider.locator('.rangeBar');
      const handles = slider.locator('.rangeHandle');

      await expect(range).toBeAttached();
      await expect(range).toHaveStyle('left', '12.5%');
      await expect(range).toHaveStyle('right', '37.5%');

      // Verify handle positions
      await expect(handles.nth(0)).toHaveStyle('left', '12.5%');
      await expect(handles.nth(1)).toHaveStyle('left', '62.5%');
    });

    test('range between first two handles (values=[15, 45]) slice off last handle', async ({
      page
    }) => {
      await page.goto('/test/range-slider/range/true');
      const slider = page.locator('#triple-handle-true');
      const range = slider.locator('.rangeBar');
      const handles = slider.locator('.rangeHandle');

      await expect(range).toBeAttached();
      await expect(range).toHaveStyle('left', '15%');
      await expect(range).toHaveStyle('right', '55%');

      // Verify only two handles are rendered
      await expect(handles).toHaveCount(2);
      await expect(handles.nth(0)).toHaveStyle('left', '15%');
      await expect(handles.nth(1)).toHaveStyle('left', '45%');
    });

    test('range between first two handles negative values (values=[-75, 45]) slice off last handle', async ({
      page
    }) => {
      await page.goto('/test/range-slider/range/true');
      const slider = page.locator('#triple-handle-true-negative');
      const range = slider.locator('.rangeBar');
      const handles = slider.locator('.rangeHandle');

      await expect(range).toBeAttached();
      await expect(range).toHaveStyle('left', '0%');
      await expect(range).toHaveStyle('right', '36.67%');

      // Verify only two handles are rendered
      await expect(handles).toHaveCount(2);
      await expect(handles.nth(0)).toHaveStyle('left', '0%');
      await expect(handles.nth(1)).toHaveStyle('left', '63.33%');
    });
  });

  test.describe('range="min"', () => {
    test('should have .range & .min class', async ({ page }) => {
      await page.goto('/test/range-slider/range/min');
      const slider = page.locator('#single-handle-min');
      await expect(slider).toHaveClass(/\brange\b/);
      await expect(slider).toHaveClass(/\bmin\b/);
    });

    test.describe('given min is default (0), and value is 30', () => {
      test('should show range from min (0) to handle (30)', async ({ page }) => {
        await page.goto('/test/range-slider/range/min');
        const slider = page.locator('#single-handle-min');
        const handles = slider.locator('.rangeHandle');
        const range = slider.locator('.rangeBar');

        await expect(range).toBeAttached();
        await expect(range).toHaveStyle('left', '0%');
        await expect(range).toHaveStyle('right', '70%');

        // Verify only one handle is rendered
        await expect(handles).toHaveCount(1);
        await expect(handles.nth(0)).toHaveStyle('left', '30%');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '0');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '100');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '30');
      });
    });

    test.describe('given min is default (0), and values are [20, 60]', () => {
      test('should show range from min (0) to handle (20)', async ({ page }) => {
        await page.goto('/test/range-slider/range/min');
        const slider = page.locator('#double-handle-min');
        const handles = slider.locator('.rangeHandle');
        const range = slider.locator('.rangeBar');

        await expect(range).toBeAttached();
        await expect(range).toHaveStyle('left', '0%');
        await expect(range).toHaveStyle('right', '80%');

        // Verify only one handle is rendered
        await expect(handles).toHaveCount(1);
        await expect(handles.nth(0)).toHaveStyle('left', '20%');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '0');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '100');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '20');
      });
    });

    test.describe('given min is set to 20, and values are [40, 60, 70]', () => {
      test('should show range from min (20) to handle (40)', async ({ page }) => {
        await page.goto('/test/range-slider/range/min');
        const slider = page.locator('#triple-handle-min');
        const handles = slider.locator('.rangeHandle');
        const range = slider.locator('.rangeBar');

        await expect(range).toBeAttached();
        await expect(range).toHaveStyle('left', '0%');
        await expect(range).toHaveStyle('right', '75%');

        // Verify only one handle is rendered
        await expect(handles).toHaveCount(1);
        await expect(handles.nth(0)).toHaveStyle('left', '25%');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '20');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '100');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '40');
      });
    });
  });

  test.describe('range="max"', () => {
    test('should have .range & .max class', async ({ page }) => {
      await page.goto('/test/range-slider/range/max');
      const slider = page.locator('#single-handle-max');
      await expect(slider).toHaveClass(/\brange\b/);
      await expect(slider).toHaveClass(/\bmax\b/);
    });

    test.describe('given max is default (100), and value is 70', () => {
      test('should show range from handle (70) to max (100)', async ({ page }) => {
        await page.goto('/test/range-slider/range/max');
        const slider = page.locator('#single-handle-max');
        const handles = slider.locator('.rangeHandle');
        const range = slider.locator('.rangeBar');

        await expect(range).toBeAttached();
        await expect(range).toHaveStyle('left', '70%');
        await expect(range).toHaveStyle('right', '0%');

        // Verify only one handle is rendered
        await expect(handles).toHaveCount(1);
        await expect(handles.nth(0)).toHaveStyle('left', '70%');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '0');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '100');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '70');
      });
    });

    test.describe('given max is default (100), and values are [20, 60]', () => {
      test('should show range from max (100) to handle (20)', async ({ page }) => {
        await page.goto('/test/range-slider/range/max');
        const slider = page.locator('#double-handle-max');
        const handles = slider.locator('.rangeHandle');
        const range = slider.locator('.rangeBar');

        await expect(range).toBeAttached();
        await expect(range).toHaveStyle('left', '20%');
        await expect(range).toHaveStyle('right', '0%');

        // Verify only one handle is rendered
        await expect(handles).toHaveCount(1);
        await expect(handles.nth(0)).toHaveStyle('left', '20%');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '0');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '100');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '20');
      });
    });

    test.describe('given max is set to 80, and values are [20, 50, 90]', () => {
      test('should show range from max (80) to handle (20)', async ({ page }) => {
        await page.goto('/test/range-slider/range/max');
        const slider = page.locator('#triple-handle-max');
        const handles = slider.locator('.rangeHandle');
        const range = slider.locator('.rangeBar');

        await expect(range).toBeAttached();
        await expect(range).toHaveStyle('left', '25%');
        await expect(range).toHaveStyle('right', '0%');

        // Verify only one handle is rendered
        await expect(handles).toHaveCount(1);
        await expect(handles.nth(0)).toHaveStyle('left', '25%');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '0');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '80');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '20');
      });
    });
  });
});
