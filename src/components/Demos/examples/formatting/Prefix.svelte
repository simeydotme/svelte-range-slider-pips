<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [20];
</script>

<RangeSlider prefix="€" float pips first="label" last="label" max={10000} step={100} bind:values />

<code data-values title="The output slider values">{values}</code>