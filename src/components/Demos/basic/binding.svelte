<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let value = 10;
</script>

<RangeSlider min={0} max={100} bind:value />

<input type="number" bind:value />