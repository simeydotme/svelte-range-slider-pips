<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [2.5, 17.5];
  let bigValues = [2000, 8000];
</script>

<RangeSlider step={2.5} pips max={20} bind:values />
<RangeSlider step={1000} pips max={10000} bind:values={bigValues} />
<code data-values title="The output slider values">{values} | {bigValues}</code>