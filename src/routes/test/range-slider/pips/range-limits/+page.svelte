<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';

  let hasLimits = false;
  let hasRange = false;
  let minLimit = 20;
  let maxLimit = 80;

  // Function to toggle limits
  function toggleLimits() {
    hasLimits = !hasLimits;
  }

  // Function to toggle range
  function toggleRange() {
    hasRange = !hasRange;
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
  <h5>Default range (single handle)</h5>
  <RangeSlider pips all="label" />

  <h5>Range mode (min)</h5>
  <RangeSlider pips all="label" range="min" />

  <h5>Range mode (max)</h5>
  <RangeSlider pips all="label" range="max" />

  <h5>Range mode (true)</h5>
  <RangeSlider pips all="label" range={true} values={[40, 60]} />

  <h5>With limits [20, 80]</h5>
  <RangeSlider pips all="label" limits={[20, 80]} />

  <h5>Range mode (min) with limits [20, 80]</h5>
  <RangeSlider pips all="label" range="min" limits={[20, 80]} />

  <h5>Range mode (max) with limits [20, 80]</h5>
  <RangeSlider pips all="label" range="max" limits={[20, 80]} />

  <h5>Range mode (true) with limits [20, 80]</h5>
  <RangeSlider pips all="label" range={true} limits={[20, 80]} values={[40, 60]} />

  <h5>Dynamic range and limits control</h5>
  <div class="flex gap-4 items-center">
    <div class="flex items-center flex-row gap-2">
      <label for="min-limit" class="whitespace-nowrap">Min Limit:</label>
      <input
        type="number"
        id="min-limit"
        bind:value={minLimit}
        min="0"
        max="100"
        on:change={updateLimits}
      />
    </div>
    <div class="flex items-center flex-row gap-2">
      <label for="max-limit" class="whitespace-nowrap">Max Limit:</label>
      <input
        type="number"
        id="max-limit"
        bind:value={maxLimit}
        min="0"
        max="100"
        on:change={updateLimits}
      />
    </div>
    <button id="toggle-limits" class:btn-primary={hasLimits} on:click={toggleLimits}>
      {hasLimits ? 'Remove Limits' : 'Add Limits'}
    </button>
    <button id="toggle-range" class:btn-primary={hasRange} on:click={toggleRange}>
      {hasRange ? 'Remove Range' : 'Add Range'}
    </button>
  </div>
  <RangeSlider 
    pips 
    all="label" 
    limits={hasLimits ? [minLimit, maxLimit] : null} 
    range={hasRange ? true : false}
    values={hasRange ? [40, 60] : [50]}
  />
</div>

<style>
</style> 