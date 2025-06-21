<script lang="ts">
  import RangeSlider from '$components/RangeSlider.svelte';

  // State for the toggle tests
  let isRange = false;
  let toggleValues = [15, 45, 75];

  let isRangeMin = false;
  let toggleMinValues = [30, 60, 80];

  let isRangeMax = false;
  let toggleMaxValues = [20, 50, 70];
</script>

<div class="slider-list">
  <h5>Single handle range sliders <em>(should not be a range due to only one value)</em></h5>
  <RangeSlider id="single-handle-true" range values={[40]} />
  <RangeSlider id="single-handle-true-value" range value={40} />

  <h5>Double handle range sliders</h5>
  <RangeSlider id="double-handle-true" range values={[25, 75]} />
  <RangeSlider id="double-handle-true-negative" range values={[-75, 25]} min={-100} max={100} />
  <RangeSlider id="double-handle-true-constrained" range values={[-130, 125]} min={-100} max={100} />

  <h5>Triple handle range sliders <em>(should trim to double handle)</em></h5>
  <RangeSlider id="triple-handle-true" range values={[15, 45, 75]} />
  <RangeSlider id="triple-handle-true-negative" range values={[-75, 55, 15]} min={-50} />

  <hr />

  <h5>Toggle range mode test</h5>
  <RangeSlider id="toggle-range-test" range={isRange} bind:values={toggleValues} />
  <div class="controls">
    <button id="btn_toggle_range" on:click={() => (isRange = !isRange)}>
      Toggle Range Mode ({isRange ? 'true' : 'false'})
    </button>
    <p>Current values: {toggleValues}</p>
  </div>

  <h5>Toggle range="min" mode test</h5>
  <RangeSlider id="toggle-range-min-test" range={isRangeMin ? 'min' : false} bind:values={toggleMinValues} />
  <div class="controls">
    <button id="btn_toggle_range_min" on:click={() => (isRangeMin = !isRangeMin)}>
      Toggle Range Min Mode ({isRangeMin ? 'true' : 'false'})
    </button>
    <p>Current values: {toggleMinValues}</p>
  </div>

  <h5>Toggle range="max" mode test</h5>
  <RangeSlider id="toggle-range-max-test" range={isRangeMax ? 'max' : false} bind:values={toggleMaxValues} />
  <div class="controls">
    <button id="btn_toggle_range_max" on:click={() => (isRangeMax = !isRangeMax)}>
      Toggle Range Max Mode ({isRangeMax ? 'true' : 'false'})
    </button>
    <p>Current values: {toggleMaxValues}</p>
  </div>
</div>
