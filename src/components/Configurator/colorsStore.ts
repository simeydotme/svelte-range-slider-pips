import { writable, derived, get } from 'svelte/store';
import createPersistedStore from './persistedStore';

import { handleTypes } from './options';
import { configStore } from './configStore';
import { persisted } from 'svelte-persisted-store';

export const defaultColors: Record<string, string> = {
  /* Light theme base colors */
  '--slider-light-bg': '#d7dada',
  '--slider-light-fg': '#3f3e4f',
  '--slider-light-base': '#99a2a2',
  '--slider-light-base-100': '#b9c2c2',
  '--slider-light-accent': '#4a40d4',
  '--slider-light-accent-100': '#838de7',
  '--slider-light-accent-text': '#ffffff',

  /* Dark theme base colors */
  '--slider-dark-bg': '#3f3e4f',
  '--slider-dark-fg': '#d7dada',
  '--slider-dark-base': '#82809f',
  '--slider-dark-base-100': '#595868',
  '--slider-dark-accent': '#6070fc',
  '--slider-dark-accent-100': '#7a7fab',
  '--slider-dark-accent-text': '#ffffff',
};

export const defaultColorsParts: Record<string, string> = {
  /* Component-specific colors (slider) */
  '--range-slider': '#d7dada',
  '--range-handle-inactive': '#99a2a2',
  '--range-handle': '#838de7',
  '--range-handle-focus': '#4a40d4',
  '--range-handle-border': '#838de7',
  '--range-range-inactive': '#99a2a2',
  '--range-range': '#4a40d4',
  '--range-range-limit': '#b9c2c2',
  '--range-range-hover': '#838de7',
  '--range-range-press': '#838de7',
  '--range-float-inactive': '#99a2a2',
  '--range-float': '#4a40d4',
  '--range-float-text': '#ffffff',

  /* Component-specific colors (pips) */
  '--range-pip': '#99a2a2',
  '--range-pip-text': '#99a2a2',
  '--range-pip-active': '#3f3e4f',
  '--range-pip-active-text': '#3f3e4f',
  '--range-pip-hover': '#3f3e4f',
  '--range-pip-hover-text': '#3f3e4f',
  '--range-pip-in-range': '#3f3e4f',
  '--range-pip-in-range-text': '#3f3e4f',
  '--range-pip-out-of-limit': '#b9c2c2',
  '--range-pip-out-of-limit-text': '#b9c2c2',
};

export const colorsStore = createPersistedStore('svelte-range-slider-colors', defaultColors);
export const colorsPartsStore = createPersistedStore(
  'svelte-range-slider-colors-parts',
  defaultColorsParts
);
export const selectedPresetStore = persisted('svelte-range-slider-selected-preset', 'Default');

export const lightThemeColors = derived(
  colorsStore,
  (store) =>
    `--slider-light-bg: ${store['--slider-light-bg']};
  --slider-light-fg: ${store['--slider-light-fg']};
  --slider-light-base: ${store['--slider-light-base']};
  --slider-light-base-100: ${store['--slider-light-base-100']};
  --slider-light-accent: ${store['--slider-light-accent']};
  --slider-light-accent-100: ${store['--slider-light-accent-100']};
  --slider-light-accent-text: ${store['--slider-light-accent-text']};`
);

export const darkThemeColors = derived(
  colorsStore,
  (store) =>
    `--slider-dark-bg: ${store['--slider-dark-bg']};
  --slider-dark-fg: ${store['--slider-dark-fg']};
  --slider-dark-base: ${store['--slider-dark-base']};
  --slider-dark-base-100: ${store['--slider-dark-base-100']};
  --slider-dark-accent: ${store['--slider-dark-accent']};
  --slider-dark-accent-100: ${store['--slider-dark-accent-100']};
  --slider-dark-accent-text: ${store['--slider-dark-accent-text']};`
);

// export const overrideColors = derived(colorsPartsStore, store => (`
//   --range-slider: ${store["--range-slider"]};

//   --range-handle-inactive: ${store["--range-handle-inactive"]};
//   --range-handle: ${store["--range-handle"]};
//   --range-handle-focus: ${store["--range-handle-focus"]};
//   --range-handle-border: ${store["--range-handle-border"]};

