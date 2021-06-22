<script>

  // range slider props
  export let range = false;
  export let min = 0;
  export let max = 100;
  export let step = 1;
  export let values = [(max + min) / 2];
  export let vertical = false;

  // range pips / values props
  export let pipstep = undefined;
  export let all = true;
  export let first = undefined;
  export let last = undefined;
  export let rest = undefined;

  // formatting props
  export let prefix = "";
  export let suffix = "";
  export let formatter = v => v;

  // stylistic props
  export let focus = undefined;
  export let percentOf = undefined;

  $: pipStep = pipstep || ((max - min) / step >= ( vertical ? 50 : 100 ) ? (max - min) / ( vertical ? 10 : 20 ) : 1);

  $: pipCount = parseInt((max - min) / (step * pipStep), 10);

  $: pipVal = function(val) {
    return min + val * step * pipStep;
  };

  $: isSelected = function(val) {
    return values.some(v => v === val);
  };

  $: inRange = function(val) {
    if (range === "min") {
      return values[0] > val;
    } else if (range === "max") {
      return values[0] < val;
    } else if (range) {
      return values[0] < val && values[1] > val;
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
  :global(.rangePips) {
    position: absolute;
    height: 1em;
    left: 0;
    right: 0;
    bottom: -1em;
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
    top: 0;
    left: 0.25em;
  }
  :global(.rangePips .pip.selected) {
    height: 0.75em;
  }
  :global(.rangePips.vertical .pip.selected) {
    height: 1px;
    width: 0.75em;
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
  :global(.rangePips .pip.selected .pipVal) {
    font-weight: bold;
    top: 0.75em;
  }
  :global(.rangePips.vertical .pip.selected .pipVal) {
    top: 0;
    left: 0.75em;
  }
  :global(.rangePips .pip) {
    transition: all 0.15s ease;
  }
  :global(.rangePips .pipVal) {
    transition: all 0.15s ease;
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
  :global(.rangePips .pip.in-range) {
    color: darkslategrey;
    color: var(--pip-in-range-text);
    background-color: darkslategrey;
    background-color: var(--pip-in-range);
  }
</style>

<div class="rangePips" class:focus class:vertical>
  {#if ( all && first !== false ) || first }
    <span
      class="pip first"
      class:selected={isSelected(min)}
      class:in-range={inRange(min)}
      style="{vertical ? 'top' : 'left'}: 0%;">
      {#if all === 'label' || first === 'label'}
        <span class="pipVal">
          {prefix}{formatter(min)}{suffix}
        </span>
      {/if}
    </span>
  {/if}
  {#if ( all && rest !== false ) || rest}
    {#each Array(pipCount + 1) as _, i}
      {#if pipVal(i) !== min && pipVal(i) !== max}
        <span
          class="pip"
          class:selected={isSelected(pipVal(i))}
          class:in-range={inRange(pipVal(i))}
          style="{vertical ? 'top' : 'left'}: {percentOf(pipVal(i))}%;">
          {#if all === 'label' || rest === 'label'}
            <span class="pipVal">
              {prefix}{formatter(pipVal(i))}{suffix}
            </span>
          {/if}
        </span>
      {/if}
    {/each}
  {/if}
  {#if ( all && last !== false ) || last}
    <span
      class="pip last"
      class:selected={isSelected(max)}
      class:in-range={inRange(max)}
      style="{vertical ? 'top' : 'left'}: 100%;">
      {#if all === 'label' || last === 'label'}
        <span class="pipVal">
          {prefix}{formatter(max)}{suffix}
        </span>
      {/if}
    </span>
  {/if}
</div>
