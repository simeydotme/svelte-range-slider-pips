import { codeToHtml } from 'shiki3';

export const orientationTypes = [
  {
    label: 'Horizontal',
    value: 'horizontal',
  },
  {
    label: 'Vertical',
    value: 'vertical',
  },
];

export const rangeTypes = [
  {
    label: 'Slider',
    value: false,
    tooltip: 'A slider with one or more handles',
  },
  {
    label: 'Range Slider',
    value: true,
    tooltip: 'A slider with two handles and a filled range between them',
  },
  {
    label: 'Min Slider',
    value: 'min',
    tooltip: 'A slider with one handle and a range between the minimum value and the handle',
  },
  {
    label: 'Max Slider',
    value: 'max',
    tooltip: 'A slider with one handle and a range between the handle and the maximum value',
  },
];

export const easingTypes = [
  { name: 'Default', config: { stiffness: 0.15, damping: 0.4 } },
  { name: 'Fast', config: { stiffness: 0.66, damping: 0.5 } },
  { name: 'Sharp', config: { stiffness: 0.4, damping: 0.4 } },
  { name: 'Slow', config: { stiffness: 0.1, damping: 0.65 } },
  { name: 'Sluggish', config: { stiffness: 0.3, damping: 0.9 } },
  { name: 'Rubber', config: { stiffness: 0.2, damping: 0.15 } },
  { name: 'Elastic', config: { stiffness: 0.72, damping: 0.28 } },
  { name: 'Bouncy', config: { stiffness: 0.3, damping: 0.08 } },
];

export const darkmodeTypes = [
  { label: 'False', value: false },
  { label: 'Auto', value: 'auto' },
  { label: 'Force', value: 'force' },
];

export const handleTypes = [
  { label: 'Default', value: 'default', tooltip: 'The default handle style' },
  { label: 'Ring', value: 'ring', tooltip: 'A ring style handle' },
  { label: 'Rectangle', value: 'rectangle', tooltip: 'A rectangular handle with indents' },
  { label: 'Triangle', value: 'triangle', tooltip: 'A triangle handle with a circle' },
];
