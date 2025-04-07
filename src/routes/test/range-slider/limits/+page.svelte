<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';

  let hasRange = false;
  let hasLimits = false;
  let minLimit = 10;
  let maxLimit = 70;
  let pushy = false;
  let rangeGapMin = 0;
  let rangeGapMax = 100;

  // Function to toggle limits
  function toggleLimits() {
    hasLimits = !hasLimits;
  }

  // Function to toggle range
  function toggleRange() {
    hasRange = !hasRange;
  }

  // Function to toggle pushy behavior
  function togglePushy() {
    pushy = !pushy;
  }

  // Function to update limits
  function updateLimits() {
    if (minLimit >= maxLimit) {
      // Swap values if min is greater than max
      [minLimit, maxLimit] = [maxLimit, minLimit];
    }
  }
</script>

<div class="slider-list">
  <h5>Single handle with limits</h5>
  <RangeSlider id="single-limits" limits={[10, 70]} pips float first="label" last="label" />

  <h5>Reversed horizontal slider with limits</h5>
  <RangeSlider id="reversed-limits" reversed={true} limits={[10, 70]} pips float first="label" last="label" />

  <h5>Range slider with limits</h5>
  <RangeSlider id="range-limits" range={true} values={[30, 50]} limits={[10, 70]} />

  <h5>Range slider with limits and pushy</h5>
  <RangeSlider id="range-limits-pushy" range={true} values={[30, 50]} limits={[10, 70]} pushy={true} />

  <h5>Range slider with limits and rangeGap</h5>
  <RangeSlider 
    id="range-limits-gap" 
    range={true} 
    values={[20, 30]} 
    limits={[10, 70]} 
    rangeGapMin={10}
    rangeGapMax={30}
  />

  <h5>Vertical slider with limits</h5>
  <RangeSlider id="vertical-limits" vertical={true} limits={[10, 70]} pips float first="label" last="label" />

  <h5>Reversed vertical slider with limits</h5>
  <RangeSlider id="reversed-vertical-limits" vertical={true} reversed={true} limits={[10, 70]} pips float first="label" last="label" />

  <h5>Dynamic controls</h5>
  <div class="controls !items-end">
    <div>
      <label for="min-limit">Min Limit:</label>
      <input id="min-limit" type="number" bind:value={minLimit} min="0" max="100" on:change={updateLimits} />
    </div>
    <div>
      <label for="max-limit">Max Limit:</label>
      <input id="max-limit" type="number" bind:value={maxLimit} min="0" max="100" on:change={updateLimits} />
    </div>
    <div>
      <label for="range-gap-min">Range Gap Min:</label>
      <input id="range-gap-min" type="number" bind:value={rangeGapMin} min="0" max="100" />
    </div>
    <div>
      <label for="range-gap-max">Range Gap Max:</label>
      <input id="range-gap-max" type="number" bind:value={rangeGapMax} min="0" max="100" />
    </div>
    <button id="toggle-range" on:click={toggleRange}>
      {hasRange ? 'Remove Range' : 'Add Range'}
    </button>
    <button id="toggle-limits" on:click={toggleLimits}>
      {hasLimits ? 'Remove Limits' : 'Add Limits'}
    </button>
    <button id="toggle-pushy" on:click={togglePushy}>
      {pushy ? 'Disable Pushy' : 'Enable Pushy'}
    </button>
  </div>
  <RangeSlider
    id="dynamic-controls"
    range={hasRange}
    limits={hasLimits ? [minLimit, maxLimit] : null}
    values={hasRange ? [30, 50] : [40]}
    pushy={pushy}
    rangeGapMin={rangeGapMin}
    rangeGapMax={rangeGapMax}
  />
</div>

<style>
</style>
