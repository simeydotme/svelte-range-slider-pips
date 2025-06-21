<script lang="ts">
  import RangeSlider from '$components/RangeSlider.svelte';

  // Basic values for testing
  let values = [25, 75];
  let customValues = [30, 70];
  let pushyValues = [40, 60];
  let limitsValues = [20, 80];
  let stepValues = [35, 65];
  let precisionValues = [33.33, 66.67];

  // Dynamic state for testing
  let dynamicGapMin = 10;
  let dynamicGapMax = 30;
  let dynamicValues = [40, 60];

  // Test values for edge cases
  let zeroGapValues = [50, 50];
  let largeGapValues = [10, 90];
  let equalGapValues = [40, 60];
  let equalGapPushyToggle = false;
  // Additional test values
  let invalidGapValues = [30, 70];
  let disabledValues = [30, 70];
  let formatterValues = [30, 70];
  let pipValues = [30, 70];
  let floatValues = [30, 70];
  let keyboardValues = [-5, 5];

  // Event handling
  function handleChange(event: CustomEvent) {
    console.log(`Change event: [${event.detail.values[0]}, ${event.detail.values[1]}]`);
  }

  function handleStart(event: CustomEvent) {
    console.log(`Start event: [${event.detail.values[0]}, ${event.detail.values[1]}]`);
  }

  function handleStop(event: CustomEvent) {
    console.log(`Stop event: [${event.detail.values[0]}, ${event.detail.values[1]}]`);
  }
</script>

<div class="slider-list">
  <h2>Basic Range Gap Tests</h2>
  <h3>Default behavior - no gap constraints</h3>
  <RangeSlider id="default-gaps" range values={[25, 75]} />

  <h3>Minimum gap only - handles cannot be closer than 20 units</h3>
  <RangeSlider id="min-gap" range values={[30, 70]} rangeGapMin={20} />

  <h3>Maximum gap only - handles cannot be further than 40 units</h3>
  <RangeSlider id="max-gap" range values={[30, 70]} rangeGapMax={40} />

  <h3>Both gaps - handles must be between 20 and 40 units apart</h3>
  <RangeSlider id="both-gaps" range values={[30, 70]} rangeGapMin={20} rangeGapMax={40} />

  <h2>Edge Cases and Limits</h2>
  <h3>Equal gaps - handles must be exactly 30 units apart</h3>
  <RangeSlider id="equal-gaps" range values={[35, 65]} rangeGapMin={30} rangeGapMax={30} pushy={equalGapPushyToggle} />
  <div class="controls">
    <button
      id="btn_equal_gaps_pushy"
      class:btn-primary={equalGapPushyToggle}
      on:click={() => (equalGapPushyToggle = !equalGapPushyToggle)}
    >
      Enable pushy mode ({equalGapPushyToggle ? 'true' : 'false'})
    </button>
  </div>

  <h3>Zero gaps - handles can be at the same position</h3>
  <RangeSlider id="zero-gaps" range values={[50, 50]} rangeGapMin={0} rangeGapMax={0} />

  <h3>Large gaps - works with huge min/max values</h3>
  <RangeSlider
    id="large-gaps"
    min={-1000000}
    max={1000000}
    range
    values={[-400000, 100000]}
    rangeGapMin={10000}
    rangeGapMax={500000}
  />

  <h3>Invalid gap values - min greater than max</h3>
  <RangeSlider id="invalid-gaps" range values={[30, 70]} rangeGapMin={40} rangeGapMax={20} pushy />

  <h3>Negative gap values - should be ignored</h3>
  <RangeSlider id="negative-gaps" range values={[30, 70]} rangeGapMin={-20} rangeGapMax={-40} />

  <h3>Gaps larger than range - should be constrained</h3>
  <RangeSlider id="large-range-gaps" range values={[30, 70]} rangeGapMin={80} />

  <h2>Interaction with Range Slider Features</h2>
  <h3>Pushy mode with gaps - handles push each other when gap constraints are met</h3>
  <RangeSlider id="pushy-gaps" range values={[40, 60]} rangeGapMin={20} pushy />

  <h3>Limits with gaps - handles respect both limits and gaps</h3>
  <RangeSlider id="limits-gaps" range values={[30, 70]} rangeGapMin={20} limits={[20, 80]} />

  <h3>Step with gaps - handles align to step while respecting gaps</h3>
  <RangeSlider id="step-gaps" range values={[35, 65]} rangeGapMin={20} step={5} />

  <h3>Precision with gaps - handles respect precision while maintaining gaps</h3>
  <RangeSlider id="precision-gaps" range values={[33.33, 66.67]} rangeGapMin={20} precision={2} />

  <h2>Dynamic Gap Tests</h2>
  <h3>Dynamic gaps - gap constraints can be updated at runtime</h3>
  <RangeSlider
    id="dynamic-gaps"
    range
    bind:values={dynamicValues}
    bind:rangeGapMin={dynamicGapMin}
    bind:rangeGapMax={dynamicGapMax}
    on:change={handleChange}
    on:start={handleStart}
    on:stop={handleStop}
  />
  {dynamicValues} / min: {dynamicGapMin} / max: {dynamicGapMax}
  <div class="controls">
    <button id="btn_increase_min" on:click={() => (dynamicGapMin += 5)}>Increase Min Gap</button>
    <button id="btn_decrease_min" on:click={() => (dynamicGapMin -= 5)}>Decrease Min Gap</button>
    <button id="btn_increase_max" on:click={() => (dynamicGapMax += 5)}>Increase Max Gap</button>
    <button id="btn_decrease_max" on:click={() => (dynamicGapMax -= 5)}>Decrease Max Gap</button>
  </div>

  <h2>Accessibility Tests</h2>
  <h3>Gaps with aria labels - verify screen reader compatibility</h3>
  <RangeSlider id="aria-gaps" range values={[30, 70]} rangeGapMin={20} ariaLabels={['First handle', 'Second handle']} />

  <h3>Keyboard navigation with gaps - verify arrow key behavior</h3>
  <RangeSlider
    id="keyboard-gaps"
    range
    min={-10}
    max={10}
    step={0.1}
    bind:values={keyboardValues}
    rangeGapMin={2.5}
    rangeGapMax={5.5}
    ariaLabels={['First handle', 'Second handle']}
  />
  {keyboardValues}

  <h2>Event Handling Tests</h2>
  <h3>Events with gaps - verify event payloads</h3>
  <RangeSlider
    id="event-gaps"
    range
    values={[30, 70]}
    rangeGapMin={20}
    rangeGapMax={40}
    on:change={handleChange}
    on:start={handleStart}
    on:stop={handleStop}
  />

  <h2>Error Handling and Fallbacks</h2>
  <h3>Disabled state with gaps - verify constraints maintained</h3>
  <RangeSlider id="disabled-gaps" range values={[20, 80]} rangeGapMax={40} disabled />

  <h2>Performance Tests</h2>
  <h3>Large gap values - test performance with extreme gap constraints</h3>
  <RangeSlider id="large-gap-values" range values={[10, 90]} rangeGapMin={50} rangeGapMax={80} />
</div>
