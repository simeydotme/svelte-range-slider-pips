import { writable,derived, get } from 'svelte/store';
import createPersistedStore from './persistedStore';

import { handleTypes } from './options';
import { configStore } from './configStore';

  
export const defaultAesthetics = {
  trackSize: 0.5,
  trackRadius: 1,
  trackPadding: 0,
  rangeSize: 0.5,
  rangeRadius: 1,
  rangePadding: 0,
  handle: handleTypes[0].value,
  handleSize: 1,
  handleOffset: 0,
  handleOffsetBlock: 0,
  handleRotate: 0,
  floatOffset: 0,
  floatOffsetInline: 0,
  rangeFloatOffset: 0,
  rangeFloatOffsetInline: 0,
  floatSize: 0.9,
  floatPadding: 0.5,
  floatRadius: 0.6,
  pipsOffset: 50,
  pipHeight: 0.4,
  pipPosition: 'bottom',
  pipSelectedOffset: 0,
  pipSelectedHeight: 0.8,
  pipInRangeOffset: 0,
  pipInRangeHeight: 0.5,
  pipValSize: 1,
  pipValOffset: 100
}

export const aestheticsStore = createPersistedStore('svelte-range-slider-aesthetics', defaultAesthetics);

export const trackStyle = derived(aestheticsStore, store => `
  --track-width: ${store.trackSize}em;
  --track-radius: ${store.trackRadius};
  --track-padding: ${store.trackPadding}em;
  --range-width: ${store.rangeSize}em;
  --range-radius: ${store.rangeRadius};
  --range-padding: ${store.rangePadding}em;
`);

export const handleStyle = derived([aestheticsStore, configStore], ([store, configStore]) => `
  --handle-offset: ${!!configStore.rangeType ? 0 : store.handleOffset}em;
  --handle-offset-block: ${store.handleOffsetBlock}em;
  --handle-rotate: ${store.handleRotate}deg;
  --handle-size: ${store.handleSize}em;
`);

export const floatStyle = derived(aestheticsStore, store => `
  --float-offset: ${store.floatOffset}%;
  --float-offset-inline: ${store.floatOffsetInline}em;
  --range-float-offset: ${store.rangeFloatOffset}%;
  --range-float-offset-inline: ${store.rangeFloatOffsetInline}em;
  --float-size: ${store.floatSize}em;
  --float-padding: ${store.floatPadding}em;
  --float-radius: ${store.floatRadius};
`);

export const pipsStyle = derived(aestheticsStore, store => `
  --pips-offset: ${store.pipsOffset}%;
  --pips-height: ${store.pipHeight}em;
  --pip-selected-offset: ${store.pipSelectedOffset}%;
  --pip-selected-height: ${store.pipSelectedHeight}em;
  --pip-inrange-offset: ${store.pipInRangeOffset}%;
  --pip-inrange-height: ${store.pipInRangeHeight}em;
  --pip-val-size: ${store.pipValSize}em;
  --pip-val-offset: ${store.pipValOffset}%;
`);