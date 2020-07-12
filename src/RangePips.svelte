<script>
  export let values;
  export let min;
  export let max;
  export let step;
  export let range;
  export let first = true;
  export let last = true;
  export let rest = true;
  export let pipstep = (max - min) / step >= 100 ? (max - min) / 20 : 1;

  export let prefix = "";
  export let suffix = "";
  export let formatter = v => v;

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

<div class="rangeSlider__pips" class:focus>
  {#if first}
    <span 
      class="rangeSlider__pip is-first"
      class:selected="{isSelected(min)}"
      class:in-range="{inRange(min)}"
      style="left: 0%;">
      {#if first === "label"}
        <span class="rangeSlider__pipval">
          {prefix}{ formatter(min) }{suffix}
        </span>
      {/if}
    </span>
  {/if}
  {#if rest}
    {#each Array(pipCount+1) as _, i}
      {#if pipVal(i) !== min && pipVal(i) !== max}
      <span 
        class="rangeSlider__pip"
        class:selected="{isSelected(pipVal(i))}"
        class:in-range="{inRange(pipVal(i))}"
        style="left: {percentOf(pipVal(i))}%;">
        {#if rest === "label"}
          <span class="rangeSlider__pipval">
            {prefix}{ formatter(pipVal(i)) }{suffix}
          </span>
        {/if}
      </span>
      {/if}
    {/each}
  {/if}
  {#if last}
    <span 
      class="rangeSlider__pip is-last"
      class:selected="{isSelected(max)}"
      class:in-range="{inRange(max)}"
      style="left: 100%;">
      {#if last === "label"}
        <span class="rangeSlider__pipval">
          {prefix}{ formatter(max) }{suffix}
        </span>
      {/if}
    </span>
  {/if}
</div>

<style>
  .rangeSlider__pips {
    height: 1em;
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1em;
  }
  .rangeSlider__pip {
    height: 0.4em;
    position: absolute;
    top: 0.25em;
    width: 1px;
    white-space: nowrap;
  }
  .rangeSlider__pip.selected {
    height: 0.75em;
  }
  .rangeSlider__pipval {
    position: absolute;
    top: 0.4em;
    transform: translate(-50%, 25%);
  }
  .rangeSlider__pip.selected .rangeSlider__pipval {
    font-weight: bold;
    top: 0.75em;
  }
  .rangeSlider__pip,
  .rangeSlider__pipval {
    transition: all 0.15s ease;
  }
  .rangeSlider__pip {
    background: lightslategray;
    color: lightslategray;
  }
  .rangeSlider__pip.selected,
  .rangeSlider__pip.in-range {
    background: darkslategrey;
    color: darkslategrey;
  }
</style>