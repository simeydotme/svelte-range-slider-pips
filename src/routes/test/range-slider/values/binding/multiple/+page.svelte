<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';
  let values = [25, 75];
</script>

<div class="slider-list">
  <h5>Range slider with two-way binding on multiple values</h5>
  <RangeSlider bind:values range />

  <div class="controls font-mono">
    <div>
      <label for="value-input-1">First value: {values[0]}</label>
      <input type="number" id="value-input-1" bind:value={values[0]} />
    </div>
    <div>
      <label for="value-input-2">Second value: {values[1]}</label>
      <input type="number" id="value-input-2" bind:value={values[1]} />
    </div>
  </div>
</div>
