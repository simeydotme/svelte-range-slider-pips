<script lang="ts">
  import {
    coerceFloat,
    valueAsPercent,
    normalisedClient,
    isInRange,
    isSelected,
    getValueFromIndex,
    isOutOfLimit
  } from '$lib/utils.js';
  import type { Pip, Formatter, NormalisedClient } from '$lib/types.js';

  // range slider props
  export let range: boolean | 'min' | 'max' = false;
  export let min: number = 0;
  export let max: number = 100;
  export let step: number = 1;
  export let value: number = (max + min) / 2;
  export let values: number[] = [value];
  export let vertical: boolean = false;
  export let reversed: boolean = false;
  export let hoverable: boolean = true;
  export let disabled: boolean = false;
  export let limits: null | [number, number] = null;

  // range pips / values props
  export let pipstep: number | undefined = undefined;
  export let all: Pip = true;
  export let first: Pip = undefined;
  export let last: Pip = undefined;
  export let rest: Pip = undefined;

  // formatting props
  export let prefix: string = '';
  export let suffix: string = '';
  export let formatter: Formatter = (v, i, p) => v;
  export let precision: number = 2;

  // stylistic props
  export let focus: boolean;
  export let orientationStart: 'left' | 'right' | 'top' | 'bottom';

  // methods
  export let moveHandle: (index: number | null, value: number) => void;

  let clientStart: null | NormalisedClient = null;

  $: stepMax = vertical ? 50 : 100;
  $: tooManyPips = (max - min) / step >= stepMax;
  $: stepDivisor = vertical ? 10 : 20;
  $: reducedSteps = (max - min) / stepDivisor;
  $: pipStep = pipstep ?? (tooManyPips ? reducedSteps : 1);
  $: pipCount = Math.floor((max - min) / (step * pipStep));

  /**
   * function to run when the user clicks on a label
   * we store the original client position so we can check if the user has moved the mouse/finger
   * @param {event} event the event from browser
   **/
  function labelDown(event: PointerEvent) {
    clientStart = normalisedClient(event);
  }

  /**
   * function to run when the user releases the mouse/finger
   * we check if the user has moved the mouse/finger, if not we "click" the label
   * and move the handle it to the label position
   * @param {number} pipValue the value of the label
   * @param {event} e the event from browser
   */
  function labelUp(pipValue: number, event: PointerEvent) {
    const clientEnd = normalisedClient(event);
    if (!disabled && clientStart) {
      const distanceMoved = Math.sqrt(
        Math.pow(clientStart.x - clientEnd.x, 2) + Math.pow(clientStart.y - clientEnd.y, 2)
      );
      if (distanceMoved <= 5) {
        moveHandle(null, pipValue);
      }
      clientStart = null;
    }
  }
</script>

<div
  class="rangePips"
  class:rsDisabled={disabled}
  class:rsHoverable={hoverable}
  class:rsVertical={vertical}
  class:rsReversed={reversed}
  class:rsFocus={focus}
