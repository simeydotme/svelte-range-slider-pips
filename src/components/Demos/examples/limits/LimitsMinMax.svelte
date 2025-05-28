<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [50];
</script>

<RangeSlider limits={[20,80]} range="min" pips bind:values />
<RangeSlider limits={[20,80]} range="max" pips bind:values />

<code data-values title="The output slider values">{values}</code>