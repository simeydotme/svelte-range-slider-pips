import { expect, test } from '@playwright/test';

test.describe('Pip Labels Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/range-slider/pips/labels');
    await page.waitForLoadState('networkidle');
  });

  test('all pips should have labels when all="label"', async ({ page }) => {
    const slider = page.locator('#all-labels');
    const pipValues = slider.locator('.rsPipVal');
    const pips = slider.locator('.rsPip');

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

  test('all pips should have labels with step=2.5', async ({ page }) => {
    const slider = page.locator('#step-2-5');
    const pipValues = slider.locator('.rsPipVal');
    const pips = slider.locator('.rsPip');

    // Check that the pip values are correct
    await expect(pipValues).toHaveCount(41);
    await expect(pipValues).toHaveText([
      '0',
      '2.5',
      '5',
      '7.5',
      '10',
      '12.5',
      '15',
      '17.5',
      '20',
      '22.5',
      '25',
      '27.5',
      '30',
      '32.5',
      '35',
      '37.5',
      '40',
      '42.5',
      '45',
      '47.5',
      '50',
      '52.5',
      '55',
      '57.5',
      '60',
      '62.5',
      '65',
      '67.5',
      '70',
      '72.5',
      '75',
      '77.5',
      '80',
      '82.5',
      '85',
      '87.5',
      '90',
      '92.5',
      '95',
      '97.5',
      '100'
    ]);
    // All pips should have values
    await expect(pips).toHaveCount(41);
  });

  test('all pips should have labels with step=7.3', async ({ page }) => {
    const slider = page.locator('#step-7-3');
    const pipValues = slider.locator('.rsPipVal');
    const pips = slider.locator('.rsPip');

    // Check that the pip values are correct
    await expect(pipValues).toHaveCount(15);
    await expect(pipValues).toHaveText([
      '0',
      '7.3',
      '14.6',
      '21.9',
      '29.2',
      '36.5',
      '43.8',
      '51.1',
      '58.4',
      '65.7',
      '73',
      '80.3',
      '87.6',
      '94.9',
      '100'
    ]);
    // All pips should have values
    await expect(pips).toHaveCount(15);
  });

  test('all pips should have labels with custom min/max', async ({ page }) => {
    const slider = page.locator('#step-2-5-minmax');
    const pipValues = slider.locator('.rsPipVal');
    const pips = slider.locator('.rsPip');

    // Check that the pip values are correct
    await expect(pipValues).toHaveCount(25);
    await expect(pipValues).toHaveText([
      '20',
      '22.5',
      '25',
      '27.5',
      '30',
      '32.5',
      '35',
      '37.5',
      '40',
      '42.5',
      '45',
      '47.5',
      '50',
      '52.5',
      '55',
      '57.5',
      '60',
      '62.5',
      '65',
      '67.5',
      '70',
      '72.5',
      '75',
      '77.5',
      '80'
    ]);
    // All pips should have values
    await expect(pips).toHaveCount(25);
  });

  test('all pips should have labels with step=0.1', async ({ page }) => {
    const slider = page.locator('#step-0-1');
    const pipValues = slider.locator('.rsPipVal');
    const pips = slider.locator('.rsPip');

    // Check that the pip values are correct (should be reduced due to stepMax limit)
    await expect(pipValues).toHaveCount(201);
    await expect(pipValues).toHaveText([
      '0',
      '0.5',
      '1',
      '1.5',
      '2',
      '2.5',
      '3',
      '3.5',
      '4',
      '4.5',
      '5',
      '5.5',
      '6',
      '6.5',
      '7',
      '7.5',
      '8',
      '8.5',
      '9',
      '9.5',
      '10',
      '10.5',
      '11',
      '11.5',
      '12',
      '12.5',
      '13',
      '13.5',
      '14',
      '14.5',
      '15',
      '15.5',
      '16',
      '16.5',
      '17',
      '17.5',
      '18',
      '18.5',
      '19',
      '19.5',
      '20',
      '20.5',
      '21',
      '21.5',
      '22',
      '22.5',
      '23',
      '23.5',
      '24',
      '24.5',
      '25',
      '25.5',
      '26',
      '26.5',
      '27',
      '27.5',
      '28',
      '28.5',
      '29',
      '29.5',
      '30',
      '30.5',
      '31',
      '31.5',
      '32',
      '32.5',
      '33',
      '33.5',
      '34',
      '34.5',
      '35',
      '35.5',
      '36',
      '36.5',
      '37',
      '37.5',
      '38',
      '38.5',
      '39',
      '39.5',
      '40',
      '40.5',
      '41',
      '41.5',
      '42',
      '42.5',
      '43',
      '43.5',
      '44',
      '44.5',
      '45',
      '45.5',
      '46',
      '46.5',
      '47',
      '47.5',
      '48',
      '48.5',
      '49',
      '49.5',
      '50',
      '50.5',
      '51',
      '51.5',
      '52',
      '52.5',
      '53',
      '53.5',
      '54',
      '54.5',
      '55',
      '55.5',
      '56',
      '56.5',
      '57',
      '57.5',
      '58',
      '58.5',
      '59',
      '59.5',
      '60',
      '60.5',
      '61',
      '61.5',
      '62',
      '62.5',
      '63',
      '63.5',
      '64',
      '64.5',
      '65',
      '65.5',
      '66',
      '66.5',
      '67',
      '67.5',
      '68',
      '68.5',
      '69',
      '69.5',
      '70',
      '70.5',
      '71',
      '71.5',
      '72',
      '72.5',
      '73',
      '73.5',
      '74',
      '74.5',
      '75',
      '75.5',
      '76',
      '76.5',
      '77',
      '77.5',
      '78',
      '78.5',
      '79',
      '79.5',
      '80',
      '80.5',
      '81',
      '81.5',
      '82',
      '82.5',
      '83',
      '83.5',
      '84',
      '84.5',
      '85',
      '85.5',
      '86',
      '86.5',
      '87',
      '87.5',
      '88',
      '88.5',
      '89',
      '89.5',
      '90',
      '90.5',
      '91',
      '91.5',
      '92',
      '92.5',
      '93',
      '93.5',
      '94',
      '94.5',
      '95',
      '95.5',
      '96',
      '96.5',
      '97',
      '97.5',
      '98',
      '98.5',
      '99',
      '99.5',
      '100'
    ]);
    // All pips should have values
    await expect(pips).toHaveCount(201);
  });

  test('all pips should have labels when max-min=1000', async ({ page }) => {
    const slider = page.locator('#default-step-1000');
    const pipValues = slider.locator('.rsPipVal');
    const pips = slider.locator('.rsPip');

    // Check that the pip values are correct
    await expect(pipValues).toHaveCount(21);
    await expect(pipValues).toHaveText([
      '0',
      '50',
      '100',
      '150',
      '200',
      '250',
      '300',
      '350',
      '400',
      '450',
      '500',
      '550',
      '600',
      '650',
      '700',
      '750',
      '800',
      '850',
      '900',
      '950',
      '1000'
    ]);
    // All pips should have values
    await expect(pips).toHaveCount(21);
  });

  test('all pips should have labels when max-min=10000', async ({ page }) => {
    const slider = page.locator('#default-step-10000');
    const pipValues = slider.locator('.rsPipVal');
    const pips = slider.locator('.rsPip');

    // Check that the pip values are correct
    await expect(pipValues).toHaveCount(21);
    await expect(pipValues).toHaveText([
      '0',
      '500',
      '1000',
      '1500',
      '2000',
      '2500',
      '3000',
      '3500',
      '4000',
      '4500',
      '5000',
      '5500',
      '6000',
      '6500',
      '7000',
      '7500',
      '8000',
      '8500',
      '9000',
      '9500',
      '10000'
    ]);
    // All pips should have values
    await expect(pips).toHaveCount(21);
  });

  test('all pips should have labels when max-min=100000', async ({ page }) => {
    const slider = page.locator('#default-step-100000');
    const pipValues = slider.locator('.rsPipVal');
    const pips = slider.locator('.rsPip');

    // Check that the pip values are correct
    await expect(pipValues).toHaveCount(21);
    await expect(pipValues).toHaveText([
      '0',
      '5000',
      '10000',
      '15000',
      '20000',
      '25000',
      '30000',
      '35000',
      '40000',
      '45000',
      '50000',
      '55000',
      '60000',
      '65000',
      '70000',
      '75000',
      '80000',
      '85000',
      '90000',
      '95000',
      '100000'
    ]);
    // All pips should have values
    await expect(pips).toHaveCount(21);
  });

  test('only first and last should have labels when first="label" last="label" rest={false}', async ({ page }) => {
    const slider = page.locator('#first-last-labels');
    const pipValues = slider.locator('.rsPipVal');
    const firstPip = slider.locator('.rsPip--first');
    const lastPip = slider.locator('.rsPip--last');
    const restPips = slider.locator('.rsPip:not(.rsPip--first):not(.rsPip--last)');

    // Check that the pip values are correct
    await expect(pipValues).toHaveCount(2);
    await expect(pipValues).toHaveText(['0', '100']);
    // Only first and last should have values
    await expect(firstPip.locator('.rsPipVal')).toBeVisible();
    await expect(lastPip.locator('.rsPipVal')).toBeVisible();
    await expect(restPips.locator('.rsPipVal')).toHaveCount(0);
  });

  test('only rest should have labels when rest="label"', async ({ page }) => {
    const slider = page.locator('#rest-labels');
    const pipValues = slider.locator('.rsPipVal');
    const firstPip = slider.locator('.rsPip--first');
    const lastPip = slider.locator('.rsPip--last');
    const restPips = slider.locator('.rsPip:not(.rsPip--first):not(.rsPip--last)');

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
    const slider = page.locator('#first-label');
    const pipValues = slider.locator('.rsPipVal');
    const firstPip = slider.locator('.rsPip--first');
    const otherPips = slider.locator('.rsPip:not(.rsPip--first)');

    // Check that the pip values are correct
    await expect(pipValues).toHaveCount(1);
    await expect(pipValues).toHaveText(['0']);
    // Only first should have value
    await expect(firstPip.locator('.rsPipVal')).toBeVisible();
    await expect(otherPips.locator('.rsPipVal')).toHaveCount(0);
  });

  test('only last should have label when last="label"', async ({ page }) => {
    const slider = page.locator('#last-label');
    const pipValues = slider.locator('.rsPipVal');
    const lastPip = slider.locator('.rsPip--last');
    const otherPips = slider.locator('.rsPip:not(.rsPip--last)');

    // Check that the pip values are correct
    await expect(pipValues).toHaveCount(1);
    await expect(pipValues).toHaveText(['100']);
    // Only last should have a value
    await expect(lastPip.locator('.rsPipVal')).toBeVisible();
    await expect(otherPips.locator('.rsPipVal')).toHaveCount(0);
  });

  test('first and rest should have labels when first="label" rest="label"', async ({ page }) => {
    const slider = page.locator('#first-rest-labels');
    const pipValues = slider.locator('.rsPipVal');
    const firstPip = slider.locator('.rsPip--first');
    const lastPip = slider.locator('.rsPip--last');
    const restPips = slider.locator('.rsPip:not(.rsPip--first):not(.rsPip--last)');

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
    const slider = page.locator('#last-rest-labels');
    const pipValues = slider.locator('.rsPipVal');
    const firstPip = slider.locator('.rsPip--first');
    const lastPip = slider.locator('.rsPip--last');
    const restPips = slider.locator('.rsPip:not(.rsPip--first):not(.rsPip--last)');

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
    const slider = page.locator('#no-labels');
    const pipValues = slider.locator('.rsPipVal');

    // No values should be shown
    await expect(pipValues).toHaveCount(0);
  });

  test('no labels should be shown when first={false} last={false} rest={false}', async ({ page }) => {
    const slider = page.locator('#no-labels-explicit');
    const pipValues = slider.locator('.rsPipVal');

    // No values should be shown
    await expect(pipValues).toHaveCount(0);
  });
});
