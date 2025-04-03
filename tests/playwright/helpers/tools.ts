import type { Locator, Page } from '@playwright/test';

/**
 * Drag a handle to a specific position
 * @param page - The page object
 * @param slider - The slider locator
 * @param handle - The handle locator
 * @param pos - The position (0-1) to drag the handle to
 * @param vertical - Whether to use y-coordinates (true) or x-coordinates (false)
 */
export const dragHandleTo = async (
  page: Page,
  slider: Locator,
  handle: Locator,
  pos: number,
  vertical: boolean = false
) => {
  await slider.scrollIntoViewIfNeeded();

  const sbox = await slider.boundingBox();
  if (!sbox) throw new Error('Could not get slider bounds');

  await handle.focus();
  const hbox = await handle.boundingBox();
  if (!hbox) throw new Error('Could not get handle bounds');
  const handleCenter = { x: hbox.x + hbox.width / 2, y: hbox.y + hbox.height / 2 };

  // Move mouse to handle center and press down
  await page.mouse.move(handleCenter.x, handleCenter.y);
  await page.mouse.down();

  // Calculate target position based on orientation
  const targetX = vertical ? sbox.x + sbox.width / 2 : sbox.x + sbox.width * pos;
  const targetY = vertical ? sbox.y + sbox.height * pos : sbox.y + sbox.height / 2;

  // Ensure we end exactly at target position
  await page.mouse.move(targetX, targetY, { steps: 50 });
  await page.waitForTimeout(100);
  await page.mouse.up();
};
