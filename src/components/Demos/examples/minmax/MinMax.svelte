<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [50];
</script>

<RangeSlider min={40} max={60} bind:values />

<code data-values title="The output slider values">{values}</code>