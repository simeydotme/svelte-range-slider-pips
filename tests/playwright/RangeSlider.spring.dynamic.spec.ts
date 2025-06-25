import { expect, test } from '@playwright/test';
import { clickSliderAt } from './helpers/tools.js';

test.describe('Dynamic Spring Physics Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/range-slider/spring/dynamic');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Spring Physics Behavior Changes', () => {
    test('should change handle movement behavior when switching from default to fast spring', async ({ page }) => {
      const slider = page.locator('#dynamic-spring-slider');
      const handles = slider.locator('.rangeHandle');
      const fastButton = page.locator('button').filter({ hasText: 'Fast' });

      // Verify elements exist
      await expect(slider).toBeVisible();
      await expect(handles.nth(0)).toBeVisible();
      await expect(fastButton).toBeVisible();

      // Start with default spring
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '30');

      // Switch to fast spring
      await fastButton.click();

      // Click at 80% position and observe fast spring behavior
      const handle = handles.nth(0);
      const startTime = Date.now();

      // Click at 80% position
      await clickSliderAt(page, slider, 0.8);

      // With fast spring, the handle should reach the target quickly
      // Wait for CSS animation to complete (this is the actual spring animation)
      await expect(handle).toHaveCSS('--handle-pos', '80');
      const fastDuration = Date.now() - startTime;

      // Verify handle reached target
      await expect(handle).toHaveAttribute('aria-valuenow', '80');

      // Switch back to default spring
      const defaultButton = page.locator('button').filter({ hasText: 'Default' });
      await expect(defaultButton).toBeVisible();
      await defaultButton.click();

      // Reset handle position by clicking at 30%
      await clickSliderAt(page, slider, 0.3);
      await expect(handle).toHaveCSS('--handle-pos', '30');

      // Click at 80% again with default spring
      const startTime2 = Date.now();
      await clickSliderAt(page, slider, 0.8);
      await expect(handle).toHaveCSS('--handle-pos', '80');
      const defaultDuration = Date.now() - startTime2;

      // Fast spring should be significantly faster than default spring
      console.log(
        'fast duration:',
        fastDuration,
        'default duration:',
        defaultDuration,
        '->',
        fastDuration - defaultDuration
      );
      expect(fastDuration).toBeLessThan(defaultDuration * 0.8); // At least 20% faster
    });

    test('should change handle movement behavior when switching from default to slow spring', async ({ page }) => {
      const slider = page.locator('#dynamic-spring-slider');
      const handles = slider.locator('.rangeHandle');
      const slowButton = page.locator('button').filter({ hasText: 'Slow' });

      // Verify elements exist
      await expect(slider).toBeVisible();
      await expect(handles.nth(0)).toBeVisible();
      await expect(slowButton).toBeVisible();

      // Start with default spring
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '30');

      // Switch to slow spring
      await slowButton.click();

      // Click at 80% position and observe slow spring behavior
      const handle = handles.nth(0);
      const startTime = Date.now();

      // Click at 80% position
      await clickSliderAt(page, slider, 0.8);

      // With slow spring, the handle should take longer to reach the target
      // Wait for CSS animation to complete
      await expect(handle).toHaveCSS('--handle-pos', '80');
      const slowDuration = Date.now() - startTime;

      // Verify handle reached target
      await expect(handle).toHaveAttribute('aria-valuenow', '80');

      // Switch back to default spring
      const defaultButton = page.locator('button').filter({ hasText: 'Default' });
      await expect(defaultButton).toBeVisible();
      await defaultButton.click();

      // Reset handle position by clicking at 30%
      await clickSliderAt(page, slider, 0.3);
      await expect(handle).toHaveCSS('--handle-pos', '30');

      // Click at 80% again with default spring
      const startTime2 = Date.now();
      await clickSliderAt(page, slider, 0.8);
      await expect(handle).toHaveCSS('--handle-pos', '80');
      const defaultDuration = Date.now() - startTime2;

      // Slow spring should be significantly slower than default spring
      expect(slowDuration).toBeGreaterThan(defaultDuration * 1.2); // At least 20% slower
    });

    test('should change handle movement behavior when switching from default to bouncy spring', async ({ page }) => {
      const slider = page.locator('#dynamic-spring-slider');
      const handles = slider.locator('.rangeHandle');
      const bouncyButton = page.locator('button').filter({ hasText: 'Bouncy' });

      // Verify elements exist
      await expect(slider).toBeVisible();
      await expect(handles.nth(0)).toBeVisible();
      await expect(bouncyButton).toBeVisible();

      // Start with default spring
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '30');

      // Switch to bouncy spring
      await bouncyButton.click();

      // Click at 80% position and observe bouncy spring behavior
      const handle = handles.nth(0);
      const startTime = Date.now();

      // Click at 80% position
      await clickSliderAt(page, slider, 0.8);

      // With bouncy spring, the handle should overshoot and settle
      // Wait for CSS animation to complete
      await expect(handle).toHaveCSS('--handle-pos', '80');
      const bouncyDuration = Date.now() - startTime;

      // Verify handle reached target (may have overshot and settled back)
      const finalValue = await handle.getAttribute('aria-valuenow');
      expect(parseInt(finalValue!)).toBeCloseTo(80, -1); // Within 10 units

      // Switch back to default spring
      const defaultButton = page.locator('button').filter({ hasText: 'Default' });
      await expect(defaultButton).toBeVisible();
      await defaultButton.click();

      // Reset handle position by clicking at 30%
      await clickSliderAt(page, slider, 0.3);
      await expect(handle).toHaveCSS('--handle-pos', '30');

      // Click at 80% again with default spring
      const startTime2 = Date.now();
      await clickSliderAt(page, slider, 0.8);
      await expect(handle).toHaveCSS('--handle-pos', '80');
      const defaultDuration = Date.now() - startTime2;

      // Bouncy spring should have different timing characteristics than default spring
      // (typically longer due to overshoot and settling)
      console.log(
        'bouncy duration:',
        bouncyDuration,
        'default duration:',
        defaultDuration,
        '->',
        bouncyDuration - defaultDuration
      );
      expect(bouncyDuration).toBeGreaterThan(defaultDuration * 1.1); // At least 10% longer due to bounce
    });

    test('should change handle movement behavior when switching from default to stiff spring', async ({ page }) => {
      const slider = page.locator('#dynamic-spring-slider');
      const handles = slider.locator('.rangeHandle');
      const stiffButton = page.locator('button').filter({ hasText: 'Stiff' });

      // Verify elements exist
      await expect(slider).toBeVisible();
      await expect(handles.nth(0)).toBeVisible();
      await expect(stiffButton).toBeVisible();

      // Start with default spring
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '30');

      // Switch to stiff spring
      await stiffButton.click();

      // Click at 80% position and observe stiff spring behavior
      const handle = handles.nth(0);
      const startTime = Date.now();

      // Click at 80% position
      await clickSliderAt(page, slider, 0.8);

      // With stiff spring, the handle should move quickly but with less bounce
      // Wait for CSS animation to complete
      await expect(handle).toHaveCSS('--handle-pos', '80');
      const stiffDuration = Date.now() - startTime;

      // Verify handle reached target
      await expect(handle).toHaveAttribute('aria-valuenow', '80');

      // Switch back to default spring
      const defaultButton = page.locator('button').filter({ hasText: 'Default' });
      await expect(defaultButton).toBeVisible();
      await defaultButton.click();

      // Reset handle position by clicking at 30%
      await clickSliderAt(page, slider, 0.3);
      await expect(handle).toHaveCSS('--handle-pos', '30');

      // Click at 80% again with default spring
      const startTime2 = Date.now();
      await clickSliderAt(page, slider, 0.8);
      await expect(handle).toHaveCSS('--handle-pos', '80');
      const defaultDuration = Date.now() - startTime2;

      // Stiff spring should be significantly faster than default spring
      console.log(
        'stiff duration:',
        stiffDuration,
        'default duration:',
        defaultDuration,
        '->',
        stiffDuration - defaultDuration
      );
      expect(stiffDuration).toBeLessThan(defaultDuration * 0.9); // At least 10% faster
    });
  });

  test.describe('Spring Toggle Physics Tests', () => {
    test('should disable spring physics when spring is turned off', async ({ page }) => {
      const slider = page.locator('#dynamic-spring-slider');
      const handles = slider.locator('.rangeHandle');
      const toggleButton = page.locator('button').filter({ hasText: /Enable|Disable/ });

      // Verify elements exist
      await expect(slider).toBeVisible();
      await expect(handles.nth(0)).toBeVisible();
      await expect(toggleButton).toBeVisible();

      // Start with spring enabled
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '30');

      // Disable spring
      await toggleButton.click();
      await expect(toggleButton).toHaveText(/Enable/);

      // Click at 80% position - should move immediately without animation
      const handle = handles.nth(0);
      const startTime = Date.now();

      await clickSliderAt(page, slider, 0.8);

      // Should reach target immediately (no spring animation)
      await expect(handle).toHaveCSS('--handle-pos', '80');
      const noSpringDuration = Date.now() - startTime;

      // Verify handle reached target immediately
      await expect(handle).toHaveAttribute('aria-valuenow', '80');

      // Re-enable spring
      await toggleButton.click();
      await expect(toggleButton).toHaveText(/Disable/);

      // Reset handle position by clicking at 30%
      await clickSliderAt(page, slider, 0.3);
      await expect(handle).toHaveCSS('--handle-pos', '30');

      // Click at 80% again with spring enabled
      const startTime2 = Date.now();
      await clickSliderAt(page, slider, 0.8);
      await expect(handle).toHaveCSS('--handle-pos', '80');
      const springDuration = Date.now() - startTime2;

      // Spring animation should take significantly longer than immediate movement
      console.log(
        'spring duration difference:',
        springDuration,
        noSpringDuration,
        '->',
        springDuration - noSpringDuration
      );
      expect(springDuration).toBeGreaterThan(noSpringDuration * 2); // At least 2x longer
    });

    test('should re-enable spring physics when spring is turned back on', async ({ page }) => {
      const slider = page.locator('#dynamic-spring-slider');
      const handles = slider.locator('.rangeHandle');
      const toggleButton = page.locator('button').filter({ hasText: /Enable|Disable/ });

      // Verify elements exist
      await expect(slider).toBeVisible();
      await expect(handles.nth(0)).toBeVisible();
      await expect(toggleButton).toBeVisible();

      // Start with spring disabled
      await toggleButton.click();
      await expect(toggleButton).toHaveText(/Enable/);
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '30');

      // Re-enable spring
      await toggleButton.click();
      await expect(toggleButton).toHaveText(/Disable/);

      // Click at 80% position - should now animate
      const handle = handles.nth(0);
      const startTime = Date.now();

      await clickSliderAt(page, slider, 0.8);

      // Should animate to target
      await expect(handle).toHaveCSS('--handle-pos', '80');
      const springDuration = Date.now() - startTime;

      // Verify handle reached target
      await expect(handle).toHaveAttribute('aria-valuenow', '80');

      // Spring animation should take a reasonable amount of time
      console.log('spring duration:', springDuration);
      expect(springDuration).toBeGreaterThan(200); // Should take at least 200ms for noticeable spring animation
    });
  });

  test.describe('Dynamic Spring Values Tests', () => {
    test('should change handle behavior when stiffness is adjusted dynamically', async ({ page }) => {
      const slider = page.locator('#dynamic-spring-slider');
      const handles = slider.locator('.rangeHandle');
      const stiffnessSlider = page.locator('#stiffness');

      // Verify elements exist
      await expect(slider).toBeVisible();
      await expect(handles.nth(0)).toBeVisible();
      await expect(stiffnessSlider).toBeVisible();

      // Start with default stiffness and test it first
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '30');

      const handle = handles.nth(0);
      const startTime = Date.now();

      await clickSliderAt(page, slider, 0.8);
      await expect(handle).toHaveCSS('--handle-pos', '80');
      const defaultStiffnessDuration = Date.now() - startTime;

      // Reset handle position by clicking at 30%
      await clickSliderAt(page, slider, 0.3);
      await expect(handle).toHaveCSS('--handle-pos', '30');

      // Set very low stiffness
      await stiffnessSlider.fill('0.02');

      // Click at 80% position and observe slow movement
      const startTime2 = Date.now();
      await clickSliderAt(page, slider, 0.8);
      await expect(handle).toHaveCSS('--handle-pos', '80');
      const lowStiffnessDuration = Date.now() - startTime2;

      // Low stiffness should be significantly slower than default stiffness
      console.log(
        'default stiffness duration:',
        defaultStiffnessDuration,
        'low stiffness duration:',
        lowStiffnessDuration,
        '->',
        lowStiffnessDuration - defaultStiffnessDuration
      );
      expect(lowStiffnessDuration).toBeGreaterThan(defaultStiffnessDuration * 1.3); // At least 30% slower
    });

    test('should change handle behavior when damping is adjusted dynamically', async ({ page }) => {
      const slider = page.locator('#dynamic-spring-slider');
      const handles = slider.locator('.rangeHandle');
      const dampingSlider = page.locator('#damping');

      // Verify elements exist
      await expect(slider).toBeVisible();
      await expect(handles.nth(0)).toBeVisible();
      await expect(dampingSlider).toBeVisible();

      // Start with default damping and test it first
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '30');

      const handle = handles.nth(0);
      const startTime = Date.now();

      await clickSliderAt(page, slider, 0.8);
      await expect(handle).toHaveCSS('--handle-pos', '80');
      const defaultDampingDuration = Date.now() - startTime;

      // Reset handle position by clicking at 30%
      await clickSliderAt(page, slider, 0.3);
      await expect(handle).toHaveCSS('--handle-pos', '30');

      // set very high damping
      await dampingSlider.fill('0.99');

      // Click at 80% position and observe slow movement
      const startTime2 = Date.now();
      await clickSliderAt(page, slider, 0.8);
      await expect(handle).toHaveCSS('--handle-pos', '80');
      const highDampingDuration = Date.now() - startTime2;

      // High damping should be significantly slower than default damping
      console.log(
        'default damping duration:',
        defaultDampingDuration,
        'high damping duration:',
        highDampingDuration,
        '->',
        highDampingDuration - defaultDampingDuration
      );
      expect(highDampingDuration).toBeGreaterThan(defaultDampingDuration * 1.3); // At least 30% slower
    });

    test('should change handle behavior when both stiffness and damping are adjusted', async ({ page }) => {
      const slider = page.locator('#dynamic-spring-slider');
      const handles = slider.locator('.rangeHandle');
      const stiffnessSlider = page.locator('#stiffness');
      const dampingSlider = page.locator('#damping');

      const originalStiffness = '0.15';
      const originalDamping = '0.4';

      // Verify elements exist
      await expect(slider).toBeVisible();
      await expect(handles.nth(0)).toBeVisible();
      await expect(stiffnessSlider).toBeVisible();
      await expect(dampingSlider).toBeVisible();

      // Start with default values
      await expect(handles.nth(0)).toHaveAttribute('aria-valuenow', '30');

      const handle = handles.nth(0);

      // Test 1: Default baseline movement speed
      await dampingSlider.fill(originalDamping);
      await stiffnessSlider.fill(originalStiffness);
      await page.waitForTimeout(150);
      const startTime1 = Date.now();
      await clickSliderAt(page, slider, 0.8);
      await expect(handle).toHaveCSS('--handle-pos', '80');
      const defaultDuration = Date.now() - startTime1;

      // Reset handle position
      await clickSliderAt(page, slider, 0.3);
      await expect(handle).toHaveCSS('--handle-pos', '30');

      // Test 2: Only damping change (high damping = slower)
      await stiffnessSlider.fill(originalStiffness);
      await dampingSlider.fill('0.97');
      await page.waitForTimeout(150);
      const startTime2 = Date.now();
      await clickSliderAt(page, slider, 0.8);
      await expect(handle).toHaveCSS('--handle-pos', '80');
      const highDampingDuration = Date.now() - startTime2;

      // Reset handle position and damping
      await clickSliderAt(page, slider, 0.3);
      await expect(handle).toHaveCSS('--handle-pos', '30');

      // Test 3: Only stiffness change (low stiffness = slower)
      await stiffnessSlider.fill('0.04');
      await dampingSlider.fill(originalDamping);
      await page.waitForTimeout(150);
      const startTime3 = Date.now();
      await clickSliderAt(page, slider, 0.8);
      await expect(handle).toHaveCSS('--handle-pos', '80');
      const lowStiffnessDuration = Date.now() - startTime3;

      // Reset handle position and stiffness
      await clickSliderAt(page, slider, 0.3);
      await expect(handle).toHaveCSS('--handle-pos', '30');

      // Test 4: Both stiffness and damping changes
      await stiffnessSlider.fill('0.06');
      await dampingSlider.fill('0.92');
      await page.waitForTimeout(150);
      const startTime4 = Date.now();
      await clickSliderAt(page, slider, 0.8);
      await expect(handle).toHaveCSS('--handle-pos', '80');
      const bothChangesDuration = Date.now() - startTime4;

      // Log all durations for debugging
      console.log('Movement durations comparison:');
      console.log('Default:', defaultDuration, 'ms');
      console.log('High damping only:', highDampingDuration, 'ms');
      console.log('Low stiffness only:', lowStiffnessDuration, 'ms');
      console.log('Both changes:', bothChangesDuration, 'ms');

      // Compare all durations - they should be significantly different
      expect(highDampingDuration).toBeGreaterThan(defaultDuration * 1.2);
      expect(lowStiffnessDuration).toBeGreaterThan(defaultDuration * 1.2);

      // Both changes should be the slowest
      expect(bothChangesDuration).toBeGreaterThan(defaultDuration * 1.5);
      expect(bothChangesDuration).toBeGreaterThan(highDampingDuration * 1.1);
      expect(bothChangesDuration).toBeGreaterThan(lowStiffnessDuration * 1.1);
    });
  });

  test.describe('Edge Case Physics Tests', () => {
    test('should handle rapid spring configuration changes', async ({ page }) => {
      const slider = page.locator('#dynamic-spring-slider');
      const handles = slider.locator('.rangeHandle');
      const stiffnessSlider = page.locator('#stiffness');
      const dampingSlider = page.locator('#damping');

      // Verify elements exist
      await expect(slider).toBeVisible();
      await expect(handles.nth(0)).toBeVisible();
      await expect(stiffnessSlider).toBeVisible();
      await expect(dampingSlider).toBeVisible();

      // Rapidly change spring configuration
      for (let i = 0; i < 3; i++) {
        await stiffnessSlider.fill((0.2 + i * 0.3).toString());
        await dampingSlider.fill((0.2 + i * 0.3).toString());
      }

      // Click at 80% position
      await clickSliderAt(page, slider, 0.8);

      // Should handle the changes gracefully
      await expect(handles.nth(0)).toHaveCSS('--handle-pos', '80');
      const finalValue = await handles.nth(0).getAttribute('aria-valuenow');
      expect(parseInt(finalValue!)).toBeCloseTo(80, -1);
    });
  });
});
