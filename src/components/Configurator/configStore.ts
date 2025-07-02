import { writable,derived, get } from 'svelte/store';
import { persisted } from 'svelte-persisted-store';
import createPersistedStore from './persistedStore';

import { rangeTypes, orientationTypes, easingTypes, darkmodeTypes, handleTypes } from './options';

// Default configuration values
export const defaultConfig: Record<string, any> = {
  range: rangeTypes[0].value,
  vertical: false,
  reversed: false,
  min: 0,
  max: 100,
  step: 1,
  pipstep: undefined,
  pips: false,
  first: false,
  rest: false,
  last: false,
  prefix: '',
  suffix: '',
  float: false,
  rangeFloat: false,
  spring: true,
  springValues: easingTypes[0].name,
  pushy: false,
  draggy: false,
  rangeGapMin: null,
  rangeGapMax: null,
  limitMin: null,
  limitMax: null,
  precision: 2,
  darkmode: darkmodeTypes[0].value
};

// Export config store
export const configStore = createPersistedStore('svelte-range-slider-config', defaultConfig);



// Default settings values
const defaultSettings = {
  bgColor: '#f0f1f5',
  bgColorDark: '#292f3d'
};

// Create persisted store for settings
const createSettingsStore = () => {
  const internalStore = persisted('svelte-range-slider-settings', {...defaultSettings});
  let resetSettingsConfirm = writable(false);
  let resetTimeout: NodeJS.Timeout;
  const resetSettings = () => {
    clearTimeout(resetTimeout);
    if ( get(resetSettingsConfirm) ) {
      internalStore.set({...defaultSettings});
      resetSettingsConfirm.set(false);
    } else {
      resetSettingsConfirm.set(true);
      resetTimeout = setTimeout(() => {
        resetSettingsConfirm.set(false);
      }, 3000);
    }
  }
  return {
    subscribe: internalStore.subscribe,
    set: internalStore.set,
    update: internalStore.update,
    reset: resetSettings,
    isConfirmingReset: resetSettingsConfirm.subscribe
  }
}

// Export settings store
export const settingsStore = createSettingsStore();

// the light/dark mode of the page
export const themeStore = localStorage.getItem('theme');

export const absoluteMin = derived(configStore, store => Math.max(store.min, store.limitMin ?? store.min));
export const absoluteMax = derived(configStore, store => Math.min(store.max, store.limitMax ?? store.max));

export const filterConfigProps = (configProps: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(configProps).filter(([key, value]) => {
      switch (key) {
        case 'rangeGapMin':
          return value !== 0;
        case 'rangeGapMax':
          return value !== Infinity;
        case 'limits': 
          return value !== null;
        case 'springValues':
          return value.stiffness !== easingTypes[0].config.stiffness || value.damping !== easingTypes[0].config.damping;
        default:
          return value !== defaultConfig[key];
      }
    })
  );
};

export const jsonifyProps = (filteredProps: Record<string, any>, indent = '') => {
  return JSON.stringify(filteredProps, null, 2)
    .replaceAll(',', ', ')
    .replaceAll('{', '{ ')
    .replaceAll('}', ' }')
    .replaceAll(':', ': ')
    .replaceAll(/"(.*?)": /g, `${indent}$1: `);
};1

export const htmlifyProps = (filteredProps: Record<string, any>, indent = '') => {
  return Object.entries(filteredProps)
    .map(([key, value]) => {
      if (typeof value === 'boolean') {
        return value ? key : `${key}={false}`;
      }
      if (typeof value === 'string') {
        return `${key}="${value}"`;
      }
      if (typeof value === 'number') {
        return `${key}={${value}}`;
      }
      if (typeof value === 'object' && value !== null) {
        return `${key}={${JSON.stringify(value)}}`;
      }
      return `${key}={${value}}`;
    })
    .join(`\n${indent}`);
};

export const outputObject = (configProps: Record<string, any>, indent = '') => {
  const filtered = filterConfigProps(configProps);
  return jsonifyProps(filtered, indent);
};

export const outputProps = (configProps: Record<string, any>, type: 'json' | 'html' = 'html', indent = '') => {
  const filtered = filterConfigProps(configProps);
  return type === 'json' ? jsonifyProps(filtered, indent) : htmlifyProps(filtered, indent);
};