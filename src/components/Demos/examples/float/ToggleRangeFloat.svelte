<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [25,75];
</script>

<RangeSlider 
  bind:values 
  range
  rangeFloat={values[1] - values[0] < 30} 
  float={values[1] - values[0] >= 30} 
/>

<p>Try dragging the handles to see the floats toggle</p>

<code data-values title="The output slider values">{values}</code>