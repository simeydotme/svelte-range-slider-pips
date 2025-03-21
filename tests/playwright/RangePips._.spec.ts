import { expect, test } from '@playwright/test';

test.describe('Basic Pips Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/range-slider/pips');
    await page.waitForLoadState('networkidle');
  });

  test('should render pips correctly with default settings', async ({ page }) => {
    // Check that pips container exists
    const pipsContainer = page.locator('.rangePips');
    await expect(pipsContainer).toBeVisible();

    // Check that first and last pips exist (default behavior)
    const firstPip = page.locator('.rsPip--first');
    const lastPip = page.locator('.rsPip--last');
    await expect(firstPip).toBeVisible();
    await expect(lastPip).toBeVisible();

    // Check that first pip shows min value (0)
    await expect(firstPip).toHaveAttribute('data-val', '0');

    // Check that last pip shows max value (100)
    await expect(lastPip).toHaveAttribute('data-val', '100');

    // Check that some intermediate pips exist
    const intermediatePips = page.locator('.rsPip:not(.rsPip--first):not(.rsPip--last)');
    await expect(intermediatePips).toHaveCount(await intermediatePips.count());
    expect(await intermediatePips.count()).toBeGreaterThan(0);

    // Check that the selected pip (at 50) is highlighted
    const selectedPip = page.locator('.rsPip.rsSelected');
    await expect(selectedPip).toBeVisible();
    await expect(selectedPip).toHaveAttribute('data-val', '50');

    // Check that pips are interactive by clicking one
    const handle = page.locator('.rangeHandle');
    const initialValue = await handle.getAttribute('aria-valuenow');

    // Click a pip value and verify the handle moves
    await page.locator('.rsPip[data-val="75"]').click();
    await expect(handle).toHaveAttribute('aria-valuenow', '75');
    await expect(handle, 'to be positioned at 75%').toHaveCSS('translate', '750px');

    // Verify the selected pip updates
    await expect(selectedPip).toHaveAttribute('data-val', '75');
  });

  test('no values are rendered for default setup', async ({ page }) => {
    // Check that pip values are not rendered
    const pipValues = page.locator('.rsPipVal');
    await expect(pipValues).toHaveCount(0);
  });

  test('should apply all the correct css classes', async ({ page }) => {
    // Check that the slider has the pips class
    const slider = page.locator('.rangeSlider');
    const pipsContainer = page.locator('.rangePips');
    const selectedPip = page.locator('.rsPip.rsSelected');
    const firstPip = page.locator('.rsPip--first');
    const lastPip = page.locator('.rsPip--last');

    // Check that the slider has the pips class
    await expect(slider).toHaveClass(/\brsPips\b/);

    // Check CSS classes on the pips container
    await expect(pipsContainer).toHaveClass(/\brsHoverable\b/);
    await expect(pipsContainer).not.toHaveClass(/\brsDisabled\b/);
    await expect(pipsContainer).not.toHaveClass(/\brsVertical\b/);
    await expect(pipsContainer).not.toHaveClass(/\brsReversed\b/);
    await expect(pipsContainer).not.toHaveClass(/\brsFocus\b/);

    // Check CSS classes on a regular pip
    const regularPip = page.locator('.rsPip:not(.rsPip--first):not(.rsPip--last):not(.rsSelected)').first();
    await expect(regularPip).toHaveClass(/\brsPip\b/);
    await expect(regularPip).not.toHaveClass(/\brsSelected\b/);
    await expect(regularPip).not.toHaveClass(/\brsInRange\b/);
    await expect(regularPip).not.toHaveClass(/\brsOutOfLimit\b/);

    // Check CSS classes on the selected pip
    await expect(selectedPip).toHaveClass(/\brsPip\b/);
    await expect(selectedPip).toHaveClass(/\brsSelected\b/);
    await expect(selectedPip).not.toHaveClass(/\brsInRange\b/);
    await expect(selectedPip).not.toHaveClass(/\brsOutOfLimit\b/);

    // Check CSS classes on first and last pips
    await expect(firstPip).toHaveClass(/\brsPip\b/);
    await expect(firstPip).toHaveClass(/\brsPip--first\b/);
    await expect(lastPip).toHaveClass(/\brsPip\b/);
    await expect(lastPip).toHaveClass(/\brsPip--last\b/);
  });
});
