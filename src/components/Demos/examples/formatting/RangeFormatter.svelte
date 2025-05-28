<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [0,1000000];
  
  const short = new Intl.NumberFormat( "en-GB", { style: 'currency', currency: "GBP", notation: "compact" });
  const formatter = (v) => short.format(v);
  const rangeFormatter = (v1, v2) => `<em>from</em> <strong>${short.format(v1)}</strong> <em>to</em> <strong>${short.format(v2)}</strong>`;
</script>

<RangeSlider 
  bind:values
  range 
  rangeFloat 
  {rangeFormatter}
  {formatter}
  pips 
  all="label"
  step={1000}
  pipstep={500}
  max={1000000}
/>

<code data-values title="The output slider values">{values}</code>