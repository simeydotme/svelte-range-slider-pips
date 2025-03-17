import type { Locator, Page } from '@playwright/test';

/**
 * Drag a handle to a specific position
 * @param page - The page object
 * @param slider - The slider locator
 * @param handle - The handle locator
 * @param x - The x position (0-1) to drag the handle to
 */
export const dragHandleTo = async (page: Page, slider: Locator, handle: Locator, x: number) => {
  const sliderBounds = await slider.boundingBox();
  if (!sliderBounds) throw new Error('Could not get slider bounds');

  await handle.focus();
  const handleBox = await handle.boundingBox();
  if (!handleBox) throw new Error('Could not get handle bounds');
  const handleCenter = {
    x: handleBox.x + handleBox.width / 2,
    y: handleBox.y + handleBox.height / 2
  };

  const sliderBox = await slider.boundingBox();
  if (!sliderBox) throw new Error('Could not get slider bounds');

  // Calculate current x position as percentage
  const currentX = (handleCenter.x - sliderBox.x) / sliderBox.width;

  // Move mouse to handle center and press down
  await page.mouse.move(handleCenter.x, handleCenter.y);
  await page.mouse.down();

  // Ensure we end exactly at target position
  await page.mouse.move(sliderBox.x + sliderBox.width * x, sliderBox.y + sliderBox.height / 2, { steps: 5 });
  await page.mouse.up();
};
