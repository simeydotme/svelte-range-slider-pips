import { expect, test } from '@playwright/test';

// Color constants
const PIP_BASE_COLOR = 'rgb(153, 162, 162)'; // --slider-base
const PIP_HOVER_COLOR = 'rgb(63, 62, 79)'; // --slider-fg
const PIP_DISABLED_COLOR = 'rgb(153, 162, 162)'; // --slider-base

// Font weight constants
const NORMAL_WEIGHT = '400';
const BOLD_WEIGHT = '700';

test.describe('RangeSlider States', () => {
  test.describe('disabled state', () => {
    test('should disable interactions on single slider', async ({ page }) => {
      await page.goto('/test/range-slider/states/disabled');
      await page.waitForLoadState('networkidle');

      const slider = page.locator('#disabled-single-slider');
      const handle = slider.getByRole('slider');

      // Check disabled class is applied
      await expect(slider).toHaveClass(/\brsDisabled\b/);

      // Check aria-disabled is set
      await expect(handle).toHaveAttribute('aria-disabled', 'true');

      // Check tabindex is -1
      await expect(handle).toHaveAttribute('tabindex', '-1');

      // Try to move handle - should not work
      const sliderBounds = await slider.boundingBox();
      if (!sliderBounds) throw new Error('Could not get slider bounds');

      await page.mouse.click(sliderBounds.x + sliderBounds.width * 0.1, sliderBounds.y + sliderBounds.height / 2);

      // Value should not change
      await expect(handle).toHaveAttribute('aria-valuenow', '50');

      // Check pips are disabled
      const pips = slider.locator('.rangePips');
      await expect(pips).toHaveClass(/\brsDisabled\b/);

      // Check pip styles in disabled state
      const pip = pips.locator('.rsPip').nth(1);
      await expect(pip).toHaveCSS('color', PIP_DISABLED_COLOR);
      await expect(pip).toHaveCSS('background-color', PIP_DISABLED_COLOR);

      // Check pip label styles in disabled state
      const pipLabel = pip.locator('.rsPipVal');
      await expect(pipLabel).toHaveCSS('font-weight', NORMAL_WEIGHT);
      await expect(pipLabel).toHaveCSS('color', PIP_DISABLED_COLOR);

      // Try to click on a pip - should not work
      await pip.click();
      await expect(handle).toHaveAttribute('aria-valuenow', '50');

      // Hover over pip - should not change styles
      await pip.hover();
      await expect(pip).toHaveCSS('color', PIP_DISABLED_COLOR);
      await expect(pip).toHaveCSS('background-color', PIP_DISABLED_COLOR);
      await expect(pipLabel).toHaveCSS('font-weight', NORMAL_WEIGHT);
      await expect(pipLabel).toHaveCSS('color', PIP_DISABLED_COLOR);
    });

    test('should disable interactions on range slider', async ({ page }) => {
      await page.goto('/test/range-slider/states/disabled');
      await page.waitForLoadState('networkidle');

      const slider = page.locator('#disabled-range-slider');
      const handles = slider.locator('.rangeHandle');

      // Check disabled class is applied
      await expect(slider).toHaveClass(/\brsDisabled\b/);

      // Check both handles are disabled
      await expect(handles.nth(0)).toHaveAttribute('aria-disabled', 'true');
      await expect(handles.nth(1)).toHaveAttribute('aria-disabled', 'true');

      // Try to move handles - should not work
      const sliderBounds = await slider.boundingBox();
      if (!sliderBounds) throw new Error('Could not get slider bounds');

      await page.mouse.click(sliderBounds.x + sliderBounds.width * 0.1, sliderBounds.y + sliderBounds.height / 2);

      // Values should not change
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '25');
      await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '75');

      // Check pips are disabled
      const pips = slider.locator('.rangePips');
      await expect(pips).toHaveClass(/\brsDisabled\b/);

      // Check pip styles in disabled state
      const pip = pips.locator('.rsPip').nth(1);
      await expect(pip).toHaveCSS('color', PIP_DISABLED_COLOR);
      await expect(pip).toHaveCSS('background-color', PIP_DISABLED_COLOR);

      // Check pip label styles in disabled state
      const pipLabel = pip.locator('.rsPipVal');
      await expect(pipLabel).toHaveCSS('font-weight', NORMAL_WEIGHT);
      await expect(pipLabel).toHaveCSS('color', PIP_DISABLED_COLOR);

      // Try to click on a pip - should not work
      await pip.click();
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '25');
      await expect(handles.nth(1)).toHaveAttribute('aria-valuenow', '75');

      // Hover over pip - should not change styles
      await pip.hover();
      await expect(pip).toHaveCSS('color', PIP_DISABLED_COLOR);
      await expect(pip).toHaveCSS('background-color', PIP_DISABLED_COLOR);
      await expect(pipLabel).toHaveCSS('font-weight', NORMAL_WEIGHT);
      await expect(pipLabel).toHaveCSS('color', PIP_DISABLED_COLOR);
    });

    test('should dynamically apply disabled state', async ({ page }) => {
      await page.goto('/test/range-slider/states/disabled');
      await page.waitForLoadState('networkidle');

      const slider = page.locator('#dynamic-disabled-slider');
      const handle = slider.getByRole('slider');

      // Initially not disabled
      await expect(slider).not.toHaveClass(/\brsDisabled\b/);

      // Check initial pip styles (enabled state)
      const pips = slider.locator('.rangePips');
      const pip = pips.locator('.rsPip').nth(1);
      const pipLabel = pip.locator('.rsPipVal');

      // Hover over pip - should show hover styles
      await pip.hover();
      await expect(pip).toHaveCSS('color', PIP_HOVER_COLOR);
      await expect(pip).toHaveCSS('background-color', PIP_HOVER_COLOR);
      await expect(pipLabel).toHaveCSS('font-weight', BOLD_WEIGHT);
      await expect(pipLabel).toHaveCSS('color', PIP_HOVER_COLOR);

      // Move handle above 75 to trigger disabled state
      const sliderBounds = await slider.boundingBox();
      if (!sliderBounds) throw new Error('Could not get slider bounds');

      await page.mouse.click(sliderBounds.x + sliderBounds.width * 0.8, sliderBounds.y + sliderBounds.height / 2);

      // Should now be disabled
      await expect(slider).toHaveClass(/\brsDisabled\b/);
      await expect(handle).toHaveAttribute('aria-disabled', 'true');

      // Check pip styles in disabled state
      await expect(pips).toHaveClass(/\brsDisabled\b/);
      await expect(pip).toHaveCSS('color', PIP_DISABLED_COLOR);
      await expect(pip).toHaveCSS('background-color', PIP_DISABLED_COLOR);
      await expect(pipLabel).toHaveCSS('font-weight', NORMAL_WEIGHT);
      await expect(pipLabel).toHaveCSS('color', PIP_DISABLED_COLOR);

      // Hover over pip - should not change styles
      await pip.hover();
      await expect(pip).toHaveCSS('color', PIP_DISABLED_COLOR);
      await expect(pip).toHaveCSS('background-color', PIP_DISABLED_COLOR);
      await expect(pipLabel).toHaveCSS('font-weight', NORMAL_WEIGHT);
      await expect(pipLabel).toHaveCSS('color', PIP_DISABLED_COLOR);

      // Try to move handle - should not work
      await page.mouse.click(sliderBounds.x + sliderBounds.width * 0.1, sliderBounds.y + sliderBounds.height / 2);

      // Value should not change
      await expect(handle).toHaveAttribute('aria-valuenow', '80');

      // Try to click on a pip - should not work
      await pip.click();
      await expect(handle).toHaveAttribute('aria-valuenow', '80');
    });
  });

  test.describe('hoverable state', () => {
    test('should disable hover effects on single slider', async ({ page }) => {
      await page.goto('/test/range-slider/states/hoverable');
      await page.waitForLoadState('networkidle');

      const slider = page.locator('#non-hoverable-single-slider');
      const handle = slider.getByRole('slider');

      // Check non-hoverable class is applied
      await expect(slider).not.toHaveClass(/\brsHoverable\b/);

      // Hover over handle - should not show hover effect
      await handle.hover();
      await expect(handle).not.toHaveClass(/\brsHover\b/);

      // Check tooltip is not shown on hover
      const float = handle.locator('.rangeFloat');
      await expect(float).toHaveCSS('opacity', '0');

      // Check pips are not hoverable
      const pips = slider.locator('.rangePips');
      await expect(pips).not.toHaveClass(/\brsHoverable\b/);

      // Check initial pip styles
      const pip = pips.locator('.rsPip').nth(1);
      await expect(pip).toHaveCSS('color', PIP_BASE_COLOR);
      await expect(pip).toHaveCSS('background-color', PIP_BASE_COLOR);

      // Check initial pip label styles
      const pipLabel = pip.locator('.rsPipVal');
      await expect(pipLabel).toHaveCSS('font-weight', NORMAL_WEIGHT);
      await expect(pipLabel).toHaveCSS('color', PIP_BASE_COLOR);

      // Hover over a pip - should not show hover effect
      await pip.hover();

      // Check pip styles remain unchanged on hover
      await expect(pip).toHaveCSS('color', PIP_BASE_COLOR);
      await expect(pip).toHaveCSS('background-color', PIP_BASE_COLOR);
      await expect(pipLabel).toHaveCSS('font-weight', NORMAL_WEIGHT);
      await expect(pipLabel).toHaveCSS('color', PIP_BASE_COLOR);
    });

    test('should disable hover effects on range slider', async ({ page }) => {
      await page.goto('/test/range-slider/states/hoverable');
      await page.waitForLoadState('networkidle');

      const slider = page.locator('#non-hoverable-range-slider');
      const handles = slider.locator('.rangeHandle');
      const rangeBar = slider.locator('.rangeBar');

      // Check non-hoverable class is applied
      await expect(slider).not.toHaveClass(/\brsHoverable\b/);

      // Hover over handles and range bar - should not show hover effects
      await handles.nth(0).hover();
      await expect(handles.nth(0)).not.toHaveClass(/\brsHover\b/);

      await handles.nth(1).hover();
      await expect(handles.nth(1)).not.toHaveClass(/\brsHover\b/);

      await rangeBar.hover();
      await expect(rangeBar).not.toHaveClass(/\brsHover\b/);

      // Check pips are not hoverable
      const pips = slider.locator('.rangePips');
      await expect(pips).not.toHaveClass(/\brsHoverable\b/);

      // Check initial pip styles
      const pip = pips.locator('.rsPip').nth(1);
      await expect(pip).toHaveCSS('color', PIP_BASE_COLOR);
      await expect(pip).toHaveCSS('background-color', PIP_BASE_COLOR);

      // Check initial pip label styles
      const pipLabel = pip.locator('.rsPipVal');
      await expect(pipLabel).toHaveCSS('font-weight', NORMAL_WEIGHT);
      await expect(pipLabel).toHaveCSS('color', PIP_BASE_COLOR);

      // Hover over pips - should not show hover effects
      await pip.hover();

      // Check pip styles remain unchanged on hover
      await expect(pip).toHaveCSS('color', PIP_BASE_COLOR);
      await expect(pip).toHaveCSS('background-color', PIP_BASE_COLOR);
      await expect(pipLabel).toHaveCSS('font-weight', NORMAL_WEIGHT);
      await expect(pipLabel).toHaveCSS('color', PIP_BASE_COLOR);
    });

    test('should dynamically toggle hoverable state', async ({ page }) => {
      await page.goto('/test/range-slider/states/hoverable');
      await page.waitForLoadState('networkidle');

      const slider = page.locator('#dynamic-hoverable-slider');
      const handle = slider.getByRole('slider');
      const toggleButton = page.locator('#toggle-hoverable-btn');

      // Initially hoverable
      await expect(slider).toHaveClass(/\brsHoverable\b/);

      // Hover should work
      await handle.hover();
      const float = handle.locator('.rangeFloat');
      await expect(float).toHaveCSS('opacity', '1');

      // Check pips are hoverable
      const pips = slider.locator('.rangePips');
      await expect(pips).toHaveClass(/\brsHoverable\b/);

      // Check initial pip styles
      const pip = pips.locator('.rsPip').nth(1);
      await expect(pip).toHaveCSS('color', PIP_BASE_COLOR);
      await expect(pip).toHaveCSS('background-color', PIP_BASE_COLOR);

      // Check initial pip label styles
      const pipLabel = pip.locator('.rsPipVal');
      await expect(pipLabel).toHaveCSS('font-weight', NORMAL_WEIGHT);
      await expect(pipLabel).toHaveCSS('color', PIP_BASE_COLOR);

      // Hover over a pip - should show hover effect
      await pip.hover();

      // Check pip hover styles are applied
      await expect(pip).toHaveCSS('color', PIP_HOVER_COLOR);
      await expect(pip).toHaveCSS('background-color', PIP_HOVER_COLOR);
      await expect(pipLabel).toHaveCSS('font-weight', BOLD_WEIGHT);
      await expect(pipLabel).toHaveCSS('color', PIP_HOVER_COLOR);

      // Toggle hoverable off
      await toggleButton.click();
      await expect(slider).not.toHaveClass(/\brsHoverable\b/);

      // Hover should not work
      await handle.hover();
      await expect(float).toHaveCSS('opacity', '0');

      // Check pips are not hoverable
      await expect(pips).not.toHaveClass(/\brsHoverable\b/);

      // Hover over pip - should not show hover effect
      await pip.hover();

      // Check pip styles remain unchanged on hover
      await expect(pip).toHaveCSS('color', PIP_BASE_COLOR);
      await expect(pip).toHaveCSS('background-color', PIP_BASE_COLOR);
      await expect(pipLabel).toHaveCSS('font-weight', NORMAL_WEIGHT);
      await expect(pipLabel).toHaveCSS('color', PIP_BASE_COLOR);

      // Toggle hoverable back on
      await toggleButton.click();
      await expect(slider).toHaveClass(/\brsHoverable\b/);

      // Hover should work again
      await handle.hover();
      await expect(float).toHaveCSS('opacity', '1');

      // Check pips are hoverable again
      await expect(pips).toHaveClass(/\brsHoverable\b/);

      // Hover over pip - should show hover effect
      await pip.hover();

      // Check pip hover styles are applied again
      await expect(pip).toHaveCSS('color', PIP_HOVER_COLOR);
      await expect(pip).toHaveCSS('background-color', PIP_HOVER_COLOR);
      await expect(pipLabel).toHaveCSS('font-weight', BOLD_WEIGHT);
      await expect(pipLabel).toHaveCSS('color', PIP_HOVER_COLOR);
    });
  });
});
