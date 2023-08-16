<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [99];
  const prefix = "~";
  const suffix = " 🎈";
  $: final = prefix + values[0] + suffix; // reactive final value for use
</script>

<RangeSlider {prefix} {suffix} float pips last="label" range="min" max={99} step={9} bind:values />

<code title="The output slider values" data-values>
  {values} | {final}
</code>