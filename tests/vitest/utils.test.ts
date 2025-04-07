import { describe, it, expect } from 'vitest';
import {
  coerceFloat,
  clampValue,
  valueAsPercent,
  constrainAndAlignValue,
  pureText,
  normalisedClient,
  elementIndex,
  isInRange,
  isOutOfLimit,
  isSelected,
  getValueFromIndex,
  isFiniteNumber
} from '../../src/lib/utils.js';

describe('coerceFloat()', () => {
  it('should coerce number to float with default precision (2)', () => {
    expect(coerceFloat(10.12345)).toBeCloseTo(10.12);
    expect(coerceFloat('10.12345')).toBeCloseTo(10.12);
  });

  it('should respect custom precision', () => {
    expect(coerceFloat(10.12345, 3)).toBeCloseTo(10.123);
    expect(coerceFloat('10.12345', 1)).toBeCloseTo(10.1);
  });
});

describe('clampValue()', () => {
  it('should clamp values within range', () => {
    expect(clampValue(5, 0, 10)).toBe(5);
    expect(clampValue(-5, 0, 10)).toBe(0);
    expect(clampValue(15, 0, 10)).toBe(10);
  });
});

describe('valueAsPercent()', () => {
  it('should calculate correct percentage', () => {
    expect(valueAsPercent(50, 0, 100)).toBe(50);
    expect(valueAsPercent(5, 0, 10)).toBe(50);
  });

  it('should handle edge cases', () => {
    expect(valueAsPercent(0, 0, 100)).toBe(0);
    expect(valueAsPercent(100, 0, 100)).toBe(100);
    expect(valueAsPercent(-10, 0, 100)).toBe(0);
    expect(valueAsPercent(110, 0, 100)).toBe(100);
  });

  it('should respect precision', () => {
    expect(valueAsPercent(5.5, 0, 10, 3)).toBeCloseTo(55.0);
  });
});

describe('constrainAndAlignValue()', () => {
  it('should align values to steps', () => {
    expect(constrainAndAlignValue(2.3, 0, 10, 1)).toBe(2);
    expect(constrainAndAlignValue(2.7, 0, 10, 1)).toBe(3);
  });

  it('should respect limits', () => {
    expect(constrainAndAlignValue(2.7, 0, 10, 1, 2, [2, 8])).toBe(3);
    expect(constrainAndAlignValue(1, 0, 10, 1, 2, [2, 8])).toBe(2);
    expect(constrainAndAlignValue(9, 0, 10, 1, 2, [2, 8])).toBe(8);
  });
});

describe('pureText()', () => {
  it('should remove HTML tags', () => {
    expect(pureText('<p>Hello <strong>World</strong></p>')).toBe('Hello World');
    expect(pureText('Plain text')).toBe('Plain text');
  });

  it('should handle empty or undefined input', () => {
    expect(pureText()).toBe('');
    expect(pureText('')).toBe('');
  });
});

const createMockTouch = (overrides = {}) => ({
  clientX: 0,
  clientY: 0,
  identifier: 1,
  target: document.body,
  screenX: 0,
  screenY: 0,
  pageX: 0,
  pageY: 0,
  radiusX: 0,
  radiusY: 0,
  rotationAngle: 0,
  force: 1,
  ...overrides
});

describe('normalisedClient()', () => {
  it('should handle mouse events', () => {
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 200
    });
    expect(normalisedClient(mouseEvent)).toEqual({ x: 100, y: 200 });
  });

  it('should handle touch events', () => {
    const touchEvent = new TouchEvent('touchstart', {
      touches: [
        createMockTouch({
          clientX: 100,
          clientY: 200
        })
      ] as unknown as Touch[]
    });

    expect(normalisedClient(touchEvent)).toEqual({ x: 100, y: 200 });
  });

  it('should handle touch events with changedTouches', () => {
    const touchEvent = new TouchEvent('touchend', {
      changedTouches: [
        createMockTouch({
          clientX: 150,
          clientY: 250
        })
      ] as unknown as Touch[]
    });

    expect(normalisedClient(touchEvent)).toEqual({ x: 150, y: 250 });
  });
});

