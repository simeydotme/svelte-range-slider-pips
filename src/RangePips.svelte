<script>

  // range slider props
  export let range = false;
  export let min = 0;
  export let max = 100;
  export let step = 1;
  export let values = [(max + min) / 2];
  export let vertical = false;

  // range pips / values props
  export let pipstep = ((max - min) / step >= ( vertical ? 50 : 100 ) ? (max - min) / ( vertical ? 10 : 20 ) : 1);
  export let first = true;
  export let last = true;
  export let rest = true;

  // formatting props
  export let prefix = "";
  export let suffix = "";
  export let formatter = v => v;

  // stylistic props
  export let focus;
  export let percentOf;

  $: pipCount = parseInt((max - min) / (step * pipstep), 10);

  $: pipVal = function(i) {
    return min + i * step * pipstep;
  };

  $: isSelected = function(i) {
    return values.some(v => v === i);
  };

  $: inRange = function(i) {
    if (range === "min") {
      return values[0] < i;
    } else if (range === "max") {
      return values[0] > i;
    } else if (range) {
      return values[0] < i && values[1] > i;
    }
  };
</script>

<style>
  :global(.rangeSlider) {
    --pip: var(--range-pip, lightslategray);
    --pip-text: var(--range-pip-text, var(--pip));
    --pip-active: var(--range-pip-active, darkslategrey);
    --pip-active-text: var(--range-pip-active-text, var(--pip-active));
    --pip-in-range: var(--range-pip-in-range, var(--pip-active));
    --pip-in-range-text: var(--range-pip-in-range-text, var(--pip-active-text));
  }
  :global(.rangeSlider__pips) {
    height: 1em;
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1em;
  }
  :global(.rangeSlider__pips.vertical) {
    height: auto;
    width: 1em;
    position: absolute;
    left: 100%;
    right: auto;
    top: 0;
    bottom: 0;
  }
  :global(.rangeSlider__pips .pip) {
    height: 0.4em;
    position: absolute;
    top: 0.25em;
    width: 1px;
    white-space: nowrap;
  }
  :global(.rangeSlider__pips.vertical .pip) {
    height: 1px;
    width: 0.4em;
    top: 0;
    left: 0.25em;
  }
  :global(.rangeSlider__pips .pip.selected) {
    height: 0.75em;
  }
  :global(.rangeSlider__pips.vertical .pip.selected) {
    height: 1px;
    width: 0.75em;
  }
  :global(.rangeSlider__pips .pipVal) {
    position: absolute;
    top: 0.4em;
    transform: translate(-50%, 25%);
  }
  :global(.rangeSlider__pips.vertical .pipVal) {
    position: absolute;
    top: 0;
    left: 0.4em;
    transform: translate(25%, -50%);
  }
  :global(.rangeSlider__pips .pip.selected .pipVal) {
    font-weight: bold;
    top: 0.75em;
  }
  :global(.rangeSlider__pips.vertical .pip.selected .pipVal) {
    top: 0;
    left: 0.75em;
  }
  :global(.rangeSlider__pips .pip, .rangeSlider__pips .pipVal) {
    transition: all 0.15s ease;
  }
  :global(.rangeSlider__pips .pip) {
    color: lightslategray;
    color: var(--pip-text);
    background-color: lightslategray;
    background-color: var(--pip);
  }
  :global(.rangeSlider__pips .pip.selected) {
    color: darkslategrey;
    color: var(--pip-active-text);
    background-color: darkslategrey;
    background-color: var(--pip-active);
  }
  :global(.rangeSlider__pips .pip.in-range) {
    color: darkslategrey;
    color: var(--pip-in-range-text);
    background-color: darkslategrey;
    background-color: var(--pip-in-range);
  }
</style>

<div class="rangeSlider__pips" class:focus class:vertical>
  {#if first}
    <span
      class="pip first"
      class:selected={isSelected(min)}
      class:in-range={inRange(min)}
      style="{vertical ? 'top' : 'left'}: 0%;">
      {#if first === 'label'}
        <span class="pipVal">
          {prefix}{formatter(min)}{suffix}
        </span>
      {/if}
    </span>
  {/if}
  {#if rest}
    {#each Array(pipCount + 1) as _, i}
      {#if pipVal(i) !== min && pipVal(i) !== max}
        <span
          class="pip"
          class:selected={isSelected(pipVal(i))}
          class:in-range={inRange(pipVal(i))}
          style="{vertical ? 'top' : 'left'}: {percentOf(pipVal(i))}%;">
          {#if rest === 'label'}
            <span class="pipVal">
              {prefix}{formatter(pipVal(i))}{suffix}
            </span>
          {/if}
        </span>
      {/if}
    {/each}
  {/if}
  {#if last}
    <span
      class="pip last"
      class:selected={isSelected(max)}
      class:in-range={inRange(max)}
      style="{vertical ? 'top' : 'left'}: 100%;">
      {#if last === 'label'}
        <span class="pipVal">
          {prefix}{formatter(max)}{suffix}
        </span>
      {/if}
    </span>
  {/if}
</div>
