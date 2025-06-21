<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';

  // Dynamic min/max state for testing
  let dynamicMin = 0;
  let dynamicMax = 100;
  let dynamicValues = [25, 75];

  // Toggle state for min/max changes
  let toggleMin = 0;
  let toggleMax = 100;
  let toggleValues = [30, 70];
</script>

<div class="slider-list">
  <h2>Default Min/Max Tests</h2>
  <h3>Default min/max (0/100)</h3>
  <RangeSlider id="default" pips first="label" last="label" />

  <h2>Min Only Tests</h2>
  <h3>Positive min (20)</h3>
  <RangeSlider id="min-20" pips first="label" last="label" min={20} />

  <h3>Negative min (-50)</h3>
  <RangeSlider id="min-neg-50" pips first="label" last="label" min={-50} />

  <h3>Decimal min (10.5)</h3>
  <RangeSlider id="min-decimal" pips first="label" last="label" min={10.5} />

  <h3>Large min (1000)</h3>
  <RangeSlider id="min-large" pips first="label" last="label" min={1000} />

  <h3>Very large min (1000000)</h3>
  <RangeSlider id="min-very-large" pips first="label" last="label" min={1000000} />

  <h2>Max Only Tests</h2>
  <h3>Small max (50)</h3>
  <RangeSlider id="max-50" pips first="label" last="label" max={50} />

  <h3>Negative max (-20)</h3>
  <RangeSlider id="max-neg-20" pips first="label" last="label" max={-20} />

  <h3>Decimal max (75.5)</h3>
  <RangeSlider id="max-decimal" pips first="label" last="label" max={75.5} />

  <h3>Large max (1000)</h3>
  <RangeSlider id="max-large" pips first="label" last="label" max={1000} />

  <h3>Very large max (1000000)</h3>
  <RangeSlider id="max-very-large" pips first="label" last="label" max={1000000} />

  <h2>Combined Min/Max Tests</h2>
  <h3>Positive range (20/80)</h3>
  <RangeSlider id="minmax-20-80" pips first="label" last="label" min={20} max={80} />

  <h3>Negative range (-80/-20)</h3>
  <RangeSlider id="minmax-neg-80-neg-20" pips first="label" last="label" min={-80} max={-20} />

  <h3>Cross-zero range (-50/50)</h3>
  <RangeSlider id="minmax-neg-50-50" pips first="label" last="label" min={-50} max={50} />

  <h3>Decimal range (10.5/90.5)</h3>
  <RangeSlider id="minmax-decimal" pips first="label" last="label" min={10.5} max={90.5} />

  <h3>Large range (1000/10000)</h3>
  <RangeSlider id="minmax-large" pips first="label" last="label" min={1000} max={10000} />

  <h3>Very large range (1000000/2000000)</h3>
  <RangeSlider id="minmax-very-large" pips first="label" last="label" min={1000000} max={2000000} />

  <h2>Asymmetric Range Tests</h2>
  <h3>Small to large (1/1000)</h3>
  <RangeSlider id="asymmetric-small-large" pips first="label" last="label" min={1} max={1000} />

  <h3>Negative to large (-100/1000)</h3>
  <RangeSlider id="asymmetric-neg-large" pips first="label" last="label" min={-100} max={1000} />

  <h3>Very negative to small (-1000/10)</h3>
  <RangeSlider id="asymmetric-very-neg-small" pips first="label" last="label" min={-1000} max={10} />

  <h3>Decimal to whole (0.5/100)</h3>
  <RangeSlider id="asymmetric-decimal-whole" pips first="label" last="label" min={0.5} max={100} />

  <h3>Whole to decimal (0/99.9)</h3>
  <RangeSlider id="asymmetric-whole-decimal" pips first="label" last="label" min={0} max={99.9} />

  <h2>Edge Cases</h2>
  <h3>Very close range (49.9/50.1)</h3>
  <RangeSlider id="edge-close-range" pips first="label" last="label" min={49.9} max={50.1} step={0.1} />

  <h3>Tiny decimal range (0.001/0.009)</h3>
  <RangeSlider id="edge-tiny-decimal" pips first="label" last="label" min={0.001} max={0.009} step={0.001} />

  <h3>Tiny decimal range (0.001/0.009) with precision set to 3</h3>
  <RangeSlider
    id="edge-tiny-decimal-precision"
    pips
    first="label"
    last="label"
    min={0.001}
    max={0.009}
    precision={3}
    step={0.001}
  />

  <h3>Huge range (-1000000/1000000)</h3>
  <RangeSlider id="edge-huge-range" pips first="label" last="label" min={-1000000} max={1000000} />

  <h2>Invalid Min/Max Tests</h2>

  <h3>Zero-width range (50/50)</h3>
  <RangeSlider id="edge-zero-width" pips first="label" last="label" min={50} max={50} />

  <h3>Min greater than max (80/20)</h3>
  <RangeSlider id="invalid-min-greater" pips first="label" last="label" min={80} max={20} />

  <h3>Max less than min (-20/-80)</h3>
  <RangeSlider id="invalid-max-less" pips first="label" last="label" min={-20} max={-80} />

  <h3>NaN values</h3>
  <RangeSlider id="invalid-nan" pips first="label" last="label" min={NaN} max={NaN} />

  <h3>Infinite values</h3>
  <RangeSlider id="invalid-infinite" pips first="label" last="label" min={-Infinity} max={Infinity} />

  <h2>Dynamic Min/Max Tests</h2>
  <h3>Dynamic min/max with bound inputs</h3>
  <RangeSlider
    id="dynamic-minmax"
    pips
    all="label"
    float
    bind:min={dynamicMin}
    bind:max={dynamicMax}
    bind:values={dynamicValues}
  />
  <div class="controls">
    <label>
      Min: <input type="number" bind:value={dynamicMin} step="any" />
    </label>
    <label>
      Max: <input type="number" bind:value={dynamicMax} step="any" />
    </label>
    <p>Current values: {dynamicValues}</p>
  </div>

  <h3>Dynamic min/max with toggle buttons</h3>
  <RangeSlider
    id="toggle-minmax"
    pips
    all="label"
    float
    bind:min={toggleMin}
    bind:max={toggleMax}
    bind:values={toggleValues}
  />
  <div class="controls">
    <button id="btn_toggle_min_positive" on:click={() => (toggleMin = 20)}>Set Min to 20</button>
    <button id="btn_toggle_min_negative" on:click={() => (toggleMin = -50)}>Set Min to -50</button>
    <button id="btn_toggle_min_decimal" on:click={() => (toggleMin = 10.5)}>Set Min to 10.5</button>
    <button id="btn_toggle_min_zero" on:click={() => (toggleMin = 0)}>Set Min to 0</button>
    <button id="btn_toggle_max_small" on:click={() => (toggleMax = 50)}>Set Max to 50</button>
    <button id="btn_toggle_max_negative" on:click={() => (toggleMax = -20)}>Set Max to -20</button>
    <button id="btn_toggle_max_decimal" on:click={() => (toggleMax = 75.5)}>Set Max to 75.5</button>
    <button id="btn_toggle_max_large" on:click={() => (toggleMax = 1000)}>Set Max to 1000</button>
    <button
      id="btn_toggle_both_positive"
      on:click={() => {
        toggleMin = 20;
        toggleMax = 80;
      }}>Set Range 20-80</button
    >
    <button
      id="btn_toggle_both_negative"
      on:click={() => {
        toggleMin = -80;
        toggleMax = -20;
      }}>Set Range -80 to -20</button
    >
    <button
      id="btn_toggle_both_cross_zero"
      on:click={() => {
        toggleMin = -50;
        toggleMax = 50;
      }}>Set Range -50 to 50</button
    >
    <button
      id="btn_toggle_both_decimal"
      on:click={() => {
        toggleMin = 10.5;
        toggleMax = 90.5;
      }}>Set Range 10.5 to 90.5</button
    >
    <p>Current values: {toggleValues}</p>
  </div>
</div>

<style>
  .controls {
    display: grid;
    grid-template-columns: repeat(4, max-content);
  }
</style>
