import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/svelte';
import RangeSlider from '$lib/components/RangeSlider.svelte';
import { $, $$ } from './utils.js';

describe('RangeSlider ~ no props', () => {
  const { container: $slider } = render(RangeSlider, { props: {} });
  const $handle = $('.rangeHandle', $slider);
  const $nub = $('.rangeNub', $slider);
  describe('should render', () => {
    it('should have a .rangeSlider', () => {
      expect($slider, '.rangeSlider exists in DOM').exist.toBeTruthy();
    });
    it('should have a .rangeHandle', () => {
      expect($handle, '.rangeHandle exists in DOM').exist.toBeTruthy();
    });
    it('should have a .rangeNub', () => {
      expect($nub, 'rangeNubs exists in DOM').exist.toBeTruthy();
    });
  });
  describe('should have the correct attributes', () => {
    it('should be a slider role', () => {
      expect($handle).toHaveAttribute('role', 'slider');
    });
    it('should have a min of 0', () => {
      expect($handle).toHaveAttribute('aria-valuemin', '0');
    });
    it('should have a max of 100', () => {
      expect($handle).toHaveAttribute('aria-valuemax', '100');
    });
    it('should have a value of 50', () => {
      expect($handle).toHaveAttribute('aria-valuenow', '50');
    });
    it('should be positioned at 50%', () => {
      expect($handle).toHaveStyle('left: 50%;');
    });
    it('should have a orientation of horizontal', () => {
      expect($handle).toHaveAttribute('aria-orientation', 'horizontal');
    });
    it('should not be disabled', () => {
      expect($handle).toHaveAttribute('aria-disabled', 'false');
    });
  });
});
