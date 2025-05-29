<script>
  import RangeSlider from 'svelte-range-slider-pips';

  let value = 123.4567;
  const minuteFormat = new Intl.NumberFormat('en', { minimumIntegerDigits: 1 });
  const secondFormat = new Intl.NumberFormat('en', { minimumIntegerDigits: 2, minimumFractionDigits: 4, maximumFractionDigits: 4 });
  const timeFormat = (v) => `${minuteFormat.format(Math.floor(v / 60))}:${secondFormat.format(v % 60)}`;
</script>

<RangeSlider 
  bind:value 
  step={0.0001} 
  precision={4} 
  rangeGapMin={0.05}
  max={196} 
  float
  range='min'
  all="label"
  formatter={timeFormat}
/>

<code data-values title="The output slider values">{value}</code>