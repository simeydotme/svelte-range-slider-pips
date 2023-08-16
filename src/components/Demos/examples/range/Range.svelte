<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [20,80,100,0];
</script>

<RangeSlider range pips bind:values />
<code data-values title="The output slider values">{values}</code>