<script>
  import RangeSlider from 'svelte-range-slider-pips';

  let value = 0.555;
</script>

<RangeSlider step={0.005} pipstep={20} max={1} pips all="label" float bind:value />

<code data-values title="The output slider values">{value}</code>