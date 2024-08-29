<script lang="ts">
  import {
    coerceFloat,
    valueAsPercent,
    normalisedClient,
    isInRange,
    isSelected,
    getValueFromIndex
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
  export let orientationStart: string;

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

<div class="rangePips" class:disabled class:hoverable class:vertical class:reversed class:focus>
  {#if (all && first !== false) || first}
    <span
      class="pip first"
      class:selected={isSelected(min, values, precision)}
      class:in-range={isInRange(min, values, range)}
      style="{orientationStart}: 0%;"
      on:pointerdown={(e) => {
        labelDown(e);
      }}
      on:pointerup={(e) => {
        labelUp(min, e);
      }}
    >
      {#if all === 'label' || first === 'label'}
        <span class="pipVal">
          {#if prefix}<span class="pipVal-prefix">{prefix}</span>{/if}{@html formatter(
            coerceFloat(min),
            0,
            0
          )}{#if suffix}<span class="pipVal-suffix">{suffix}</span>{/if}
        </span>
      {/if}
    </span>
  {/if}

  {#if (all && rest !== false) || rest}
    {#each Array(pipCount + 1) as _, i}
      {#if getValueFromIndex(i, min, max, pipStep, step) !== min && getValueFromIndex(i, min, max, pipStep, step) !== max}
        <span
          class="pip"
          class:selected={isSelected(
            getValueFromIndex(i, min, max, pipStep, step),
            values,
            precision
          )}
          class:in-range={isInRange(getValueFromIndex(i, min, max, pipStep, step), values, range)}
          style="{orientationStart}: {valueAsPercent(
            getValueFromIndex(i, min, max, pipStep, step),
            min,
            max
          )}%;"
          on:pointerdown={(e) => {
            labelDown(e);
          }}
          on:pointerup={(e) => {
            labelUp(getValueFromIndex(i, min, max, pipStep, step), e);
          }}
        >
          {#if all === 'label' || rest === 'label'}
            <span class="pipVal">
              {#if prefix}<span class="pipVal-prefix">{prefix}</span>{/if}{@html formatter(
                getValueFromIndex(i, min, max, pipStep, step),
                i,
                valueAsPercent(getValueFromIndex(i, min, max, pipStep, step), min, max, precision)
              )}{#if suffix}<span class="pipVal-suffix">{suffix}</span>{/if}
            </span>
          {/if}
        </span>
      {/if}
    {/each}
  {/if}

  {#if (all && last !== false) || last}
    <span
      class="pip last"
      class:selected={isSelected(max, values, precision)}
      class:in-range={isInRange(max, values, range)}
      style="{orientationStart}: 100%;"
      on:pointerdown={(e) => {
        labelDown(e);
      }}
      on:pointerup={(e) => {
        labelUp(max, e);
      }}
    >
      {#if all === 'label' || last === 'label'}
        <span class="pipVal">
          {#if prefix}<span class="pipVal-prefix">{prefix}</span>{/if}{@html formatter(
            coerceFloat(max),
            pipCount,
            100
          )}{#if suffix}<span class="pipVal-suffix">{suffix}</span>{/if}
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
  }

  :global(.rangePips) {
    position: absolute;
    height: 1em;
    left: 0;
    right: 0;
    bottom: -1em;
    font-variant-numeric: tabular-nums;
  }

  :global(.rangePips.vertical) {
    height: auto;
    width: 1em;
    left: 100%;
    right: auto;
    top: 0;
    bottom: 0;
  }

  :global(.rangePips .pip) {
    height: 0.4em;
    position: absolute;
    top: 0.25em;
    width: 1px;
    white-space: nowrap;
  }

  :global(.rangePips.vertical .pip) {
    height: 1px;
    width: 0.4em;
    left: 0.25em;
    top: auto;
    bottom: auto;
  }

  :global(.rangePips .pipVal) {
    position: absolute;
    top: 0.4em;
    transform: translate(-50%, 25%);
  }

  :global(.rangePips.vertical .pipVal) {
    position: absolute;
    top: 0;
    left: 0.4em;
    transform: translate(25%, -50%);
  }

  :global(.rangePips .pip) {
    transition: all 0.15s ease;
  }

  :global(.rangePips .pipVal) {
    transition:
      all 0.15s ease,
      font-weight 0s linear;
  }

  :global(.rangePips .pip) {
    color: lightslategray;
    color: var(--pip-text);
    background-color: lightslategray;
    background-color: var(--pip);
  }

  :global(.rangePips .pip.selected) {
    color: darkslategrey;
    color: var(--pip-active-text);
    background-color: darkslategrey;
    background-color: var(--pip-active);
  }

  :global(.rangePips.hoverable:not(.disabled) .pip:hover) {
    color: darkslategrey;
    color: var(--pip-hover-text);
    background-color: darkslategrey;
    background-color: var(--pip-hover);
  }

  :global(.rangePips .pip.in-range) {
    color: darkslategrey;
    color: var(--pip-in-range-text);
    background-color: darkslategrey;
    background-color: var(--pip-in-range);
  }

  :global(.rangePips .pip.selected) {
    height: 0.75em;
  }

  :global(.rangePips.vertical .pip.selected) {
    height: 1px;
    width: 0.75em;
  }

  :global(.rangePips .pip.selected .pipVal) {
    font-weight: bold;
    top: 0.75em;
  }

  :global(.rangePips.vertical .pip.selected .pipVal) {
    top: 0;
    left: 0.75em;
  }

  :global(.rangePips.hoverable:not(.disabled) .pip:not(.selected):hover) {
    transition: none;
  }

  :global(.rangePips.hoverable:not(.disabled) .pip:not(.selected):hover .pipVal) {
    transition: none;
    font-weight: bold;
  }
</style>
