<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [30,70];
</script>

<RangeSlider reversed pips all="label" float range bind:values pipstep={20} />

<code data-values title="The output slider values">{values}</code>
