<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [7];
</script>

<RangeSlider formatter={v => v + "²"} handleFormatter={v => v * v} 
  float pips all="label" max={15} bind:values />

<code data-values title="The output slider values">{values}</code>