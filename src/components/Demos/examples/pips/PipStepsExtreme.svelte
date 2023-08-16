<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let v1 = [10000];
  let extreme = 2000000; // two million
  let v2 = { max: extreme, step: extreme/2, values: [0, extreme/2] }
</script>

<RangeSlider pips pipstep={10000} max={50000} all="label" bind:values={v1} />
<RangeSlider pips pipstep={v2.step} max={v2.max} all="label" range bind:values={v2.values} />

<code data-values title="The output slider values">{v1} | {v2.values}</code>