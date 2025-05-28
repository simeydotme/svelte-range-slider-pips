<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [10, 90];
</script>

<RangeSlider pips float range first=label last=label bind:values />