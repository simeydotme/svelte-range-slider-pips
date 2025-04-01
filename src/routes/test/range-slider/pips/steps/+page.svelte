<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';

  let hasCustomMinMax = false;
  let hasDynamicStep = false;
  let currentStep = 1;

  function toggleCustomMinMax() {
    hasCustomMinMax = !hasCustomMinMax;
  }

  function toggleDynamicStep() {
    hasDynamicStep = !hasDynamicStep;
    currentStep = hasDynamicStep ? 2.5 : 1;
  }
</script>

<div class="slider-list">
  <h5>Default step (max-min = 100)</h5>
  <RangeSlider id="default-step" pips all="label" />

  <h5>Default step (max-min = 1000)</h5>
  <RangeSlider id="default-step-1000" pips all="label" max={1000} />

  <h5>Default step (max-min = 10000)</h5>
  <RangeSlider id="default-step-10000" pips all="label" max={10000} />

  <h5>Default step (max-min = 100000)</h5>
  <RangeSlider id="default-step-100000" pips all="label" max={100000} />

  <h5>Default step (max = 90)</h5>
  <RangeSlider id="default-step-90" pips all="label" max={90} />

  <h5>Default step (min = 20)</h5>
  <RangeSlider id="default-step-20" pips all="label" min={20} />

  <h5>Default step (min = -20, max = 50)</h5>
  <RangeSlider id="default-step-minmax" pips all="label" min={-20} max={50} />

  <h5>Step of 5</h5>
  <RangeSlider id="step-5" pips all="label" step={5} />

  <h5>Step of 10</h5>
  <RangeSlider id="step-10" pips all="label" step={10} />

  <h5>Step of 2.5</h5>
  <RangeSlider id="step-2-5" pips all="label" step={2.5} />

  <h5>Step of 7.3</h5>
  <RangeSlider id="step-7-3" pips all="label" step={7.3} />

  <h5>Step of 13.7</h5>
  <RangeSlider id="step-13-7" pips all="label" step={13.7} />

  <h5>Step of 2.5 with custom min/max</h5>
  <RangeSlider id="step-2-5-minmax" pips all="label" step={2.5} min={20} max={80} />

  <h5>Step of 7.3 with custom min/max</h5>
  <RangeSlider id="step-7-3-minmax" pips all="label" step={7.3} min={10} max={90} />

  <h5>Step of 17 with custom min/max (wholly divisible)</h5>
  <RangeSlider id="step-17-minmax" pips all="label" step={17} min={17} max={85} />

  <h5>Step of 23 with custom min/max (not wholly divisible)</h5>
  <RangeSlider id="step-23-minmax" pips all="label" step={23} min={23} max={99} />

  <h5>Step of 0.1 (1000 steps)</h5>
  <RangeSlider id="step-0-1" pips all="label" step={0.1} />

  <h5>Step of 0.01 (10000 steps)</h5>
  <RangeSlider id="step-0-01" pips all="label" step={0.01} />

  <h5>Step of 100 (only 1 & 100 selectable)</h5>
  <RangeSlider id="step-100" pips all="label" step={100} />

  <h5>Step of 0.0001 (crazy number of steps to choose)</h5>
  <RangeSlider id="step-0-0001" pips all="label" step={0.0001} />

  <h5>Dynamic step control</h5>
  <div class="controls">
    <button id="toggle-step" on:click={toggleDynamicStep}>
      {hasDynamicStep ? 'Remove Step' : 'Add Step'}
    </button>
  </div>
  <RangeSlider id="dynamic-step" pips all="label" step={currentStep} />

  <h5>Dynamic min/max with step</h5>
  <div class="controls">
    <button id="toggle-minmax" on:click={toggleCustomMinMax}>
      {hasCustomMinMax ? 'Remove Min/Max' : 'Add Min/Max'}
    </button>
  </div>
  <RangeSlider
    id="dynamic-minmax"
    pips
    all="label"
    step={7.3}
    min={hasCustomMinMax ? 20 : 0}
    max={hasCustomMinMax ? 80 : 100}
  />
</div>
