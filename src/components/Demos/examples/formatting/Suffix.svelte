<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [50];
</script>

<RangeSlider suffix="%" float pips all="label" max={100} step={25} bind:values />

<code data-values title="The output slider values">{values}</code>