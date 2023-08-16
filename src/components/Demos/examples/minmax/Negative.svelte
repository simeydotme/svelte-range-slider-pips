<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [-25, 25];
</script>

<RangeSlider min={-50} max={50} bind:values />

<code data-values title="The output slider values">{values}</code>