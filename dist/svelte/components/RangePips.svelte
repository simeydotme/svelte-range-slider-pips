<script>import {
  coerceFloat,
  valueAsPercent,
  normalisedClient,
  isInRange,
  isSelected,
  getValueFromIndex,
  isOutOfLimit
} from "../utils.js";
export let range = false;
export let min = 0;
export let max = 100;
export let step = 1;
export let value = (max + min) / 2;
export let values = [value];
export let vertical = false;
export let reversed = false;
export let hoverable = true;
export let disabled = false;
export let limits = null;
export let pipstep = void 0;
export let all = true;
export let first = void 0;
export let last = void 0;
export let rest = void 0;
export let prefix = "";
export let suffix = "";
export let formatter = (v, i, p) => v;
export let precision = 2;
export let focus;
export let orientationStart;
export let moveHandle;
let clientStart = null;
$: stepMax = vertical ? 50 : 100;
$: tooManyPips = (max - min) / step >= stepMax;
$: stepDivisor = vertical ? 10 : 20;
$: reducedSteps = (max - min) / stepDivisor;
$: pipStep = pipstep ?? (tooManyPips ? reducedSteps : 1);
$: pipCount = Math.floor((max - min) / (step * pipStep));
function labelDown(event) {
  clientStart = normalisedClient(event);
}
function labelUp(pipValue, event) {
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
    --pip: var(--range-pip, var(--slider-base));
    --pip-text: var(--range-pip-text, var(--pip));
    --pip-active: var(--range-pip-active, var(--slider-fg));
    --pip-active-text: var(--range-pip-active-text, var(--pip-active));
    --pip-hover: var(--range-pip-hover, var(--slider-fg));
    --pip-hover-text: var(--range-pip-hover-text, var(--pip-hover));
    --pip-in-range: var(--range-pip-in-range, var(--pip-active));
    --pip-in-range-text: var(--range-pip-in-range-text, var(--pip-active-text));
    --pip-out-of-limit: var(--range-pip-out-of-limit, var(--slider-base-100));
    --pip-out-of-limit-text: var(--range-pip-out-of-limit-text, var(--pip-out-of-limit));
  }

  :global(.rangePips) {
    position: absolute;
    transform: translate3d(0, 0, 0.001px);
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
    transform: translate3d(0, 0, 0.001px);
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
    color: var(--pip-text);
    background-color: var(--pip);
  }

  :global(.rangePips .rsPip.rsSelected) {
    color: var(--pip-active-text);
    background-color: var(--pip-active);
  }

  :global(.rangePips.rsHoverable:not(.rsDisabled) .rsPip:not(.rsOutOfLimit):hover) {
    color: var(--pip-hover-text);
    background-color: var(--pip-hover);
  }

  :global(.rangePips .rsPip.rsInRange) {
    color: var(--pip-in-range-text);
    background-color: var(--pip-in-range);
  }

  :global(.rangePips .rsPip.rsOutOfLimit) {
    color: var(--pip-out-of-limit-text);
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
