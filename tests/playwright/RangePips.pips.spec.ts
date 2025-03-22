import { expect, test } from '@playwright/test';

test.describe('Pip Visibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/range-slider/pips/pips');
    await page.waitForLoadState('networkidle');
  });

  test('all pips should be visible when all="pip"', async ({ page }) => {
    const firstSlider = page.locator('.rangeSlider').first();
    const pips = firstSlider.locator('.rsPip');

    // All pips should be visible
    await expect(pips).toHaveCount(21);
  });

  test('only first and last should be visible when first="pip" last="pip" rest={false}', async ({ page }) => {
    const secondSlider = page.locator('.rangeSlider').nth(1);
    const firstPip = secondSlider.locator('.rsPip--first');
    const lastPip = secondSlider.locator('.rsPip--last');
    const restPips = secondSlider.locator('.rsPip:not(.rsPip--first):not(.rsPip--last)');

    // Only first and last should be visible
    await expect(firstPip).toBeVisible();
    await expect(lastPip).toBeVisible();
    await expect(restPips).toHaveCount(0);
  });

  test('only rest should be visible when rest="pip"', async ({ page }) => {
    const thirdSlider = page.locator('.rangeSlider').nth(2);
    const firstPip = thirdSlider.locator('.rsPip--first');
    const lastPip = thirdSlider.locator('.rsPip--last');
    const restPips = thirdSlider.locator('.rsPip:not(.rsPip--first):not(.rsPip--last)');

    // Only rest should be visible
    await expect(firstPip).toHaveCount(0);
    await expect(lastPip).toHaveCount(0);
    await expect(restPips).toHaveCount(19);
  });

  test('only first should be visible when first="pip"', async ({ page }) => {
    const fourthSlider = page.locator('.rangeSlider').nth(3);
    const firstPip = fourthSlider.locator('.rsPip--first');
    const otherPips = fourthSlider.locator('.rsPip:not(.rsPip--first)');

    // Only first should be visible
    await expect(firstPip).toBeVisible();
    await expect(otherPips).toHaveCount(0);
  });

  test('only last should be visible when last="pip"', async ({ page }) => {
    const fifthSlider = page.locator('.rangeSlider').nth(4);
    const lastPip = fifthSlider.locator('.rsPip--last');
    const otherPips = fifthSlider.locator('.rsPip:not(.rsPip--last)');

    // Only last should be visible
    await expect(lastPip).toBeVisible();
    await expect(otherPips).toHaveCount(0);
  });

  test('first and rest should be visible when first="pip" rest="pip"', async ({ page }) => {
    const sixthSlider = page.locator('.rangeSlider').nth(5);
    const firstPip = sixthSlider.locator('.rsPip--first');
    const lastPip = sixthSlider.locator('.rsPip--last');
    const restPips = sixthSlider.locator('.rsPip:not(.rsPip--first):not(.rsPip--last)');

    // First and rest should be visible
    await expect(firstPip).toBeVisible();
    await expect(lastPip).toHaveCount(0);
    await expect(restPips).toHaveCount(19);
  });

  test('last and rest should be visible when last="pip" rest="pip"', async ({ page }) => {
    const seventhSlider = page.locator('.rangeSlider').nth(6);
    const firstPip = seventhSlider.locator('.rsPip--first');
    const lastPip = seventhSlider.locator('.rsPip--last');
    const restPips = seventhSlider.locator('.rsPip:not(.rsPip--first):not(.rsPip--last)');

    // Last and rest should be visible
    await expect(firstPip).toHaveCount(0);
    await expect(lastPip).toBeVisible();
    await expect(restPips).toHaveCount(19);
  });

  test('no pips should be visible when all={false}', async ({ page }) => {
    const eighthSlider = page.locator('.rangeSlider').nth(7);
    const pips = eighthSlider.locator('.rsPip');

    // No pips should be visible
    await expect(pips).toHaveCount(0);
  });

  test('no pips should be visible when first={false} last={false} rest={false}', async ({ page }) => {
    const ninthSlider = page.locator('.rangeSlider').nth(8);
    const pips = ninthSlider.locator('.rsPip');

    // No pips should be visible
    await expect(pips).toHaveCount(0);
  });
}); 