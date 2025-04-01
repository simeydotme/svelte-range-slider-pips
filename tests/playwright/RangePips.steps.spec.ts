import { expect, test } from '@playwright/test';

test.describe('Step Property Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/range-slider/pips/steps');
    await page.waitForLoadState('networkidle');
  });

  test('default step of 1 should show 20 pips (100/5) for horizontal slider', async ({ page }) => {
    const slider = page.locator('#default-step');
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

  test('default step with max=90 should show correct intervals', async ({ page }) => {
    const slider = page.locator('#default-step-90');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Should show pips at 0, 1, 2, ..., 89, 90
    await expect(pips).toHaveCount(91);
    await expect(pipValues).toHaveText([
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      '23',
      '24',
      '25',
      '26',
      '27',
      '28',
      '29',
      '30',
      '31',
      '32',
      '33',
      '34',
      '35',
      '36',
      '37',
      '38',
      '39',
      '40',
      '41',
      '42',
      '43',
      '44',
      '45',
      '46',
      '47',
      '48',
      '49',
      '50',
      '51',
      '52',
      '53',
      '54',
      '55',
      '56',
      '57',
      '58',
      '59',
      '60',
      '61',
      '62',
      '63',
      '64',
      '65',
      '66',
      '67',
      '68',
      '69',
      '70',
      '71',
      '72',
      '73',
      '74',
      '75',
      '76',
      '77',
      '78',
      '79',
      '80',
      '81',
      '82',
      '83',
      '84',
      '85',
      '86',
      '87',
      '88',
      '89',
      '90'
    ]);
  });

  test('default step with min=20 should show correct intervals', async ({ page }) => {
    const slider = page.locator('#default-step-20');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Should show pips at 20, 21, 22, ..., 99, 100
    await expect(pips).toHaveCount(81);
    await expect(pipValues).toHaveText([
      '20',
      '21',
      '22',
      '23',
      '24',
      '25',
      '26',
      '27',
      '28',
      '29',
      '30',
      '31',
      '32',
      '33',
      '34',
      '35',
      '36',
      '37',
      '38',
      '39',
      '40',
      '41',
      '42',
      '43',
      '44',
      '45',
      '46',
      '47',
      '48',
      '49',
      '50',
      '51',
      '52',
      '53',
      '54',
      '55',
      '56',
      '57',
      '58',
      '59',
      '60',
      '61',
      '62',
      '63',
      '64',
      '65',
      '66',
      '67',
      '68',
      '69',
      '70',
      '71',
      '72',
      '73',
      '74',
      '75',
      '76',
      '77',
      '78',
      '79',
      '80',
      '81',
      '82',
      '83',
      '84',
      '85',
      '86',
      '87',
      '88',
      '89',
      '90',
      '91',
      '92',
      '93',
      '94',
      '95',
      '96',
      '97',
      '98',
      '99',
      '100'
    ]);
  });

  test('default step with min=-20 and max=50 should show correct intervals', async ({ page }) => {
    const slider = page.locator('#default-step-minmax');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Should show pips at -20, -19, -18, ..., 49, 50
    await expect(pips).toHaveCount(71);
    await expect(pipValues).toHaveText([
      '-20',
      '-19',
      '-18',
      '-17',
      '-16',
      '-15',
      '-14',
      '-13',
      '-12',
      '-11',
      '-10',
      '-9',
      '-8',
      '-7',
      '-6',
      '-5',
      '-4',
      '-3',
      '-2',
      '-1',
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      '23',
      '24',
      '25',
      '26',
      '27',
      '28',
      '29',
      '30',
      '31',
      '32',
      '33',
      '34',
      '35',
      '36',
      '37',
      '38',
      '39',
      '40',
      '41',
      '42',
      '43',
      '44',
      '45',
      '46',
      '47',
      '48',
      '49',
      '50'
    ]);
  });

  test('default step with max-min=1000 should show correct intervals', async ({ page }) => {
    const slider = page.locator('#default-step-1000');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Should show pips at 0, 50, 100, ..., 950, 1000
    await expect(pips).toHaveCount(21);
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
  });

  test('default step with max-min=10000 should show correct intervals', async ({ page }) => {
    const slider = page.locator('#default-step-10000');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Should show pips at 0, 500, 1000, ..., 9500, 10000
    await expect(pips).toHaveCount(21);
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
  });

  test('default step with max-min=100000 should show correct intervals', async ({ page }) => {
    const slider = page.locator('#default-step-100000');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Should show pips at 0, 5000, 10000, ..., 95000, 100000
    await expect(pips).toHaveCount(21);
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
  });

  test('step of 5 should show pips at 5-unit intervals', async ({ page }) => {
    const slider = page.locator('#step-5');
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

  test('step of 10 should show pips at 10-unit intervals', async ({ page }) => {
    const slider = page.locator('#step-10');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Should show pips at 0, 10, 20, ..., 90, 100
    await expect(pips).toHaveCount(11);
    await expect(pipValues).toHaveText(['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100']);
  });

  test('step of 2.5 should show pips at 2.5-unit intervals', async ({ page }) => {
    const slider = page.locator('#step-2-5');
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
  });

  test('step of 7.3 should show pips at 7.3-unit intervals', async ({ page }) => {
    const slider = page.locator('#step-7-3');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Should show pips at 0, 7.3, 14.6, ..., 94.9, 100
    await expect(pips).toHaveCount(15);
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
  });

  test('step of 13.7 should show pips at 13.7-unit intervals', async ({ page }) => {
    const slider = page.locator('#step-13-7');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Should show pips at 0, 13.7, 27.4, ..., 95.9, 100
    await expect(pips).toHaveCount(9);
    await expect(pipValues).toHaveText(['0', '13.7', '27.4', '41.1', '54.8', '68.5', '82.2', '95.9', '100']);
  });

  test('step of 2.5 with custom min/max should show correct intervals', async ({ page }) => {
    const slider = page.locator('#step-2-5-minmax');
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

  test('step of 7.3 with custom min/max should show correct intervals', async ({ page }) => {
    const slider = page.locator('#step-7-3-minmax');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Should show pips at 10, 17.3, 24.6, ..., 82.7, 90
    await expect(pips).toHaveCount(12);
    await expect(pipValues).toHaveText([
      '10',
      '17.3',
      '24.6',
      '31.9',
      '39.2',
      '46.5',
      '53.8',
      '61.1',
      '68.4',
      '75.7',
      '83',
      '90'
    ]);
  });

  test('step of 17 with custom min/max (wholly divisible) should show correct intervals', async ({ page }) => {
    const slider = page.locator('#step-17-minmax');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Should show pips at 17, 34, 51, 68, 85
    // Range is 68 (85-17), which is wholly divisible by 17
    await expect(pips).toHaveCount(5);
    await expect(pipValues).toHaveText(['17', '34', '51', '68', '85']);
  });

  test('step of 23 with custom min/max (not wholly divisible) should show correct intervals', async ({ page }) => {
    const slider = page.locator('#step-23-minmax');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Should show pips at 23, 46, 69, 92
    // Range is 69 (92-23), which is not wholly divisible by 23
    await expect(pips).toHaveCount(5);
    await expect(pipValues).toHaveText(['23', '46', '69', '92', '99']);
  });

  test('step of 0.1 should reduce number of pips due to stepMax limit', async ({ page }) => {
    const slider = page.locator('#step-0-1');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // normally we would expect 1,001 pips (100/0.1 + 1)
    // but because of the stepMax limit, the step is divided by 5 and we only see 201
    await expect(pips).toHaveCount(201);
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
  });

  test('step of 0.01 should further reduce number of pips', async ({ page }) => {
    const slider = page.locator('#step-0-01');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // normally we would expect 10,001 pips (100/0.01 + 1)
    // but because of the stepMax limit, the step is divided by 5 (2000),
    // however, there's a check to make sure we don't show more than 1000 pips (pipCount > 1000),
    // which will recursively divide the pipstep by 2 until it gets below 1000.
    // so we end up with 501 pips.
    await expect(pips).toHaveCount(501);
    await expect(pipValues).toContainText(['0', '100']);
  });

  test('step of 100 should show only min and max pips', async ({ page }) => {
    const slider = page.locator('#step-100');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Should show only 0 and 100
    await expect(pips).toHaveCount(2);
    await expect(pipValues).toHaveText(['0', '100']);
  });

  test('step of 0.0001 should show maximum number of pips', async ({ page }) => {
    const slider = page.locator('#step-0-0001');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Normally we would expect 1,000,001 pips (100/0.0001 + 1)
    // but because of the stepMax limit, the step is divided by 5 (200000),
    // however, there's a check to make sure we don't show more than 1000 pips (pipCount > 1000),
    // which will recursively divide the pipstep by 2 until it gets below 1000.
    // so we end up with 783 pips. ( 200000 -> 100000 -> 50000 -> 25000 -> 12500 -> 6250 -> 3125 -> 1563 -> 782 ) + 1
    await expect(pips).toHaveCount(783);
    await expect(pipValues).toContainText(['0', '100']);
  });

  test('dynamic step control should update pips correctly', async ({ page }) => {
    const slider = page.locator('#dynamic-step');
    const toggleButton = page.locator('#toggle-step');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Initial state (step=1)
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

    // Click to add step=2.5
    await toggleButton.click();
    await expect(toggleButton).toHaveText('Remove Step');

    // After adding step=2.5
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

    // Click to remove step
    await toggleButton.click();
    await expect(toggleButton).toHaveText('Add Step');

    // After removing step (back to step=1)
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

  test('dynamic min/max with step should update pips correctly', async ({ page }) => {
    const slider = page.locator('#dynamic-minmax');
    const toggleButton = page.locator('#toggle-minmax');
    const pips = slider.locator('.rsPip');
    const pipValues = slider.locator('.rsPipVal');

    // Initial state (step=7.3, min=0, max=100)
    await expect(pips).toHaveCount(15);
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

    // Click to add min/max limits
    await toggleButton.click();
    await expect(toggleButton).toHaveText('Remove Min/Max');

    // After adding min/max limits (step=7.3, min=20, max=80)
    await expect(pips).toHaveCount(10);
    await expect(pipValues).toHaveText(['20', '27.3', '34.6', '41.9', '49.2', '56.5', '63.8', '71.1', '78.4', '80']);

    // Click to remove min/max limits
    await toggleButton.click();
    await expect(toggleButton).toHaveText('Add Min/Max');

    // After removing min/max limits (back to step=7.3, min=0, max=100)
    await expect(pips).toHaveCount(15);
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
  });
});
