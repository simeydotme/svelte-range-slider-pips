import { expect, test } from './helpers/assertions.js';
import { springSettleTime } from './utils.js';

test.describe('Range Tests', () => {
  test.describe('range=false', () => {
    test('should not have .range class', async ({ page }) => {
      await page.goto('/test/range-slider/range/false');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#single-handle-false');
      await expect(slider).not.toHaveClass(/\brange\b/);
    });

    test('should show no range with single handle', async ({ page }) => {
      await page.goto('/test/range-slider/range/false');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#single-handle-false');
      const range = slider.locator('.rangeBar');
      const handles = slider.locator('.rangeHandle');

      await expect(range).not.toBeAttached();
      await expect(handles).toHaveCount(1);
      await expect(handles.nth(0)).toHaveCSS('left', '600px');
    });

    test('should show no range with two handles', async ({ page }) => {
      await page.goto('/test/range-slider/range/false');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#double-handle-false');
      const range = slider.locator('.rangeBar');
      const handles = slider.locator('.rangeHandle');

      await expect(range).not.toBeAttached();
      await expect(handles).toHaveCount(2);
      await expect(handles.nth(0)).toHaveCSS('left', '350px');
      await expect(handles.nth(1)).toHaveCSS('left', '850px');
    });

    test('should show no range with three handles (sliced to two)', async ({ page }) => {
      await page.goto('/test/range-slider/range/false');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#triple-handle-false');
      const range = slider.locator('.rangeBar');
      const handles = slider.locator('.rangeHandle');

      await expect(range).not.toBeAttached();
      // When false, all handles are rendered
      await expect(handles).toHaveCount(3);
      await expect(handles.nth(0)).toHaveCSS('left', '200px');
      await expect(handles.nth(1)).toHaveCSS('left', '500px');
      await expect(handles.nth(2)).toHaveCSS('left', '800px');
    });
  });

  test.describe('range=true', () => {
    test('should not have .range class', async ({ page }) => {
      await page.goto('/test/range-slider/range/true');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#single-handle-true');
      await expect(slider).not.toHaveClass(/\brange\b/);
    });

    test('no range with single handle (values=[40])', async ({ page }) => {
      await page.goto('/test/range-slider/range/true');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#single-handle-true');
      const range = slider.locator('.rangeBar');
      const handles = slider.locator('.rangeHandle');

      await expect(range).not.toBeAttached();
      await expect(handles).toHaveCount(1);
      await expect(handles.nth(0)).toHaveCSS('left', '400px');
    });

    test('no range with single handle (value=40)', async ({ page }) => {
      await page.goto('/test/range-slider/range/true');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#single-handle-true-value');
      const range = slider.locator('.rangeBar');
      const handles = slider.locator('.rangeHandle');

      await expect(range).not.toBeAttached();
      await expect(handles).toHaveCount(1);
      await expect(handles.nth(0)).toHaveCSS('left', '400px');
    });

    test('range between handles (values=[25, 75])', async ({ page }) => {
      await page.goto('/test/range-slider/range/true');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#double-handle-true');
      const range = slider.locator('.rangeBar');

      await expect(range).toBeAttached();
      await expect(range).toHaveCSS('left', '250px');
      await expect(range).toHaveCSS('right', '250px');

      // Verify handle positions
      const handles = slider.locator('.rangeHandle');
      await expect(handles.nth(0)).toHaveCSS('left', '250px');
      await expect(handles.nth(1)).toHaveCSS('left', '750px');
    });

    test('range between handles (values=[25, 75]) with negative values', async ({ page }) => {
      await page.goto('/test/range-slider/range/true');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#double-handle-true-negative');
      const range = slider.locator('.rangeBar');
      const handles = slider.locator('.rangeHandle');

      await expect(range).toBeAttached();
      await expect(range).toHaveCSS('left', '125px');
      await expect(range).toHaveCSS('right', '375px');

      // Verify handle positions
      await expect(handles.nth(0)).toHaveCSS('left', '125px');
      await expect(handles.nth(1)).toHaveCSS('left', '625px');
    });

    test('range between first two handles (values=[15, 45]) slice off last handle', async ({ page }) => {
      await page.goto('/test/range-slider/range/true');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#triple-handle-true');
      const range = slider.locator('.rangeBar');
      const handles = slider.locator('.rangeHandle');

      await expect(range).toBeAttached();
      await expect(range).toHaveCSS('left', '150px');
      await expect(range).toHaveCSS('right', '550px');

      // Verify only two handles are rendered
      await expect(handles).toHaveCount(2);
      await expect(handles.nth(0)).toHaveCSS('left', '150px');
      await expect(handles.nth(1)).toHaveCSS('left', '450px');
    });

    test('range between first two handles negative values (values=[-75, 45]) slice off last handle', async ({
      page
    }) => {
      await page.goto('/test/range-slider/range/true');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#triple-handle-true-negative');
      const range = slider.locator('.rangeBar');
      const handles = slider.locator('.rangeHandle');

      await expect(range).toBeAttached();
      await expect(range).toHaveCSS('left', '0px');
      await expect(range).toHaveCSS('right', '300px');

      // Verify only two handles are rendered
      await expect(handles).toHaveCount(2);
      await expect(handles.nth(0)).toHaveCSS('left', '0px');
      await expect(handles.nth(1)).toHaveCSS('left', '700px');
    });

    test.describe('Interactions', () => {
      test('first handle should not be able to drag beyond second handle', async ({ page }) => {
        await page.goto('/test/range-slider/range/true');
        await page.waitForLoadState('networkidle');
        const slider = page.locator('#double-handle-true');
        const handles = slider.locator('.rangeHandle');
        const range = slider.locator('.rangeBar');

        await expect(range).toBeAttached();
        await expect(range).toHaveCSS('left', '250px');
        await expect(range).toHaveCSS('right', '250px');

        await slider.isVisible();
        const sliderBounds = await slider.boundingBox();
        if (!sliderBounds) throw new Error('Could not get slider bounds');

        // Start drag from 25%, so first handle should be activated
        await page.mouse.move(sliderBounds.x + sliderBounds.width * 0.25, sliderBounds.y + sliderBounds.height / 2);
        await page.mouse.down();
        // drag the first handle to 90%
        await page.mouse.move(sliderBounds.x + sliderBounds.width * 0.9, sliderBounds.y + sliderBounds.height / 2);
        await page.mouse.up();
        await page.waitForTimeout(springSettleTime);
        // expect the first handle to be stuck at the second handle (75%)
        await expect(handles.nth(0)).toHaveCSS('left', '750px');
        await expect(handles.nth(1)).toHaveCSS('left', '750px');

        // reset the first handle to 25% and should not move the second handle
        await page.mouse.click(sliderBounds.x + sliderBounds.width * 0.25, sliderBounds.y + sliderBounds.height / 2);
        await page.waitForTimeout(springSettleTime);
        await expect(handles.nth(0)).toHaveCSS('left', '250px');
        await expect(handles.nth(1)).toHaveCSS('left', '750px');

        // now drag the second handle from 75%
        await page.mouse.move(sliderBounds.x + sliderBounds.width * 0.75, sliderBounds.y + sliderBounds.height / 2);
        await page.mouse.down();
        // drag the second handle to 10%
        await page.mouse.move(sliderBounds.x + sliderBounds.width * 0.1, sliderBounds.y + sliderBounds.height / 2);
        await page.mouse.up();
        await page.waitForTimeout(springSettleTime);
        // expect the second handle to be stuck at the first handle (25%)
        await expect(handles.nth(0)).toHaveCSS('left', '250px');
        await expect(handles.nth(1)).toHaveCSS('left', '250px');
      });
    });
  });

  test.describe('range="min"', () => {
    test('should have .range & .min class', async ({ page }) => {
      await page.goto('/test/range-slider/range/min');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#single-handle-min');
      await expect(slider).toHaveClass(/\brange\b/);
      await expect(slider).toHaveClass(/\bmin\b/);
    });

    test.describe('given min is default (0), and value is 30', () => {
      test('should show range from min (0) to handle (30)', async ({ page }) => {
        await page.goto('/test/range-slider/range/min');
        await page.waitForLoadState('networkidle');
        const slider = page.locator('#single-handle-min');
        const handles = slider.locator('.rangeHandle');
        const range = slider.locator('.rangeBar');

        await expect(range).toBeAttached();
        await expect(range).toHaveCSS('left', '0px');
        await expect(range).toHaveCSS('right', '700px');

        // Verify only one handle is rendered
        await expect(handles).toHaveCount(1);
        await expect(handles.nth(0)).toHaveCSS('left', '300px');
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
        await expect(range).toHaveCSS('left', '0px');
        await expect(range).toHaveCSS('right', '800px');

        // Verify only one handle is rendered
        await expect(handles).toHaveCount(1);
        await expect(handles.nth(0)).toHaveCSS('left', '200px');
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
        await expect(range).toHaveCSS('left', '0px');
        await expect(range).toHaveCSS('right', '750px');

        // Verify only one handle is rendered
        await expect(handles).toHaveCount(1);
        await expect(handles.nth(0)).toHaveCSS('left', '250px');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '20');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '100');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '40');
      });
    });
  });

  test.describe('range="max"', () => {
    test('should have .range & .max class', async ({ page }) => {
      await page.goto('/test/range-slider/range/max');
      await page.waitForLoadState('networkidle');
      const slider = page.locator('#single-handle-max');
      await expect(slider).toHaveClass(/\brange\b/);
      await expect(slider).toHaveClass(/\bmax\b/);
    });

    test.describe('given max is default (100), and value is 70', () => {
      test('should show range from handle (70) to max (100)', async ({ page }) => {
        await page.goto('/test/range-slider/range/max');
        await page.waitForLoadState('networkidle');
        const slider = page.locator('#single-handle-max');
        const handles = slider.locator('.rangeHandle');
        const range = slider.locator('.rangeBar');

        await expect(range).toBeAttached();
        await expect(range).toHaveCSS('left', '700px');
        await expect(range).toHaveCSS('right', '0px');

        // Verify only one handle is rendered
        await expect(handles).toHaveCount(1);
        await expect(handles.nth(0)).toHaveCSS('left', '700px');
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
        await expect(range).toHaveCSS('left', '200px');
        await expect(range).toHaveCSS('right', '0px');

        // Verify only one handle is rendered
        await expect(handles).toHaveCount(1);
        await expect(handles.nth(0)).toHaveCSS('left', '200px');
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
        await expect(range).toHaveCSS('left', '250px');
        await expect(range).toHaveCSS('right', '0px');

        // Verify only one handle is rendered
        await expect(handles).toHaveCount(1);
        await expect(handles.nth(0)).toHaveCSS('left', '250px');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuemin', '0');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuemax', '80');
        await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '20');
      });
    });
  });
});
