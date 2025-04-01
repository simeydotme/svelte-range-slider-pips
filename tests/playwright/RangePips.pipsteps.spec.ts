import { expect, test } from '@playwright/test';
import { dragHandleTo } from './helpers/tools.js';

test.describe('Pipstep Property Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/range-slider/pips/pipsteps');
    await page.waitForLoadState('networkidle');
  });

  test('default pipstep should show 21 pips (100/5) for horizontal slider', async ({ page }) => {
    const slider = page.locator('#default-pipstep');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Should show 21 pips (100/5 = 20) + 1
    await expect(pips).toHaveCount(21);
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
  });

  test('pipstep=2 should show every other step', async ({ page }) => {
    const slider = page.locator('#pipstep-2');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Should show pips at 0, 2, 4, ..., 98, 100
    await expect(pips).toHaveCount(51);
    await expect(pipValues).toHaveText([
      '0',
      '2',
      '4',
      '6',
      '8',
      '10',
      '12',
      '14',
      '16',
      '18',
      '20',
      '22',
      '24',
      '26',
      '28',
      '30',
      '32',
      '34',
      '36',
      '38',
      '40',
      '42',
      '44',
      '46',
      '48',
      '50',
      '52',
      '54',
      '56',
      '58',
      '60',
      '62',
      '64',
      '66',
      '68',
      '70',
      '72',
      '74',
      '76',
      '78',
      '80',
      '82',
      '84',
      '86',
      '88',
      '90',
      '92',
      '94',
      '96',
      '98',
      '100'
    ]);
  });

  test('pipstep=5 should show every 5th step', async ({ page }) => {
    const slider = page.locator('#pipstep-5');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Should show pips at 0, 5, 10, ..., 95, 100
    await expect(pips).toHaveCount(21);
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
  });

  test('pipstep=10 should show every 10th step', async ({ page }) => {
    const slider = page.locator('#pipstep-10');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Should show pips at 0, 10, 20, ..., 90, 100
    await expect(pips).toHaveCount(11);
    await expect(pipValues).toHaveText(['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100']);
  });

  test('pipstep=2.5 should show every 2.5th step', async ({ page }) => {
    const slider = page.locator('#pipstep-2-5');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Should show pips at 0, 2.5, 5, ..., 97.5, 100
    await expect(pips).toHaveCount(41);
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

    // also check that the slider cannot actually move to a 2.5 intermediate value
    // because the slider's step is still set at 1
    const handle = slider.locator('.rangeHandle');
    // Move the handle to 2.5
    await dragHandleTo(page, slider, handle, 0.025);
    await expect(handle).toHaveAttribute('aria-valuenow', '3');
    await expect(handle, 'to be positioned at 2%').toHaveCSS('translate', '30px');
  });

  test('pipstep=7.3 , step=2 should show every 7.3 * 2 step', async ({ page }) => {
    const slider = page.locator('#pipstep-7-3');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Should show pips at 0, 14.6, 29.2, ..., 87.6, 100
    await expect(pips).toHaveCount(8);
    await expect(pipValues).toHaveText(['0', '14.6', '29.2', '43.8', '58.4', '73', '87.6', '100']);

    // also check that the slider cannot actually move to a 7.3, or 14.6 intermediate value
    // because the slider's step is still set at 2
    const handle = slider.locator('.rangeHandle');
    // Move the handle to 7.3
    await dragHandleTo(page, slider, handle, 0.073);
    await expect(handle).toHaveAttribute('aria-valuenow', '8');
    await expect(handle, 'to be positioned at 8%').toHaveCSS('translate', '80px');

    // Move the handle to 14.6
    await dragHandleTo(page, slider, handle, 0.146);
    await expect(handle).toHaveAttribute('aria-valuenow', '14');
    await expect(handle, 'to be positioned at 14%').toHaveCSS('translate', '140px');
  });

  test('pipstep=0.1 respect the hard-set limit and display 1000 (+1) pips', async ({ page }) => {
    const slider = page.locator('#pipstep-0-1');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // normally we would expect 1,001 pips (100/0.1 + 1)
    // and because the pipCount is <= 1000, the pipstep is respected and we see 1001 pips
    await expect(pips).toHaveCount(1001);
    await expect(pipValues).toContainText([
      '0',
      '0.1',
      '0.2',
      '0.3',
      '0.4',
      '0.5',
      '0.6',
      '0.7',
      '0.8',
      '0.9',
      '1',
      '10',
      '10.1',
      '10.2',
      '10.3',
      '10.4',
      '10.5',
      '10.6',
      '10.7',
      '10.8',
      '10.9',
      '11',
      '20',
      '20.1',
      '20.2',
      '20.3',
      '20.4',
      '20.5',
      '20.6',
      '20.7',
      '20.8',
      '20.9',
      '21',
      '30',
      '30.1',
      '30.2',
      '30.3',
      '30.4',
      '30.5',
      '30.6',
      '30.7',
      '30.8',
      '30.9',
      '31',
      '90',
      '90.1',
      '90.2',
      '90.3',
      '90.4',
      '90.5',
      '90.6',
      '90.7',
      '90.8',
      '90.9',
      '91',
      '99',
      '99.1',
      '99.2',
      '99.3',
      '99.4',
      '99.5',
      '99.6',
      '99.7',
      '99.8',
      '99.9',
      '100'
    ]);
  });

  test('pipstep=0.01 should reduce number of pips due to 1000 pip limit', async ({ page }) => {
    const slider = page.locator('#pipstep-0-01');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // normally we would expect 10,001 pips (100/0.01 + 1)
    // but because of the 1000 pip limit, there's a check to make sure
    // we don't show more than 1000 pips (pipCount > 1000),
    // which will recursively divide the pipstep by 2 until it gets below 1000.
    // so we end up with 626 pips. ( 10000 -> 5000 -> 2500 -> 1250 -> 625 ) + 1
    await expect(pips).toHaveCount(626);
    await expect(pipValues).toContainText(['0', '100']);
    // check first pip has the correct value and index
    await expect(pipValues.nth(0)).toHaveText('0');
    await expect(pips.nth(0)).toHaveAttribute('data-index', '0');
    // check third pip has the correct value and index
    await expect(pipValues.nth(2)).toHaveText('0.32');
    await expect(pips.nth(2)).toHaveAttribute('data-index', '2');
    // check last pip has the correct value and index
    await expect(pipValues.nth(625)).toHaveText('100');
    await expect(pips.nth(625)).toHaveAttribute('data-index', '625');
    // check second-last pip has the correct value and index
    await expect(pipValues.nth(624)).toHaveText('99.84');
    await expect(pips.nth(624)).toHaveAttribute('data-index', '624');
  });

  test('pipstep=0.0001 should reduce number of pips due to 1000 pip limit', async ({ page }) => {
    const slider = page.locator('#pipstep-0-0001');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // normally we would expect 1,000,001 pips (100/0.0001 + 1)
    // but because of the 1000 pip limit, there's a check to make sure
    // we don't show more than 1000 pips (pipCount > 1000),
    // which will recursively divide the pipstep by 2 until it gets below 1000.
    // so we end up with 978 pips. ( 1000000 -> 500000 -> 250000 -> 125000 -> 62500 -> 31250 -> 15625 -> 7813 -> 3907 -> 1954 -> 977 ) + 1
    await expect(pips).toHaveCount(978);
    await expect(pipValues).toContainText(['0', '100']);
    // check first pip has the correct value and index
    await expect(pipValues.nth(0)).toHaveText('0');
    await expect(pips.nth(0)).toHaveAttribute('data-index', '0');
    // check third pip has the correct value and index
    // the values are rounded to 2 decimal places
    await expect(pipValues.nth(3)).toHaveText('0.31');
    await expect(pips.nth(3)).toHaveAttribute('data-index', '3');
    // check last pip has the correct value and index
    await expect(pipValues.nth(977)).toHaveText('100');
    await expect(pips.nth(977)).toHaveAttribute('data-index', '977');
    // check second-last pip has the correct value and index
    await expect(pipValues.nth(976)).toHaveText('99.94');
    await expect(pips.nth(976)).toHaveAttribute('data-index', '976');
  });

  test('pipstep=2 with custom min/max should show every other step', async ({ page }) => {
    const slider = page.locator('#pipstep-2-minmax');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Should show pips at 20, 22, 24, ..., 78, 80
    await expect(pips).toHaveCount(31);
    await expect(pipValues).toHaveText([
      '20',
      '22',
      '24',
      '26',
      '28',
      '30',
      '32',
      '34',
      '36',
      '38',
      '40',
      '42',
      '44',
      '46',
      '48',
      '50',
      '52',
      '54',
      '56',
      '58',
      '60',
      '62',
      '64',
      '66',
      '68',
      '70',
      '72',
      '74',
      '76',
      '78',
      '80'
    ]);
  });

  test('pipstep=5 with custom min/max should show every 5th step', async ({ page }) => {
    const slider = page.locator('#pipstep-5-minmax');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Should show pips at 20, 25, 30, ..., 75, 80
    await expect(pips).toHaveCount(13);
    await expect(pipValues).toHaveText(['20', '25', '30', '35', '40', '45', '50', '55', '60', '65', '70', '75', '80']);
  });

  test('pipstep=2.5 with custom min/max should show every 2.5th step', async ({ page }) => {
    const slider = page.locator('#pipstep-2-5-minmax');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Should show pips at 20, 22.5, 25, ..., 77.5, 80
    await expect(pips).toHaveCount(25);
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
  });

  test('pipstep=7.3 with custom min/max should show every 7.3rd step', async ({ page }) => {
    const slider = page.locator('#pipstep-7-3-minmax');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Should show pips at 20, 27.3, 34.6, ..., 72.7, 80
    await expect(pips).toHaveCount(10);
    await expect(pipValues).toHaveText(['20', '27.3', '34.6', '41.9', '49.2', '56.5', '63.8', '71.1', '78.4', '80']);
  });

  test('pipstep=2 with large range (max=1000) should show every other step', async ({ page }) => {
    const slider = page.locator('#pipstep-2-1000');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Should show pips at 0, 2, 4, ..., 998, 1000
    await expect(pips).toHaveCount(501);
    await expect(pipValues).toContainText(['0', '1000']);
  });

  test('pipstep=5 with large range (max=1000) should show every 5th step', async ({ page }) => {
    const slider = page.locator('#pipstep-5-1000');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Should show pips at 0, 5, 10, ..., 995, 1000
    await expect(pips).toHaveCount(201);
    await expect(pipValues).toContainText(['0', '1000']);
  });

  test('pipstep=10 with large range (max=1000) should show every 10th step', async ({ page }) => {
    const slider = page.locator('#pipstep-10-1000');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Should show pips at 0, 10, 20, ..., 990, 1000
    await expect(pips).toHaveCount(101);
    await expect(pipValues).toContainText(['0', '1000']);
  });

  test('pipstep=200 with very large range (max=10000) should show every 200th step', async ({ page }) => {
    const slider = page.locator('#pipstep-2-10000');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Should show pips at 0, 200, 400, ..., 9800, 10000
    await expect(pips).toHaveCount(51);
    await expect(pipValues).toContainText([
      '0',
      '200',
      '400',
      '600',
      '800',
      '1000',
      '1200',
      '1400',
      '1600',
      '1800',
      '2000',
      '2200',
      '2400',
      '2600',
      '2800',
      '3000',
      '3200',
      '3400',
      '3600',
      '3800',
      '4000',
      '4200',
      '4400',
      '4600',
      '4800',
      '5000',
      '5200',
      '5400',
      '5600',
      '5800',
      '6000',
      '6200',
      '6400',
      '6600',
      '6800',
      '7000',
      '7200',
      '7400',
      '7600',
      '7800',
      '8000',
      '8200',
      '8400',
      '8600',
      '8800',
      '9000',
      '9200',
      '9400',
      '9600',
      '9800',
      '10000'
    ]);
  });

  test('pipstep=500 with very large range (max=100000) should show every 500th step', async ({ page }) => {
    const slider = page.locator('#pipstep-500-100000');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Should show pips at 0, 500, 1000, ..., 99500, 100000
    await expect(pips).toHaveCount(201);
    await expect(pipValues).toContainText([
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
      '100000'
    ]);
  });

  test('pipstep=10 with very large range (max=10000) should show every 10th step', async ({ page }) => {
    const slider = page.locator('#pipstep-10-10000');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Should show pips at 0, 10, 20, ..., 9990, 10000
    await expect(pips).toHaveCount(1001);
    await expect(pipValues).toContainText(['0', '10000']);
  });

  test('dynamic pipstep control should update pips correctly', async ({ page }) => {
    const slider = page.locator('#dynamic-pipstep');
    const toggleButton = page.locator('#toggle-pipstep');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Initial state (no pipstep)
    await expect(pips).toHaveCount(21);
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

    // Click to add pipstep=2.5
    await toggleButton.click();
    await expect(toggleButton).toHaveText('Remove Pipstep');

    // After adding pipstep=2.5
    await expect(pips).toHaveCount(41);
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

    // Click to remove pipstep
    await toggleButton.click();
    await expect(toggleButton).toHaveText('Add Pipstep');

    // After removing pipstep (back to default)
    await expect(pips).toHaveCount(21);
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
  });

  test('dynamic alternate pipstep values should update pips correctly', async ({ page }) => {
    const slider = page.locator('#dynamic-alternate-pipstep');
    const toggleButton = page.locator('#toggle-alternate-pipstep');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Initial state (pipstep=5)
    await expect(pips).toHaveCount(21);
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

    // Click to change to pipstep=10
    await toggleButton.click();
    await expect(toggleButton).toHaveText('Use Pipstep 5');

    // After changing to pipstep=10
    await expect(pips).toHaveCount(11);
    await expect(pipValues).toHaveText(['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100']);

    // Click to change back to pipstep=5
    await toggleButton.click();
    await expect(toggleButton).toHaveText('Use Pipstep 10');

    // After changing back to pipstep=5
    await expect(pips).toHaveCount(21);
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
  });
});
