<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';
  let values = [25, 75];
</script>

<h5>Range slider with two-way binding on multiple values</h5>
<RangeSlider bind:values range  />

<div class="value-display">
  <div>
    <label for="value-input-1">First value:</label>
    <input type="number" id="value-input-1" bind:value={values[0]} />
  </div>
  <div>
    <label for="value-input-2">Second value:</label>
    <input type="number" id="value-input-2" bind:value={values[1]} />
  </div>

  {values}
</div>

<style>
  .value-display {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-top: 2rem;
    font-family: monospace;
  }
  .value-display > div {
    margin-bottom: 0.5rem;
  }
</style>
