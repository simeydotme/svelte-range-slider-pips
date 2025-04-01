<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';

  let hasRange = false;
  let hasLimits = false;
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
  <h5>Default range mode</h5>
  <RangeSlider id="default-range" pips all="label" />

  <h5>Range="min"</h5>
  <RangeSlider id="range-min" pips all="label" range="min" />

  <h5>Range="max"</h5>
  <RangeSlider id="range-max" pips all="label" range="max" />

  <h5>Range={true}</h5>
  <RangeSlider id="range-true" pips all="label" range={true} values={[40, 60]} />

  <h5>Limits</h5>
  <RangeSlider id="limits" pips all="label" limits={[20, 80]} />

  <h5>Range="min" with limits</h5>
  <RangeSlider id="range-min-limits" pips all="label" range="min" limits={[20, 80]} />

  <h5>Range="max" with limits</h5>
  <RangeSlider id="range-max-limits" pips all="label" range="max" limits={[20, 80]} />

  <h5>Range={true} with limits</h5>
  <RangeSlider id="range-true-limits" pips all="label" range={true} values={[40, 60]} limits={[20, 80]} />

  <h5>Dynamic range and limits controls</h5>
  <div class="controls">
    <button id="toggle-range" on:click={toggleRange}>
      {hasRange ? 'Remove Range' : 'Add Range'}
    </button>
    <button id="toggle-limits" on:click={toggleLimits}>
      {hasLimits ? 'Remove Limits' : 'Add Limits'}
    </button>
    <div class="limit-inputs">
      <label for="min-limit">Min Limit:</label>
      <input id="min-limit" type="number" bind:value={minLimit} min="0" max="100" on:change={updateLimits} />
      <label for="max-limit">Max Limit:</label>
      <input id="max-limit" type="number" bind:value={maxLimit} min="0" max="100" on:change={updateLimits} />
    </div>
  </div>
  <RangeSlider
    id="dynamic-controls"
    pips
    all="label"
    range={hasRange}
    limits={hasLimits ? [minLimit, maxLimit] : null}
    values={hasRange ? [40, 60] : [50]}
  />
</div>
