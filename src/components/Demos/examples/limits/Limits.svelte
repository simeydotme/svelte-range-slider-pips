<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let value = [50];
  let values = [40,60];
</script>

<RangeSlider limits={[20,80]} pips bind:value />
<RangeSlider limits={[20,80]} range pips pushy bind:values />
<code data-values title="The output slider values">{value} | {values}</code>