describe('elementIndex()', () => {
  it('should return correct index of element', () => {
    const parent = document.createElement('div');
    const child1 = document.createElement('div');
    const child2 = document.createElement('div');
    const child3 = document.createElement('div');

    parent.appendChild(child1);
    parent.appendChild(child2);
    parent.appendChild(child3);

    expect(elementIndex(child1)).toBe(0);
    expect(elementIndex(child2)).toBe(1);
    expect(elementIndex(child3)).toBe(2);
  });

  it('should return -1 for null element', () => {
    expect(elementIndex(null)).toBe(-1);
  });
});

describe('isInRange()', () => {
  it('should check min range correctly', () => {
    expect(isInRange(5, [10], 'min')).toBe(true);
    expect(isInRange(15, [10], 'min')).toBe(false);
  });

  it('should check max range correctly', () => {
    expect(isInRange(15, [10], 'max')).toBe(true);
    expect(isInRange(5, [10], 'max')).toBe(false);
  });

  it('should check full range correctly', () => {
    expect(isInRange(15, [10, 20], true)).toBe(true);
    expect(isInRange(5, [10, 20], true)).toBe(false);
    expect(isInRange(25, [10, 20], true)).toBe(false);
  });
});

describe('isOutOfLimit()', () => {
  it('should check if value is outside limits', () => {
    expect(isOutOfLimit(5, [10, 20])).toBe(true);
    expect(isOutOfLimit(15, [10, 20])).toBe(false);
    expect(isOutOfLimit(25, [10, 20])).toBe(true);
  });

  it('should handle null limits', () => {
    expect(isOutOfLimit(5, null)).toBe(false);
  });
});

describe('isSelected()', () => {
  it('should check if value is selected', () => {
    expect(isSelected(5, [5, 10, 15])).toBe(true);
    expect(isSelected(7, [5, 10, 15])).toBe(false);
  });

  it('should respect precision', () => {
    expect(isSelected(5.123, [5.1, 10, 15], 1)).toBe(true);
    expect(isSelected(5.123, [5.12, 10, 15], 3)).toBe(false);
  });
});

