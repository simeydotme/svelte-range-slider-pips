import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import RangeSlider from '$lib/components/RangeSlider.svelte';
import { $, $$ } from './utils.js';

describe('RangeSlider ~ Min/Max props', () => {
  describe('Default min/max (no props)', () => {
    const { container: $slider } = render(RangeSlider);
    const $handle = $('.rangeHandle', $slider);

    it('should have default min of 0', () => {
      expect($handle).toHaveAttribute('aria-valuemin', '0');
    });

    it('should have default max of 100', () => {
      expect($handle).toHaveAttribute('aria-valuemax', '100');
    });

    it('should position handle at 50% (midpoint)', () => {
      expect($handle).toHaveStyle('left: 50%;');
    });
  });

  describe('Custom min/max range', () => {
    const { container: $slider } = render(RangeSlider, {
      props: { min: -50, max: 50 }
    });
    const $handle = $('.rangeHandle', $slider);

    it('should have min of -50', () => {
      expect($handle).toHaveAttribute('aria-valuemin', '-50');
    });

    it('should have max of 50', () => {
      expect($handle).toHaveAttribute('aria-valuemax', '50');
    });

    it('should position handle at 50% (midpoint = 0)', () => {
      expect($handle).toHaveAttribute('aria-valuenow', '0');
      expect($handle).toHaveStyle('left: 50%;');
    });
  });

  describe('Negative min/max range', () => {
    const { container: $slider } = render(RangeSlider, {
      props: { min: -100, max: -50 }
    });
    const $handle = $('.rangeHandle', $slider);

    it('should have min of -100', () => {
      expect($handle).toHaveAttribute('aria-valuemin', '-100');
    });

    it('should have max of -50', () => {
      expect($handle).toHaveAttribute('aria-valuemax', '-50');
    });

    it('should position handle at 50% (midpoint = -75)', () => {
      expect($handle).toHaveAttribute('aria-valuenow', '-75');
      expect($handle).toHaveStyle('left: 50%;');
    });
  });

  describe('Decimal min/max range', () => {
    const { container: $slider } = render(RangeSlider, {
      props: { min: 0.5, max: 2.5 }
    });
    const $handle = $('.rangeHandle', $slider);

    it('should have min of 0.5', () => {
      expect($handle).toHaveAttribute('aria-valuemin', '0.5');
    });

    it('should have max of 2.5', () => {
      expect($handle).toHaveAttribute('aria-valuemax', '2.5');
    });

    it('should position handle at 50% (midpoint = 1.5)', () => {
      expect($handle).toHaveAttribute('aria-valuenow', '1.5');
      expect($handle).toHaveStyle('left: 50%;');
    });
  });

  describe('With explicit value within min/max', () => {
    const { container: $slider } = render(RangeSlider, {
      props: { min: 0, max: 200, value: 50 }
    });
    const $handle = $('.rangeHandle', $slider);

    it('should have correct min/max', () => {
      expect($handle).toHaveAttribute('aria-valuemin', '0');
      expect($handle).toHaveAttribute('aria-valuemax', '200');
    });

    it('should position handle at 25% (value = 50)', () => {
      expect($handle).toHaveAttribute('aria-valuenow', '50');
      expect($handle).toHaveStyle('left: 25%;');
    });
  });

  describe('When min is greater than max', () => {
    const { container: $slider } = render(RangeSlider, {
      props: { min: 100, max: 0 }
    });
    const $handle = $('.rangeHandle', $slider);

    it('the min/max values should be reset to 0/100', () => {
      expect($handle).toHaveAttribute('aria-valuemin', '0');
      expect($handle).toHaveAttribute('aria-valuemax', '100');
    });

    it('should position handle at midpoint', () => {
      expect($handle).toHaveAttribute('aria-valuenow', '50');
      expect($handle).toHaveStyle('left: 50%;');
    });
  });

  describe('With extremely large numbers', () => {
    const { container: $slider } = render(RangeSlider, {
      props: { min: 1000000, max: 2000000, value: 1500000 }
    });
    const $handle = $('.rangeHandle', $slider);

    it('should handle large min/max values', () => {
      expect($handle).toHaveAttribute('aria-valuemin', '1000000');
      expect($handle).toHaveAttribute('aria-valuemax', '2000000');
    });

    it('should position handle at 50% for midpoint value', () => {
      expect($handle).toHaveAttribute('aria-valuenow', '1500000');
      expect($handle).toHaveStyle('left: 50%;');
    });
  });

  describe('With very small decimal numbers', () => {
    const { container: $slider } = render(RangeSlider, {
      props: { min: 0.0001, max: 0.0005, value: 0.0002 }
    });
    const $handle = $('.rangeHandle', $slider);

    it('should handle tiny min/max values', () => {
      expect($handle).toHaveAttribute('aria-valuemin', '0.0001');
      expect($handle).toHaveAttribute('aria-valuemax', '0.0005');
    });

    it('should position handle at 25% for quarter value', () => {
      expect($handle).toHaveAttribute('aria-valuenow', '0.0002');
      expect($handle).toHaveStyle('left: 25%;');
    });
  });

  describe('With mixed negative ranges', () => {
    describe('Large negative to small negative', () => {
      const { container: $slider } = render(RangeSlider, {
        props: { min: -1000, max: -10 }
      });
      const $handle = $('.rangeHandle', $slider);

      it('should have correct min/max', () => {
        expect($handle).toHaveAttribute('aria-valuemin', '-1000');
        expect($handle).toHaveAttribute('aria-valuemax', '-10');
      });

      it('should position handle at midpoint', () => {
        expect($handle).toHaveAttribute('aria-valuenow', '-505');
        expect($handle).toHaveStyle('left: 50%;');
      });
    });

    describe('Large negative to small positive', () => {
      const { container: $slider } = render(RangeSlider, {
        props: { min: -1000, max: 10 }
      });
      const $handle = $('.rangeHandle', $slider);

      it('should have correct min/max', () => {
        expect($handle).toHaveAttribute('aria-valuemin', '-1000');
        expect($handle).toHaveAttribute('aria-valuemax', '10');
      });

      it('should position handle at midpoint', () => {
        expect($handle).toHaveAttribute('aria-valuenow', '-495');
        expect($handle).toHaveStyle('left: 50%;');
      });
    });

    describe('Small negative to large positive', () => {
      const { container: $slider } = render(RangeSlider, {
        props: { min: -10, max: 1000 }
      });
      const $handle = $('.rangeHandle', $slider);

      it('should have correct min/max', () => {
        expect($handle).toHaveAttribute('aria-valuemin', '-10');
        expect($handle).toHaveAttribute('aria-valuemax', '1000');
      });

      it('should position handle at midpoint', () => {
        expect($handle).toHaveAttribute('aria-valuenow', '495');
        expect($handle).toHaveStyle('left: 50%;');
      });
    });
  });

  describe('With extreme decimal negative ranges', () => {
    const { container: $slider } = render(RangeSlider, {
      props: { min: -0.005, max: -0.001, precision: 5, step: 0.0001 }
    });
    const $handle = $('.rangeHandle', $slider);

    it('should handle tiny negative min/max values', () => {
      expect($handle).toHaveAttribute('aria-valuemin', '-0.005');
      expect($handle).toHaveAttribute('aria-valuemax', '-0.001');
    });

    it('should position handle at midpoint', () => {
      expect($handle).toHaveAttribute('aria-valuenow', '-0.003');
      expect($handle).toHaveStyle('left: 50%;');
    });
  });
});
