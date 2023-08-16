<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let v1 = [33];
  let v2 = [6];
  let v3 = [21];
</script>

<RangeSlider pips pipstep={3} bind:values={v1} />
<RangeSlider pips pipstep={3} max={10} bind:values={v2} />
<RangeSlider pips pipstep={3} max={50} bind:values={v3} />

<code data-values title="The output slider values">{v1} | {v2} | {v3}</code>