//   --range-range-inactive: ${store["--range-range-inactive"]};
//   --range-range: ${store["--range-range"]};
//   --range-range-limit: ${store["--range-range-limit"]};
//   --range-range-hover: ${store["--range-range-hover"]};
//   --range-range-press: ${store["--range-range-press"]};

//   --range-float-inactive: ${store["--range-float-inactive"]};
//   --range-float: ${store["--range-float"]};
//   --range-float-text: ${store["--range-float-text"]};

//   --range-pip: ${store["--range-pip"]};
//   --range-pip-text: ${store["--range-pip-text"]};
//   --range-pip-active: ${store["--range-pip-active"]};
//   --range-pip-active-text: ${store["--range-pip-active-text"]};
//   --range-pip-hover: ${store["--range-pip-hover"]};
//   --range-pip-hover-text: ${store["--range-pip-hover-text"]};
//   --range-pip-in-range: ${store["--range-pip-in-range"]};
//   --range-pip-in-range-text: ${store["--range-pip-in-range-text"]};
//   --range-pip-out-of-limit: ${store["--range-pip-out-of-limit"]};
//   --range-pip-out-of-limit-text: ${store["--range-pip-out-of-limit-text"]};
// `));

export const overrideOutput = (colorsPartsStore: Record<string, string>) => {
  return Object.entries(colorsPartsStore)
    .filter(([key, value]) => value !== defaultColorsParts[key])
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n  ');
};

/* presets */

