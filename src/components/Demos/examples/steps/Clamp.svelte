<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [-2, 10];
  const step = 7;
  const min = -6;
  const max = 24;
</script>

<RangeSlider {step} {min} {max} pips bind:values />
<code data-values title="The output slider values">{values}</code>