>
  {#if (all && first !== false) || first}
    <span
      class="rsPip rsPip--first"
      class:rsSelected={isSelected(min, values, precision)}
      class:rsInRange={isInRange(min, values, range)}
      class:rsOutOfLimit={isOutOfLimit(min, limits)}
      style="{orientationStart}: 0%;"
      data-val={coerceFloat(min, precision)}
      on:pointerdown={(e) => {
        labelDown(e);
      }}
      on:pointerup={(e) => {
        labelUp(min, e);
      }}
    >
      {#if all === 'label' || first === 'label'}
        <span class="rsPipVal">
          {#if prefix}<span class="rsPipValPrefix">{prefix}</span>{/if}
          {@html formatter(coerceFloat(min, precision), 0, 0)}
          {#if suffix}<span class="rsPipValSuffix">{suffix}</span>{/if}
        </span>
      {/if}
    </span>
  {/if}

  {#if (all && rest !== false) || rest}
    {#each Array(pipCount + 1) as _, i}
      {@const val = getValueFromIndex(i, min, max, pipStep, step, precision)}
      {#if val !== min && val !== max}
        <span
          class="rsPip"
          class:rsSelected={isSelected(val, values, precision)}
          class:rsInRange={isInRange(val, values, range)}
          class:rsOutOfLimit={isOutOfLimit(val, limits)}
          style="{orientationStart}: {valueAsPercent(val, min, max, precision)}%;"
          data-val={val}
          on:pointerdown={(e) => {
            labelDown(e);
          }}
          on:pointerup={(e) => {
            labelUp(val, e);
          }}
        >
          {#if all === 'label' || rest === 'label'}
            <span class="rsPipVal">
              {#if true || prefix}<span class="rsPipValPrefix">{prefix}</span>{/if}
              {@html formatter(val, i, valueAsPercent(val, min, max, precision))}
              {#if true || suffix}<span class="rsPipValSuffix">{suffix}</span>{/if}
            </span>
          {/if}
        </span>
      {/if}
    {/each}
  {/if}

  {#if (all && last !== false) || last}
    <span
      class="rsPip rsPip--last"
      class:rsSelected={isSelected(max, values, precision)}
      class:rsInRange={isInRange(max, values, range)}
      class:rsOutOfLimit={isOutOfLimit(max, limits)}
      style="{orientationStart}: 100%;"
      data-val={coerceFloat(max, precision)}
      on:pointerdown={(e) => {
        labelDown(e);
      }}
      on:pointerup={(e) => {
        labelUp(max, e);
      }}
    >
      {#if all === 'label' || last === 'label'}
        <span class="rsPipVal">
          {#if prefix}<span class="rsPipValPrefix">{prefix}</span>{/if}
          {@html formatter(coerceFloat(max, precision), pipCount, 100)}
          {#if suffix}<span class="rsPipValSuffix">{suffix}</span>{/if}
        </span>
      {/if}
    </span>
  {/if}
</div>

<style>
  /**
   * RangePips
   */

  :global(.rangePips) {
    --pip: var(--range-pip, lightslategray);
    --pip-text: var(--range-pip-text, var(--pip));
    --pip-active: var(--range-pip-active, darkslategrey);
    --pip-active-text: var(--range-pip-active-text, var(--pip-active));
    --pip-hover: var(--range-pip-hover, darkslategrey);
    --pip-hover-text: var(--range-pip-hover-text, var(--pip-hover));
    --pip-in-range: var(--range-pip-in-range, var(--pip-active));
    --pip-in-range-text: var(--range-pip-in-range-text, var(--pip-active-text));
    --pip-out-of-limit: var(--range-pip-out-of-limit, #aebecf);
    --pip-out-of-limit-text: var(--range-pip-out-of-limit-text, var(--pip-out-of-limit));
  }

  :global(.rangePips) {
    position: absolute;
    height: 1em;
    left: 0;
    right: 0;
    bottom: -1em;
    font-variant-numeric: tabular-nums;
  }

  :global(.rangePips.rsVertical) {
    height: auto;
    width: 1em;
    left: 100%;
    right: auto;
    top: 0;
    bottom: 0;
  }

  :global(.rangePips .rsPip) {
    height: 0.4em;
    position: absolute;
    top: 0.25em;
    width: 1px;
    white-space: nowrap;
  }

  :global(.rangePips.rsVertical .rsPip) {
    height: 1px;
    width: 0.4em;
    left: 0.25em;
    top: auto;
    bottom: auto;
  }

  :global(.rangePips .rsPipVal) {
    position: absolute;
    top: 0.4em;
    transform: translate(-50%, 25%);
    display: inline-flex;
  }

  :global(.rangePips.rsVertical .rsPipVal) {
    position: absolute;
    top: 0;
    left: 0.4em;
    transform: translate(25%, -50%);
  }

  :global(.rangePips .rsPip) {
    transition: all 0.15s ease;
  }

  :global(.rangePips .rsPipVal) {
    transition:
      all 0.15s ease,
      font-weight 0s linear;
  }

  :global(.rangePips .rsPip) {
    color: lightslategray;
    color: var(--pip-text);
    background-color: lightslategray;
    background-color: var(--pip);
  }

  :global(.rangePips .rsPip.rsSelected) {
    color: darkslategrey;
    color: var(--pip-active-text);
    background-color: darkslategrey;
    background-color: var(--pip-active);
  }

  :global(.rangePips.rsHoverable:not(.rsDisabled) .rsPip:not(.rsOutOfLimit):hover) {
    color: darkslategrey;
    color: var(--pip-hover-text);
    background-color: darkslategrey;
    background-color: var(--pip-hover);
  }

  :global(.rangePips .rsPip.rsInRange) {
    color: darkslategrey;
    color: var(--pip-in-range-text);
    background-color: darkslategrey;
    background-color: var(--pip-in-range);
  }

  :global(.rangePips .rsPip.rsOutOfLimit) {
    color: #aebecf;
    color: var(--pip-out-of-limit-text);
    background-color: #aebecf;
    background-color: var(--pip-out-of-limit);
  }

  :global(.rangePips .rsPip.rsSelected) {
    height: 0.75em;
  }

  :global(.rangePips.rsVertical .rsPip.rsSelected) {
    height: 1px;
    width: 0.75em;
  }

  :global(.rangePips .rsPip.rsSelected .rsPipVal) {
    font-weight: bold;
    top: 0.75em;
  }

  :global(.rangePips.rsVertical .rsPip.rsSelected .rsPipVal) {
    top: 0;
    left: 0.75em;
  }

  :global(.rangePips.rsHoverable:not(.rsDisabled) .rsPip:not(.rsSelected):not(.rsOutOfLimit):hover) {
    transition: none;
  }

  :global(.rangePips.rsHoverable:not(.rsDisabled) .rsPip:not(.rsSelected):not(.rsOutOfLimit):hover .rsPipVal) {
    transition: none;
    font-weight: bold;
  }
</style>