export const presets = {
  Default: {
    '--slider-light-bg': defaultColors['--slider-light-bg'],
    '--slider-light-fg': defaultColors['--slider-light-fg'],
    '--slider-light-base': defaultColors['--slider-light-base'],
    '--slider-light-base-100': defaultColors['--slider-light-base-100'],
    '--slider-light-accent': defaultColors['--slider-light-accent'],
    '--slider-light-accent-100': defaultColors['--slider-light-accent-100'],
    '--slider-light-accent-text': defaultColors['--slider-light-accent-text'],

    '--slider-dark-bg': defaultColors['--slider-dark-bg'],
    '--slider-dark-fg': defaultColors['--slider-dark-fg'],
    '--slider-dark-base': defaultColors['--slider-dark-base'],
    '--slider-dark-base-100': defaultColors['--slider-dark-base-100'],
    '--slider-dark-accent': defaultColors['--slider-dark-accent'],
    '--slider-dark-accent-100': defaultColors['--slider-dark-accent-100'],
    '--slider-dark-accent-text': defaultColors['--slider-dark-accent-text'],
  },
  Fuschia: {
    '--slider-light-bg': '#d8d7d9',
    '--slider-light-fg': '#4f3e43',
    '--slider-light-base': '#a099a3',
    '--slider-light-base-100': '#beb8c2',
    '--slider-light-accent': '#d43f6c',
    '--slider-light-accent-100': '#e884b3',
    '--slider-light-accent-text': '#ffffff',

    '--slider-dark-bg': '#4f3e43',
    '--slider-dark-fg': '#d8d7d9',
    '--slider-dark-base': '#9e8089',
    '--slider-dark-base-100': '#69595e',
    '--slider-dark-accent': '#eb607c',
    '--slider-dark-accent-100': '#ab7990',
    '--slider-dark-accent-text': '#ffffff',
  },
  Seafoam: {
    '--slider-light-bg': '#d8dad8',
    '--slider-light-fg': '#424d4c',
    '--slider-light-base': '#9ca19b',
    '--slider-light-base-100': '#bbc0b9',
    '--slider-light-accent': '#58bbb1',
    '--slider-light-accent-100': '#93d7c5',
    '--slider-light-accent-text': '#384444',

    '--slider-dark-bg': '#384444',
    '--slider-dark-fg': '#bbbfbb',
    '--slider-dark-base': '#6d8a8b',
    '--slider-dark-base-100': '#4e595a',
    '--slider-dark-accent': '#30B6A4',
    '--slider-dark-accent-100': '#6fa3a5',
    '--slider-dark-accent-text': '#ffffff',
  },
  Orange: {
    '--slider-light-bg': '#e0d7e0',
    '--slider-light-fg': '#674942',
    '--slider-light-base': '#b39e98',
    '--slider-light-base-100': '#cdbbb7',
    '--slider-light-accent': '#ec6149',
    '--slider-light-accent-100': '#ec8989',
    '--slider-light-accent-text': '#ffffff',

    '--slider-dark-bg': '#443d37',
    '--slider-dark-fg': '#bcb8ba',
    '--slider-dark-base': '#a69896',
    '--slider-dark-base-100': '#59534e',
    '--slider-dark-accent': '#fd7a63',
    '--slider-dark-accent-100': '#ee9687',
    '--slider-dark-accent-text': '#ffffff',
  },
  Lime: {
    '--slider-light-bg': '#c9c6c6',
    '--slider-light-fg': '#434a3a',
    '--slider-light-base': '#97908c',
    '--slider-light-base-100': '#b4aba7',
    '--slider-light-accent': '#7ac011',
    '--slider-light-accent-100': '#a9d222',
    '--slider-light-accent-text': '#434a3a',

    '--slider-dark-bg': '#404839',
    '--slider-dark-fg': '#c5c3c1',
    '--slider-dark-base': '#819170',
    '--slider-dark-base-100': '#575e50',
    '--slider-dark-accent': '#9ECF3C',
    '--slider-dark-accent-100': '#8c9f66',
    '--slider-dark-accent-text': '#434a3a',
  },
  Skyblue: {
    '--slider-light-bg': '#d6dbd9',
    '--slider-light-fg': '#3c4752',
    '--slider-light-base': '#96a79e',
    '--slider-light-base-100': '#b5c4bb',
    '--slider-light-accent': '#2672bf',
    '--slider-light-accent-100': '#4bafe2',
    '--slider-light-accent-text': '#ffffff',

    '--slider-dark-bg': '#383e47',
    '--slider-dark-fg': '#c0c4c3',
    '--slider-dark-base': '#707e91',
    '--slider-dark-base-100': '#50565e',
    '--slider-dark-accent': '#3c8fcf',
    '--slider-dark-accent-100': '#65859e',
    '--slider-dark-accent-text': '#ffffff',
  },
  Slate: {
    '--slider-light-bg': '#d9d9d9',
    '--slider-light-fg': '#3F3E4F',
    '--slider-light-base': '#9e9f9f',
    '--slider-light-base-100': '#bcbdbd',
    '--slider-light-accent': '#5a5c6c',
    '--slider-light-accent-100': '#b0b1bb',
    '--slider-light-accent-text': '#ffffff',

    '--slider-dark-bg': '#3F3E4F',
    '--slider-dark-fg': '#d8d9d9',
    '--slider-dark-base': '#9494a4',
    '--slider-dark-base-100': '#5f5f63',
    '--slider-dark-accent': '#c3c6da',
    '--slider-dark-accent-100': '#8b8c98',
    '--slider-dark-accent-text': '#000000',
  },
  Greyscale: {
    '--slider-light-bg': '#d9d9d9',
    '--slider-light-fg': '#474747',
    '--slider-light-base': '#9e9e9e',
    '--slider-light-base-100': '#bdbdbd',
    '--slider-light-accent': '#444444',
    '--slider-light-accent-100': '#b5b5b5',
    '--slider-light-accent-text': '#ffffff',

    '--slider-dark-bg': '#474747',
    '--slider-dark-fg': '#d9d9d9',
    '--slider-dark-base': '#b0b0b0',
    '--slider-dark-base-100': '#616161',
    '--slider-dark-accent': '#e3e3e3',
    '--slider-dark-accent-100': '#919191',
    '--slider-dark-accent-text': '#000000',
  },
  Black: {
    '--slider-light-bg': '#ffffff',
    '--slider-light-fg': '#000000',
    '--slider-light-base': '#333333',
    '--slider-light-base-100': '#d1d1d1',
    '--slider-light-accent': '#000000',
    '--slider-light-accent-100': '#333333',
    '--slider-light-accent-text': '#ffffff',

    '--slider-dark-bg': '#000000',
    '--slider-dark-fg': '#ffffff',
    '--slider-dark-base': '#e0e0e0',
    '--slider-dark-base-100': '#444444',
    '--slider-dark-accent': '#ffffff',
    '--slider-dark-accent-100': '#d1d1d1',
    '--slider-dark-accent-text': '#000000',
  },
};
