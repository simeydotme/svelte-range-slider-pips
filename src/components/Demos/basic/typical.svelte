<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [10];
</script>

<RangeSlider pips float first=label last=label bind:values />