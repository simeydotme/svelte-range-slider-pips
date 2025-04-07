import { describe, it, expect } from 'vitest';
import { isFiniteNumber } from './utils.js';

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
    testValues.forEach(value => {
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