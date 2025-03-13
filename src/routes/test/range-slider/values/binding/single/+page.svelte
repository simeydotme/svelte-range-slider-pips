<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';
  let value = 50;
</script>

<RangeSlider bind:value />

<div class="value-display">
  <label for="value-input">Current value:</label>
  <input type="number" id="value-input" bind:value />

  {value}
</div>

<style>
  .value-display {
    margin-top: 1rem;
    font-family: monospace;
  }
</style>
