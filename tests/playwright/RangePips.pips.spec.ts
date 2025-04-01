import { expect, test } from '@playwright/test';

test.describe('Pip Visibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/range-slider/pips/pips');
    await page.waitForLoadState('networkidle');
  });

  test('all pips should be visible when all="pip"', async ({ page }) => {
    const slider = page.locator('#all-pips');
    const pips = slider.locator('.rsPip');

    // All pips should be visible
    await expect(pips).toHaveCount(21);
  });

  test('only first and last should be visible when first="pip" last="pip" rest={false}', async ({ page }) => {
    const slider = page.locator('#first-last-pips');
    const firstPip = slider.locator('.rsPip--first');
    const lastPip = slider.locator('.rsPip--last');
    const restPips = slider.locator('.rsPip:not(.rsPip--first):not(.rsPip--last)');

    // Only first and last should be visible
    await expect(firstPip).toBeVisible();
    await expect(lastPip).toBeVisible();
    await expect(restPips).toHaveCount(0);
  });

  test('only rest should be visible when rest="pip"', async ({ page }) => {
    const slider = page.locator('#rest-pips');
    const firstPip = slider.locator('.rsPip--first');
    const lastPip = slider.locator('.rsPip--last');
    const restPips = slider.locator('.rsPip:not(.rsPip--first):not(.rsPip--last)');

    // Only rest should be visible
    await expect(firstPip).toHaveCount(0);
    await expect(lastPip).toHaveCount(0);
    await expect(restPips).toHaveCount(19);
  });

  test('only first should be visible when first="pip"', async ({ page }) => {
    const slider = page.locator('#first-pip');
    const firstPip = slider.locator('.rsPip--first');
    const otherPips = slider.locator('.rsPip:not(.rsPip--first)');

    // Only first should be visible
    await expect(firstPip).toBeVisible();
    await expect(otherPips).toHaveCount(0);
  });

  test('only last should be visible when last="pip"', async ({ page }) => {
    const slider = page.locator('#last-pip');
    const lastPip = slider.locator('.rsPip--last');
    const otherPips = slider.locator('.rsPip:not(.rsPip--last)');

    // Only last should be visible
    await expect(lastPip).toBeVisible();
    await expect(otherPips).toHaveCount(0);
  });

  test('first and rest should be visible when first="pip" rest="pip"', async ({ page }) => {
    const slider = page.locator('#first-rest-pips');
    const firstPip = slider.locator('.rsPip--first');
    const lastPip = slider.locator('.rsPip--last');
    const restPips = slider.locator('.rsPip:not(.rsPip--first):not(.rsPip--last)');

    // First and rest should be visible
    await expect(firstPip).toBeVisible();
    await expect(lastPip).toHaveCount(0);
    await expect(restPips).toHaveCount(19);
  });

  test('last and rest should be visible when last="pip" rest="pip"', async ({ page }) => {
    const slider = page.locator('#last-rest-pips');
    const firstPip = slider.locator('.rsPip--first');
    const lastPip = slider.locator('.rsPip--last');
    const restPips = slider.locator('.rsPip:not(.rsPip--first):not(.rsPip--last)');

    // Last and rest should be visible
    await expect(firstPip).toHaveCount(0);
    await expect(lastPip).toBeVisible();
    await expect(restPips).toHaveCount(19);
  });

  test('no pips should be visible when all={false}', async ({ page }) => {
    const slider = page.locator('#no-pips');
    const pips = slider.locator('.rsPip');

    // No pips should be visible
    await expect(pips).toHaveCount(0);
  });

  test('no pips should be visible when first={false} last={false} rest={false}', async ({ page }) => {
    const slider = page.locator('#no-pips-explicit');
    const pips = slider.locator('.rsPip');

    // No pips should be visible
    await expect(pips).toHaveCount(0);
  });
});
