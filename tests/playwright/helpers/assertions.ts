import { expect as baseExpect, type Locator } from '@playwright/test';
export { test } from '@playwright/test';

// Extend the built-in expect matchers
export const expect = baseExpect.extend({
  async toHaveStyle(locator: Locator, property: string, expectedValue: string, options?: { timeout?: number }) {
    const actualValue = await locator.evaluate((el, prop) => el.style[prop as any], property, {
      timeout: options?.timeout
    });

    return {
      pass: actualValue === expectedValue,
      name: 'toHaveStyle',
      expected: expectedValue,
      actual: actualValue,
      message: () => `Expected element to have style: ${property}="${expectedValue}" but found "${actualValue}"`
    };
  }
});

// Extend the global expect types
declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toHaveStyle(property: string, expectedValue: string, options?: { timeout?: number }): Promise<R>;
    }
  }
}
