<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';
  import type { SpringOpts } from 'svelte/motion';

  let values = [25, 75];
  let springEnabled = true;

  // Different spring configurations to test
  const configurations = [
    { name: 'Default', config: { stiffness: 0.15, damping: 0.4 } },
    { name: 'Fast & Responsive', config: { stiffness: 0.8, damping: 0.3 } },
    { name: 'Slow & Smooth', config: { stiffness: 0.05, damping: 0.8 } },
    { name: 'Bouncy', config: { stiffness: 0.9, damping: 0.1 } },
    { name: 'Stiff & Damped', config: { stiffness: 0.3, damping: 0.9 } },
    { name: 'Overshoot', config: { stiffness: 0.2, damping: 0.12 } },
    { name: 'Critical Damping', config: { stiffness: 0.4, damping: 0.4 } },
    { name: 'Twitchy', config: { stiffness: 0.95, damping: 0.05 } },
    { name: 'Very Slow', config: { stiffness: 0.01, damping: 0.99 } },
    { name: 'Elastic', config: { stiffness: 0.7, damping: 0.15 } }
  ];

  function jumpToRandom() {
    values = [Math.random() * 100, Math.random() * 100].sort((a, b) => a - b);
  }

  function resetValues() {
    values = [25, 75];
  }
</script>

<div class="slider-list">
  <h2>Spring Configuration Tests</h2>

  <div class="controls">
    <button on:click={jumpToRandom}>Jump to Random Values</button>
    <button on:click={resetValues}>Reset Values</button>
    <button on:click={() => (springEnabled = !springEnabled)}>
      {springEnabled ? 'Disable' : 'Enable'} Spring
    </button>
  </div>

  {#each configurations as { name, config }}
    <h3>{name}</h3>
    <p>stiffness: {config.stiffness}, damping: {config.damping}</p>
    <RangeSlider
      id="spring-{name.toLowerCase().replace(/\s+/g, '-')}"
      bind:values
      range
      spring={springEnabled}
      springValues={config}
    />
  {/each}
</div>

<style>
  .controls {
    display: flex;
    gap: 1rem;
    margin: 2rem 0;
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

  h3 {
    margin-top: 2rem;
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0 0 1rem 0;
    color: #666;
    font-family: monospace;
  }
</style>
