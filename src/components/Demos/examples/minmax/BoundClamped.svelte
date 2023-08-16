<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let minmax = [40, 60];
  let values = [0];
</script>

<RangeSlider bind:values={minmax} />
<RangeSlider min={ minmax[0] } max={ minmax[1] } bind:values pips />
<code data-values title="The output slider values">{minmax} | {values}</code>