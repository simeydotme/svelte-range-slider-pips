<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [50, 20, 80];
</script>

<RangeSlider range="min" pips bind:values />
<RangeSlider range="max" pips bind:values />
<code data-values title="The output slider values">{values}</code>