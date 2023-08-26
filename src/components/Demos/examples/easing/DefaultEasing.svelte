<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [50];
  let jump = () => values[0] > 50 ? values[0] = 5 : values[0] = 95;
</script>

<RangeSlider bind:values />

<button type="button" on:click={jump}>
  Animate
</button>

<code data-values title="The output slider values">{values}</code>