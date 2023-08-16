<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [10];
</script>

<RangeSlider min={0} max={100} bind:values />

<input type="number" bind:value={values[0]} />