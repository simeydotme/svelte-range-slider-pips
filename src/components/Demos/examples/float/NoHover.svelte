<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [25,75];
</script>

<RangeSlider float hoverable={false} range bind:values />

<code data-values title="The output slider values">{values}</code>