// import { expect, test } from '@playwright/test';

// test.describe('Interactions', () => {
//   test('should update value when clicking on slider', async ({ page }) => {
//     await page.goto('/test/range-slider/interaction');
//     const slider = page.locator('.rangeSlider');
//     const handle = page.locator('.rangeHandle');

//     // Click at 75% of the slider width
//     const box = await slider.boundingBox();
//     if (box) {
//       await page.mouse.click(box.x + box.width * 0.75, box.y + box.height / 2);
//       await expect(handle).toHaveAttribute('aria-valuenow', '75');
//       await expect(handle).toHaveStyleValue('left', '75%');
//     }
//   });

//   test('should handle drag operations', async ({ page }) => {
//     await page.goto('/test/range-slider/interaction');
//     const handle = page.locator('.rangeHandle');
//     const slider = page.locator('.rangeSlider');

//     // Get initial position
//     const box = await slider.boundingBox();
//     if (box) {
//       // Start drag from center (50%)
//       await page.mouse.move(box.x + box.width * 0.5, box.y + box.height / 2);
//       await page.mouse.down();

//       // Drag to 75%
//       await page.mouse.move(box.x + box.width * 0.75, box.y + box.height / 2);
//       await expect(handle).toHaveStyleValue('left', '75%');

//       await page.mouse.up();
//     }
//   });
// });
