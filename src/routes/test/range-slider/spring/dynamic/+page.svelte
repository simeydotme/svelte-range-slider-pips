<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';
  import type { SpringOpts } from 'svelte/motion';

  let value = 30;
  let springEnabled = true;
  let currentSpringValues: SpringOpts = { stiffness: 0.15, damping: 0.4 };

  // Sliders for adjusting spring values
  let stiffnessSlider = 0.15;
  let dampingSlider = 0.4;

  // Update spring values when sliders change
  $: {
    currentSpringValues = { stiffness: stiffnessSlider, damping: dampingSlider };
  }

  // Predefined spring configurations
  const presets = [
    { name: 'Default', stiffness: 0.15, damping: 0.4 },
    { name: 'Fast', stiffness: 0.8, damping: 0.8 },
    { name: 'Slow', stiffness: 0.05, damping: 0.8 },
    { name: 'Bouncy', stiffness: 0.9, damping: 0.1 },
    { name: 'Stiff', stiffness: 0.3, damping: 0.9 },
    { name: 'Overshoot', stiffness: 0.6, damping: 0.2 }
  ];

  function applyPreset(preset: (typeof presets)[0]) {
    stiffnessSlider = preset.stiffness;
    dampingSlider = preset.damping;
  }

  function jumpToRandom() {
    value = Math.random() * 100;
  }

  function resetValues() {
    value = 50;
  }

  function toggleSpring() {
    springEnabled = !springEnabled;
  }
</script>

<h2>Dynamic Spring Configuration Tests</h2>

<div class="slider-list">
  <div class="spring-controls">
    <h3>Spring Configuration</h3>
    <div class="control-group">
      <label for="stiffness">Stiffness: {stiffnessSlider.toFixed(2)}</label>
      <input id="stiffness" type="range" min="0.01" max="1" step="0.01" bind:value={stiffnessSlider} />
    </div>
    <div class="control-group">
      <label for="damping">Damping: {dampingSlider.toFixed(2)}</label>
      <input id="damping" type="range" min="0.01" max="1" step="0.01" bind:value={dampingSlider} />
    </div>
  </div>

  <div class="preset-controls">
    <h3>Preset Configurations</h3>
    <div class="preset-buttons">
      {#each presets as preset}
        <button on:click={() => applyPreset(preset)}>{preset.name}</button>
      {/each}
    </div>
  </div>

  <div class="test-controls">
    <h3>Test Controls</h3>
    <div class="control-buttons">
      <button on:click={jumpToRandom}>Jump to Random Values</button>
      <button on:click={resetValues}>Reset Values</button>
      <button on:click={toggleSpring}>
        {springEnabled ? 'Disable' : 'Enable'} Spring
      </button>
    </div>
  </div>

  <div class="slider-display">
    <h3>Slider with Current Spring Configuration</h3>
    <p>
      Current spring: stiffness={currentSpringValues.stiffness.toFixed(2)}, damping={currentSpringValues.damping.toFixed(
        2
      )}
    </p>
    <RangeSlider
      id="dynamic-spring-slider"
      bind:value
      range="min"
      spring={springEnabled}
      springValues={currentSpringValues}
    />
  </div>

  <div class="comparison-sliders">
    <h3>Comparison: Spring vs No Spring</h3>
    <div class="slider-pair">
      <div>
        <h4>With Spring</h4>
        <RangeSlider id="with-spring" {value} range="min" spring={true} springValues={currentSpringValues} />
      </div>
      <div>
        <h4>Without Spring</h4>
        <RangeSlider id="without-spring" {value} range="min" spring={false} />
      </div>
    </div>
  </div>
</div>

<style>
  .control-group {
    margin: 1rem 0;
  }

  .control-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  .control-group input[type='range'] {
    width: 100%;
    max-width: 300px;
  }

  .preset-buttons,
  .control-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  button {
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: #f5f5f5;
    cursor: pointer;
  }

  button:hover {
    background: #e5e5e5;
  }

  .slider-display {
    margin-top: 5rem;
    border-radius: 8px;
  }

  .slider-pair {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-top: 1rem;
  }

  .slider-pair > div {
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
  }

  h4 {
    margin: 0 0 1rem 0;
    text-align: center;
  }

  p {
    margin: 0 0 1rem 0;
    font-family: monospace;
    color: #666;
  }
</style>
