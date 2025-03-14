<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';
  let value = 50;
</script>

<RangeSlider bind:value spring={false} />

<div class="value-display">
  <div>
    <label for="value-input">Current value:</label>
    <input type="number" id="value-input" bind:value />
  </div>

  {value}
</div>

<style>
  .value-display {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-top: 2rem;
    font-family: monospace;
  }
</style>
