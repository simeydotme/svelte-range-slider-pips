import { expect, test } from '@playwright/test';

test.describe('Pip Labels Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/range-slider/pips/labels');
    await page.waitForLoadState('networkidle');
  });

  test('all pips should have labels when all="label"', async ({ page }) => {
    const firstSlider = page.locator('.rangeSlider').first();
    const pipValues = firstSlider.locator('.rsPipVal');
    const pips = firstSlider.locator('.rsPip');

    // Check that the pip values are correct
    await expect(pipValues).toHaveCount(21);
    await expect(pipValues).toHaveText([
      '0',
      '5',
      '10',
      '15',
      '20',
      '25',
      '30',
      '35',
      '40',
      '45',
      '50',
      '55',
      '60',
      '65',
      '70',
      '75',
      '80',
      '85',
      '90',
      '95',
      '100'
    ]);
    // All pips should have values
    await expect(pips).toHaveCount(21);
  });

  test('only first and last should have labels when first="label" last="label" rest={false}', async ({ page }) => {
    const secondSlider = page.locator('.rangeSlider').nth(1);
    const pipValues = secondSlider.locator('.rsPipVal');
    const firstPip = secondSlider.locator('.rsPip--first');
    const lastPip = secondSlider.locator('.rsPip--last');
    const restPips = secondSlider.locator('.rsPip:not(.rsPip--first):not(.rsPip--last)');

    // Check that the pip values are correct
    await expect(pipValues).toHaveCount(2);
    await expect(pipValues).toHaveText(['0', '100']);
    // Only first and last should have values
    await expect(firstPip.locator('.rsPipVal')).toBeVisible();
    await expect(lastPip.locator('.rsPipVal')).toBeVisible();
    await expect(restPips.locator('.rsPipVal')).toHaveCount(0);
  });

  test('only rest should have labels when rest="label"', async ({ page }) => {
    const thirdSlider = page.locator('.rangeSlider').nth(2);
    const pipValues = thirdSlider.locator('.rsPipVal');
    const firstPip = thirdSlider.locator('.rsPip--first');
    const lastPip = thirdSlider.locator('.rsPip--last');
    const restPips = thirdSlider.locator('.rsPip:not(.rsPip--first):not(.rsPip--last)');

    // Check that the pip values are correct
    await expect(pipValues).toHaveCount(19);
    await expect(pipValues).toHaveText([
      '5',
      '10',
      '15',
      '20',
      '25',
      '30',
      '35',
      '40',
      '45',
      '50',
      '55',
      '60',
      '65',
      '70',
      '75',
      '80',
      '85',
      '90',
      '95'
    ]);
    // Only rest should have values
    await expect(firstPip.locator('.rsPipVal')).toHaveCount(0);
    await expect(lastPip.locator('.rsPipVal')).toHaveCount(0);
    await expect(restPips.locator('.rsPipVal')).toHaveCount(19);
  });

  test('only first should have label when first="label"', async ({ page }) => {
    const fourthSlider = page.locator('.rangeSlider').nth(3);
    const pipValues = fourthSlider.locator('.rsPipVal');
    const firstPip = fourthSlider.locator('.rsPip--first');
    const otherPips = fourthSlider.locator('.rsPip:not(.rsPip--first)');

    // Check that the pip values are correct
    await expect(pipValues).toHaveCount(1);
    await expect(pipValues).toHaveText(['0']);
    // Only first should have value
    await expect(firstPip.locator('.rsPipVal')).toBeVisible();
    await expect(otherPips.locator('.rsPipVal')).toHaveCount(0);
  });

  test('only last should have label when last="label"', async ({ page }) => {
    const fifthSlider = page.locator('.rangeSlider').nth(4);
    const pipValues = fifthSlider.locator('.rsPipVal');
    const lastPip = fifthSlider.locator('.rsPip--last');
    const otherPips = fifthSlider.locator('.rsPip:not(.rsPip--last)');

    // Check that the pip values are correct
    await expect(pipValues).toHaveCount(1);
    await expect(pipValues).toHaveText(['100']);
    // Only last should have a value
    await expect(lastPip.locator('.rsPipVal')).toBeVisible();
    await expect(otherPips.locator('.rsPipVal')).toHaveCount(0);
  });

  test('first and rest should have labels when first="label" rest="label"', async ({ page }) => {
    const sixthSlider = page.locator('.rangeSlider').nth(5);
    const pipValues = sixthSlider.locator('.rsPipVal');
    const firstPip = sixthSlider.locator('.rsPip--first');
    const lastPip = sixthSlider.locator('.rsPip--last');
    const restPips = sixthSlider.locator('.rsPip:not(.rsPip--first):not(.rsPip--last)');

    // Check that the pip values are correct
    await expect(pipValues).toHaveCount(20);
    await expect(pipValues).toHaveText([
      '0',
      '5',
      '10',
      '15',
      '20',
      '25',
      '30',
      '35',
      '40',
      '45',
      '50',
      '55',
      '60',
      '65',
      '70',
      '75',
      '80',
      '85',
      '90',
      '95'
    ]);
    // First and rest should have values
    await expect(firstPip.locator('.rsPipVal')).toBeVisible();
    await expect(lastPip.locator('.rsPipVal')).toHaveCount(0);
    await expect(restPips.locator('.rsPipVal')).toHaveCount(19);
  });

  test('last and rest should have labels when last="label" rest="label"', async ({ page }) => {
    const seventhSlider = page.locator('.rangeSlider').nth(6);
    const pipValues = seventhSlider.locator('.rsPipVal');
    const firstPip = seventhSlider.locator('.rsPip--first');
    const lastPip = seventhSlider.locator('.rsPip--last');
    const restPips = seventhSlider.locator('.rsPip:not(.rsPip--first):not(.rsPip--last)');

    // Check that the pip values are correct
    await expect(pipValues).toHaveCount(20);
    await expect(pipValues).toHaveText([
      '5',
      '10',
      '15',
      '20',
      '25',
      '30',
      '35',
      '40',
      '45',
      '50',
      '55',
      '60',
      '65',
      '70',
      '75',
      '80',
      '85',
      '90',
      '95',
      '100'
    ]);
    // Last and rest should have values
    await expect(firstPip.locator('.rsPipVal')).toHaveCount(0);
    await expect(lastPip.locator('.rsPipVal')).toBeVisible();
    await expect(restPips.locator('.rsPipVal')).toHaveCount(19);
  });

  test('no labels should be shown when all={false}', async ({ page }) => {
    const eighthSlider = page.locator('.rangeSlider').nth(7);
    const pipValues = eighthSlider.locator('.rsPipVal');

    // No values should be shown
    await expect(pipValues).toHaveCount(0);
  });

  test('no labels should be shown when first={false} last={false} rest={false}', async ({ page }) => {
    const ninthSlider = page.locator('.rangeSlider').nth(8);
    const pipValues = ninthSlider.locator('.rsPipVal');

    // No values should be shown
    await expect(pipValues).toHaveCount(0);
  });
});
