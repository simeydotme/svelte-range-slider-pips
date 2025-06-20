import { expect, test } from '@playwright/test';
import { dragHandleTo } from './helpers/tools.js';

test.describe('Range Tests', () => {
  test.describe('range=false', () => {
    test('should not have .rsRange class', async ({ page }) => {
      await page.goto('/test/range-slider/range/false');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#single-handle-false');
      await expect(slider).not.toHaveClass(/\brsRange\b/);
    });

    test('should not show range, and single handle', async ({ page }) => {
      await page.goto('/test/range-slider/range/false');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#single-handle-false');
      const range = slider.locator('.rangeBar');
      const handles = slider.locator('.rangeHandle');

      await expect(range).not.toBeAttached();
      await expect(slider).not.toHaveClass(/\brsRange\b/);
      await expect(handles).toHaveCount(1);
      await expect(handles.nth(0)).toHaveCSS('translate', '600px');
    });

    test('should not show range, and two handles', async ({ page }) => {
      await page.goto('/test/range-slider/range/false');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#double-handle-false');
      const range = slider.locator('.rangeBar');
      const handles = slider.locator('.rangeHandle');

      await expect(range).not.toBeAttached();
      await expect(slider).not.toHaveClass(/\brsRange\b/);
      await expect(handles).toHaveCount(2);
      await expect(handles.nth(0)).toHaveCSS('translate', '350px');
      await expect(handles.nth(1)).toHaveCSS('translate', '850px');
    });

    test('should not show range, and three handles are sliced to two', async ({ page }) => {
      await page.goto('/test/range-slider/range/false');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#triple-handle-false');
      const range = slider.locator('.rangeBar');
      const handles = slider.locator('.rangeHandle');

      await expect(range).not.toBeAttached();
      await expect(slider).not.toHaveClass(/\brsRange\b/);
      // When false, all handles are rendered
      await expect(handles).toHaveCount(3);
      await expect(handles.nth(0)).toHaveCSS('translate', '200px');
      await expect(handles.nth(1)).toHaveCSS('translate', '500px');
      await expect(handles.nth(2)).toHaveCSS('translate', '800px');
    });
  });

  test.describe('range=true', () => {
    test.describe('with a single handle', () => {
      test('should not have .rsRange class', async ({ page }) => {
        await page.goto('/test/range-slider/range');
        await page.waitForLoadState('networkidle');
        const slider = page.locator('#single-handle-true');
        await expect(slider).not.toHaveClass(/\brsRange\b/);
      });

      test('no range with values=[40]', async ({ page }) => {
        await page.goto('/test/range-slider/range');
        await page.waitForLoadState('networkidle');
        const slider = page.locator('#single-handle-true');
        const range = slider.locator('.rangeBar');
        const handles = slider.locator('.rangeHandle');

        await expect(slider).not.toHaveClass(/\brsRange\b/);
        await expect(range).not.toBeAttached();
        await expect(handles).toHaveCount(1);
        await expect(handles.nth(0)).toHaveCSS('translate', '400px');
      });

      test('no range with value=40', async ({ page }) => {
        await page.goto('/test/range-slider/range');
        await page.waitForLoadState('networkidle');
        const slider = page.locator('#single-handle-true-value');
        const range = slider.locator('.rangeBar');
        const handles = slider.locator('.rangeHandle');

        await expect(slider).not.toHaveClass(/\brsRange\b/);
        await expect(range).not.toBeAttached();
        await expect(handles).toHaveCount(1);
        await expect(handles.nth(0)).toHaveCSS('translate', '400px');
      });
    });

    test('range between handles (values=[25, 75])', async ({ page }) => {
      await page.goto('/test/range-slider/range');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#double-handle-true');
      const range = slider.locator('.rangeBar');

      await expect(slider).toHaveClass(/\brsRange\b/);
      await expect(range).toBeAttached();
      await expect(range).toHaveCSS('translate', '250px');
      await expect(range).toHaveCSS('width', '500px');

      // Verify handle positions
      const handles = slider.locator('.rangeHandle');
      await expect(handles.nth(0)).toHaveCSS('translate', '250px');
      await expect(handles.nth(1)).toHaveCSS('translate', '750px');
    });

    test('range between handles (values=[25, 75]) with negative values', async ({ page }) => {
      await page.goto('/test/range-slider/range');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#double-handle-true-negative');
      const range = slider.locator('.rangeBar');
      const handles = slider.locator('.rangeHandle');

      await expect(range).toBeAttached();
      await expect(range).toHaveCSS('translate', '125px');
      await expect(range).toHaveCSS('width', '500px');

      // Verify handle positions
      await expect(handles.nth(0)).toHaveCSS('translate', '125px');
      await expect(handles.nth(1)).toHaveCSS('translate', '625px');
    });

    test('range between first two handles (values=[15, 45]) slice off last handle', async ({ page }) => {
      await page.goto('/test/range-slider/range');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#triple-handle-true');
      const range = slider.locator('.rangeBar');
      const handles = slider.locator('.rangeHandle');

      await expect(range).toBeAttached();
      await expect(range).toHaveCSS('translate', '150px');
      await expect(range).toHaveCSS('width', '300px');

      // Verify only two handles are rendered
      await expect(handles).toHaveCount(2);
      await expect(handles.nth(0)).toHaveCSS('translate', '150px');
      await expect(handles.nth(1)).toHaveCSS('translate', '450px');
    });

    test('range between first two handles negative values (values=[-75, 45]) slice off last handle', async ({
      page
    }) => {
      await page.goto('/test/range-slider/range');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#triple-handle-true-negative');
      const range = slider.locator('.rangeBar');
      const handles = slider.locator('.rangeHandle');

      await expect(range).toBeAttached();
      await expect(range).toHaveCSS('translate', '0px');
      await expect(range).toHaveCSS('width', '700px');

      // Verify only two handles are rendered
      await expect(handles).toHaveCount(2);
      await expect(handles.nth(0)).toHaveCSS('translate', '0px');
      await expect(handles.nth(1)).toHaveCSS('translate', '700px');
    });
  });

  test.describe('range="min"', () => {
    test('should have .rsRange & .rsMin class', async ({ page }) => {
      await page.goto('/test/range-slider/range/min');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#single-handle-min');
      await expect(slider).toHaveClass(/\brsRange\b/);
      await expect(slider).toHaveClass(/\brsMin\b/);
    });

    test.describe('given min is default (0), and value is 30', () => {
      test('should show range from min (0) to handle (30)', async ({ page }) => {
        await page.goto('/test/range-slider/range/min');
        await page.waitForLoadState('networkidle');
        const slider = page.locator('#single-handle-min');
        const handles = slider.locator('.rangeHandle');
        const range = slider.locator('.rangeBar');

        await expect(range).toBeAttached();
        await expect(range).toHaveCSS('translate', '0px');
        await expect(range).toHaveCSS('right', '700px');

        // Verify only one handle is rendered
        await expect(handles).toHaveCount(1);
        await expect(handles.nth(0)).toHaveCSS('translate', '300px');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '0');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '100');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '30');
      });
    });

    test.describe('given min is default (0), and values are [20, 60]', () => {
      test('should show range from min (0) to handle (20)', async ({ page }) => {
        await page.goto('/test/range-slider/range/min');
        await page.waitForLoadState('networkidle');
        const slider = page.locator('#double-handle-min');
        const handles = slider.locator('.rangeHandle');
        const range = slider.locator('.rangeBar');

        await expect(range).toBeAttached();
        await expect(range).toHaveCSS('translate', '0px');
        await expect(range).toHaveCSS('right', '800px');

        // Verify only one handle is rendered
        await expect(handles).toHaveCount(1);
        await expect(handles.nth(0)).toHaveCSS('translate', '200px');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '0');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '100');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '20');
      });
    });

    test.describe('given min is set to 20, and values are [40, 60, 70]', () => {
      test('should show range from min (20) to handle (40)', async ({ page }) => {
        await page.goto('/test/range-slider/range/min');
        await page.waitForLoadState('networkidle');
        const slider = page.locator('#triple-handle-min');
        const handles = slider.locator('.rangeHandle');
        const range = slider.locator('.rangeBar');

        await expect(range).toBeAttached();
        await expect(range).toHaveCSS('translate', '0px');
        await expect(range).toHaveCSS('right', '750px');

        // Verify only one handle is rendered
        await expect(handles).toHaveCount(1);
        await expect(handles.nth(0)).toHaveCSS('translate', '250px');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '20');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '100');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '40');
      });
    });
  });

  test.describe('range="max"', () => {
    test('should have .rsRange & .rsMax class', async ({ page }) => {
      await page.goto('/test/range-slider/range/max');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#single-handle-max');
      await expect(slider).toHaveClass(/\brsRange\b/);
      await expect(slider).toHaveClass(/\brsMax\b/);
    });

    test.describe('given max is default (100), and value is 70', () => {
      test('should show range from handle (70) to max (100)', async ({ page }) => {
        await page.goto('/test/range-slider/range/max');
        await page.waitForLoadState('networkidle');
        const slider = page.locator('#single-handle-max');
        const handles = slider.locator('.rangeHandle');
        const range = slider.locator('.rangeBar');

        await expect(range).toBeAttached();
        await expect(range).toHaveCSS('translate', '700px');
        await expect(range).toHaveCSS('width', '300px');

        // Verify only one handle is rendered
        await expect(handles).toHaveCount(1);
        await expect(handles.nth(0)).toHaveCSS('translate', '700px');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '0');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '100');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '70');
      });
    });

    test.describe('given max is default (100), and values are [20, 60]', () => {
      test('should show range from max (100) to handle (20)', async ({ page }) => {
        await page.goto('/test/range-slider/range/max');
        await page.waitForLoadState('networkidle');
        const slider = page.locator('#double-handle-max');
        const handles = slider.locator('.rangeHandle');
        const range = slider.locator('.rangeBar');

        await expect(range).toBeAttached();
        await expect(range).toHaveCSS('translate', '200px');
        await expect(range).toHaveCSS('width', '800px');

        // Verify only one handle is rendered
        await expect(handles).toHaveCount(1);
        await expect(handles.nth(0)).toHaveCSS('translate', '200px');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '0');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '100');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '20');
      });
    });

    test.describe('given max is set to 80, and values are [20, 50, 90]', () => {
      test('should show range from max (80) to handle (20)', async ({ page }) => {
        await page.goto('/test/range-slider/range/max');
        await page.waitForLoadState('networkidle');
        const slider = page.locator('#triple-handle-max');
        const handles = slider.locator('.rangeHandle');
        const range = slider.locator('.rangeBar');

        await expect(range).toBeAttached();
        await expect(range).toHaveCSS('translate', '250px');
        await expect(range).toHaveCSS('width', '750px');

        // Verify only one handle is rendered
        await expect(handles).toHaveCount(1);
        await expect(handles.nth(0)).toHaveCSS('translate', '250px');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '0');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '80');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '20');
      });
    });
  });

  test.describe('range toggle functionality', () => {
    test('should toggle between single and range mode when range prop changes', async ({ page }) => {
      await page.goto('/test/range-slider/range');
      await page.waitForLoadState('networkidle');

      const slider = page.locator('#toggle-range-test');
      const range = slider.locator('.rangeBar');
      const handles = slider.locator('.rangeHandle');
      const toggleButton = page.locator('#btn_toggle_range');

      // Initial state: range=false, should show 3 handles, no range bar
      await expect(range).not.toBeAttached();
      await expect(handles).toHaveCount(3);
      await expect(slider).not.toHaveClass(/\brsRange\b/);

      // Click button to toggle to range=true
      await toggleButton.click();
      await page.waitForTimeout(100); // Wait for DOM update

      // After toggle: range=true, should show 2 handles, with range bar
      // values array is destructively changed from [15, 45, 75] to [15, 45]
      await expect(range).toBeAttached();
      await expect(handles).toHaveCount(2);
      await expect(slider).toHaveClass(/\brsRange\b/);

      // Click button again to toggle back to range=false
      await toggleButton.click();
      await page.waitForTimeout(100); // Wait for DOM update

      // Back to initial state: range=false, should show 2 handles, no range bar
      // values array is restored to [15, 45] because the third handle was lost when range=true
      await expect(range).not.toBeAttached();
      await expect(handles).toHaveCount(2);
      await expect(slider).not.toHaveClass(/\brsRange\b/);
    });

    test('should maintain handle positions when toggling range mode', async ({ page }) => {
      await page.goto('/test/range-slider/range');
      await page.waitForLoadState('networkidle');

      const slider = page.locator('#toggle-range-test');
      const handles = slider.locator('.rangeHandle');
      const toggleButton = page.locator('#btn_toggle_range');

      // Initial state: check first two handle positions
      await expect(handles.nth(0)).toHaveCSS('translate', '150px'); // 15% of 1000px
      await expect(handles.nth(1)).toHaveCSS('translate', '450px'); // 45% of 1000px

      // Toggle to range mode
      await toggleButton.click();
      await page.waitForTimeout(100);

      // Verify first two handles maintain their positions in range mode
      // Third handle is removed from the array when range=true
      await expect(handles.nth(0)).toHaveCSS('translate', '150px');
      await expect(handles.nth(1)).toHaveCSS('translate', '450px');

      // Toggle back to non-range mode
      await toggleButton.click();
      await page.waitForTimeout(100);

      // Verify that the first two handles are still in the same position
      // there is no third handle because it was lost when range=true
      await expect(handles).toHaveCount(2);
      await expect(handles.nth(0)).toHaveCSS('translate', '150px');
      await expect(handles.nth(1)).toHaveCSS('translate', '450px');
    });

    test('should toggle between single and range="min" mode with correct handle positions and classes', async ({
      page
    }) => {
      await page.goto('/test/range-slider/range');
      await page.waitForLoadState('networkidle');

      const slider = page.locator('#toggle-range-min-test');
      const range = slider.locator('.rangeBar');
      const handles = slider.locator('.rangeHandle');
      const toggleButton = page.locator('#btn_toggle_range_min');

      // Initial state: range=false, should show 3 handles, no range bar
      await expect(range).not.toBeAttached();
      await expect(handles).toHaveCount(3);
      await expect(slider).not.toHaveClass(/\brsRange\b/);
      await expect(slider).not.toHaveClass(/\brsMin\b/);
      await expect(handles.nth(0)).toHaveCSS('translate', '300px'); // 30% of 1000px

      // Click button to toggle to range="min"
      await toggleButton.click();
      await page.waitForTimeout(100);

      // After toggle: range="min", should show 1 handle, with range bar from min to handle
      // values array is destructively changed from [30, 60, 80] to [30]
      await expect(range).toBeAttached();
      await expect(handles).toHaveCount(1);
      await expect(slider).toHaveClass(/\brsRange\b/);
      await expect(slider).toHaveClass(/\brsMin\b/);
      await expect(handles.nth(0)).toHaveCSS('translate', '300px'); // First handle maintains position

      // Click button again to toggle back to range=false
      await toggleButton.click();
      await page.waitForTimeout(100);

      // Back to initial state: range=false, but now there's only one handle
      // because the second and third handles were lost when range=min
      await expect(range).not.toBeAttached();
      await expect(handles).toHaveCount(1);
      await expect(slider).not.toHaveClass(/\brsRange\b/);
      await expect(slider).not.toHaveClass(/\brsMin\b/);
      await expect(handles.nth(0)).toHaveCSS('translate', '300px'); // First handle still maintains position
    });

    test('should toggle between single and range="max" mode with correct handle positions and classes', async ({
      page
    }) => {
      await page.goto('/test/range-slider/range');
      await page.waitForLoadState('networkidle');

      const slider = page.locator('#toggle-range-max-test');
      const range = slider.locator('.rangeBar');
      const handles = slider.locator('.rangeHandle');
      const toggleButton = page.locator('#btn_toggle_range_max');

      // Initial state: range=false, should show 3 handles, no range bar
      await expect(range).not.toBeAttached();
      await expect(handles).toHaveCount(3);
      await expect(slider).not.toHaveClass(/\brsRange\b/);
      await expect(slider).not.toHaveClass(/\brsMax\b/);
      await expect(handles.nth(0)).toHaveCSS('translate', '200px'); // 20% of 1000px

      // Click button to toggle to range="max"
      await toggleButton.click();
      await page.waitForTimeout(100);

      // After toggle: range="max", should show 1 handle, with range bar from handle to max
      // values array is destructively changed from [20, 50, 70] to [20]
      await expect(range).toBeAttached();
      await expect(handles).toHaveCount(1);
      await expect(slider).toHaveClass(/\brsRange\b/);
      await expect(slider).toHaveClass(/\brsMax\b/);
      await expect(handles.nth(0)).toHaveCSS('translate', '200px'); // First handle maintains position

      // Click button again to toggle back to range=false
      await toggleButton.click();
      await page.waitForTimeout(100);

      // Back to initial state: range=false, but now there's only one handle
      // because the second and third handles were lost when range=max
      await expect(range).not.toBeAttached();
      await expect(handles).toHaveCount(1);
      await expect(slider).not.toHaveClass(/\brsRange\b/);
      await expect(slider).not.toHaveClass(/\brsMax\b/);
      await expect(handles.nth(0)).toHaveCSS('translate', '200px'); // First handle still maintains position
    });
  });
});
