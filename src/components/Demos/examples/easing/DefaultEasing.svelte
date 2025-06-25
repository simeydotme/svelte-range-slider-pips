<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let value = 50;
  const jump = () => value > 50 ? value = 5 : value = 95;
</script>

<RangeSlider bind:value />

<button type="button" on:click={jump}>
  Animate
</button>

<code data-values title="The output slider values">{value}</code>