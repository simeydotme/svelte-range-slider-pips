<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let v1 = [50];
  let v2 = [5];
  let v3 = [25];
</script>

<RangeSlider pips bind:values={v1} />
<RangeSlider pips max={10} bind:values={v2} />
<RangeSlider pips max={50} bind:values={v3} />

<code data-values title="The output slider values">{v1} | {v2} | {v3}</code>