describe('getValueFromIndex()', () => {
  it('should calculate correct value from index', () => {
    // Test different index values
    expect(getValueFromIndex(0, 0, 100, 1, 10)).toBe(0);
    expect(getValueFromIndex(1, 0, 100, 1, 10)).toBe(10);
    expect(getValueFromIndex(3, 0, 100, 1, 10)).toBe(30);
    expect(getValueFromIndex(5, 0, 100, 1, 10)).toBe(50);
    expect(getValueFromIndex(9, 0, 100, 1, 10)).toBe(90);
    expect(getValueFromIndex(10, 0, 100, 1, 10)).toBe(100);
    expect(getValueFromIndex(0.5, 0, 100, 1, 10)).toBe(5);
    expect(getValueFromIndex(1.25, 0, 100, 1, 10)).toBeCloseTo(12.5);

    // Test different min values
    expect(getValueFromIndex(1, -50, 100, 1, 10)).toBe(-40);
    expect(getValueFromIndex(1, 10, 100, 1, 10)).toBe(20);
    expect(getValueFromIndex(1, 25, 100, 1, 10)).toBe(35);
    expect(getValueFromIndex(1, 50, 100, 1, 10)).toBe(60);
    expect(getValueFromIndex(1, 75, 100, 1, 10)).toBe(85);
    expect(getValueFromIndex(1, 10.5, 100, 1, 10)).toBeCloseTo(20.5);
    expect(getValueFromIndex(1, 25.75, 100, 1, 10)).toBeCloseTo(35.75);

    // Test different max values
    expect(getValueFromIndex(1, 0, 50, 1, 10)).toBe(10);
    expect(getValueFromIndex(1, 0, 75, 1, 10)).toBe(10);
    expect(getValueFromIndex(1, 0, 150, 1, 10)).toBe(10);
    expect(getValueFromIndex(1, 0, 200, 1, 10)).toBe(10);
    expect(getValueFromIndex(1, 0, 1000, 1, 10)).toBe(10);
    expect(getValueFromIndex(1, 0, 50.25, 1, 10)).toBe(10);
    expect(getValueFromIndex(1, 0, 75.75, 1, 10)).toBe(10);

    // Test different pipStep values
    expect(getValueFromIndex(2, 0, 100, 0.5, 10)).toBe(10);
    expect(getValueFromIndex(1, 0, 100, 2, 10)).toBe(20);
    expect(getValueFromIndex(1, 0, 100, 3, 10)).toBe(30);
    expect(getValueFromIndex(1, 0, 100, 4, 10)).toBe(40);
    expect(getValueFromIndex(1, 0, 100, 5, 10)).toBe(50);
    expect(getValueFromIndex(1, 0, 100, 2.25, 10)).toBeCloseTo(22.5);
    expect(getValueFromIndex(1, 0, 100, 3.75, 10)).toBeCloseTo(37.5);

    // Test different step values
    expect(getValueFromIndex(1, 0, 100, 1, 1)).toBe(1);
    expect(getValueFromIndex(1, 0, 100, 1, 5)).toBe(5);
    expect(getValueFromIndex(1, 0, 100, 1, 15)).toBe(15);
    expect(getValueFromIndex(1, 0, 100, 1, 20)).toBe(20);
    expect(getValueFromIndex(1, 0, 100, 1, 25)).toBe(25);
    expect(getValueFromIndex(1, 0, 100, 1, 15.5)).toBeCloseTo(15.5);
    expect(getValueFromIndex(1, 0, 100, 1, 20.75)).toBeCloseTo(20.75);

    // Test some mixed fractional properties
    expect(getValueFromIndex(2, 0, 100, 1, 10.123)).toBeCloseTo(20.246);
    expect(getValueFromIndex(2, 0, 100, 2.5, 10.123, 3)).toBeCloseTo(50.615);
  });

  it('should fail for invalid inputs', () => {
    // Invalid index
    expect(getValueFromIndex(-1, 0, 100, 1, 10)).not.toBe(10);

    // Invalid min/max
    expect(getValueFromIndex(1, 100, 0, 1, 10)).not.toBe(10);

    // Invalid pipStep
    expect(getValueFromIndex(1, 0, 100, -1, 10)).not.toBe(10);

    // Invalid step
    expect(getValueFromIndex(1, 0, 100, 1, 0)).not.toBe(10);

    // Out of range index
    expect(getValueFromIndex(11, 0, 100, 1, 10)).not.toBe(100);
  });

  it('should respect precision', () => {
    expect(getValueFromIndex(1, 0, 100, 1, 10.123, 3)).toBeCloseTo(10.123);
  });
});

describe('isFiniteNumber', () => {
  it('should return true for finite numbers', () => {
    expect(isFiniteNumber(42)).toBe(true);
    expect(isFiniteNumber(0)).toBe(true);
    expect(isFiniteNumber(-42)).toBe(true);
    expect(isFiniteNumber(3.14)).toBe(true);
  });

  it('should return false for non-numbers', () => {
    // Test with type assertions to properly test the type guard
    const testValues: unknown[] = ['42', null, undefined, {}, []];
    testValues.forEach((value) => {
      expect(isFiniteNumber(value as number)).toBe(false);
    });
  });

  it('should return false for NaN', () => {
    expect(isFiniteNumber(NaN)).toBe(false);
  });

  it('should return false for Infinity', () => {
    expect(isFiniteNumber(Infinity)).toBe(false);
    expect(isFiniteNumber(-Infinity)).toBe(false);
  });
});
