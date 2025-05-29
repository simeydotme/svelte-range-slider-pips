<script>
  import RangeSlider from 'svelte-range-slider-pips';

  let value = 0.55;
</script>

<RangeSlider step={0.05} pipstep={2} max={1} pips all="label" float bind:value />

<code data-values title="The output slider values">{value}</code>