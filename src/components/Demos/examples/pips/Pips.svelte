<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [50];
  let smallValues = [3];
</script>

<RangeSlider pips bind:values />
<RangeSlider pips max={6} bind:values="{smallValues}" />
<code data-values title="The output slider values">{values} | {smallValues}</code>