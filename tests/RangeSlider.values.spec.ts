import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/svelte';
import RangeSlider from '$lib/components/RangeSlider.svelte';
import { $, $$ } from './utils.js';

describe('RangeSlider ~ Value props', () => {
  describe('With value set to 75', async () => {
    let value = 75;
    const { container: $slider } = render(RangeSlider, { props: { value } });
    const $handle = $('.rangeHandle', $slider);
    describe('should have the correct attributes', () => {
      it(`should have a value of ${value}`, () => {
        expect($handle?.getAttribute('aria-valuenow'), `value is ${value}`).toBe(`${value}`);
      });
      it(`should be positioned at ${value}%`, () => {
        expect($handle).toHaveStyle(`left: ${value}%;`);
      });
    });
  });

  describe('With values set to 25 and 125', async () => {
    let values = [25, 125];
    const { container: $slider } = render(RangeSlider, { props: { values } });
    const $$handles = $$('.rangeHandle', $slider);
    const valuemax = $$handles[1].getAttribute('aria-valuemax');
    it('should have two handles', () => {
      expect($$handles.length).toBe(2);
    });
    describe('the first handle', () => {
      it(`should have the correct value (${values[0]})`, () => {
        expect($$handles[0]).toHaveAttribute('aria-valuenow', `${values[0]}`);
      });
      it(`should be positioned at ${values[0]}%`, () => {
        expect($$handles[0]).toHaveStyle(`left: ${values[0]}%;`);
      });
    });
    describe('the second handle', () => {
      it(`should not be set to ${values[1]}`, () => {
        expect($$handles[1]).not.toHaveAttribute('aria-valuenow', `${values[1]}`);
      });
      it(`should have been constrained to the max value`, () => {
        expect($$handles[1]).toHaveAttribute('aria-valuenow', `${valuemax}`);
      });
      it(`should be positioned at ${valuemax}%`, () => {
        expect($$handles[1]).toHaveStyle(`left: ${valuemax}%;`);
      });
    });
  });

  describe('With 7 handles', async () => {
    const values = [10, 20, 30, 40, 60, 80, 90];
    const { container: $slider } = render(RangeSlider, { props: { values } });
    const $$handles = $$('.rangeHandle', $slider);
    it('should have 7 handles', () => {
      expect($$handles.length).toBe(7);
    });
    it('should have the correct values', () => {
      for (let i = 0; i < values.length; i++) {
        expect($$handles[i]).toHaveAttribute('aria-valuenow', `${values[i]}`);
      }
    });
  });

  describe('When value is provided as an Array[]', async () => {
    it('should silently fail (set value to 50)', () => {
      const { container: $slider } = render(RangeSlider, { props: { value: [10] } });
      const $handle = $('.rangeHandle', $slider);
      expect($handle).toHaveAttribute('aria-valuenow', `50`);
    });
  });

  describe('When values is provided as a single number', async () => {
    it('should silently fail (set value to 50)', () => {
      const { container: $slider } = render(RangeSlider, { props: { values: 10 } });
      const $handle = $('.rangeHandle', $slider);
      expect($handle).toHaveAttribute('aria-valuenow', `50`);
    });
  });

  describe('When no value is provided', async () => {
    it('should set the value to the midpoint of the range', () => {
      const { container: $slider } = render(RangeSlider, { props: {} });
      const { container: $slider2 } = render(RangeSlider, { props: { min: -50, max: 50 } });
      const { container: $slider3 } = render(RangeSlider, { props: { min: 11, max: 115 } });
      const $handle = $('.rangeHandle', $slider);
      const $handle2 = $('.rangeHandle', $slider2);
      const $handle3 = $('.rangeHandle', $slider3);
      expect($handle).toHaveAttribute('aria-valuenow', `50`);
      expect($handle2).toHaveAttribute('aria-valuenow', `0`);
      expect($handle3).toHaveAttribute('aria-valuenow', `63`);
    });
  });
});
