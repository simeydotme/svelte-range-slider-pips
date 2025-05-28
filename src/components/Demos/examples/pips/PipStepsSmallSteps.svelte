<script hide>
  import RangeSlider from 'svelte-range-slider-pips';
</script>

<RangeSlider max={10} step={1} precision={3} pips float last="label" />
<RangeSlider max={10} step={0.1} precision={3} pips float last="label" />
<RangeSlider max={10} step={0.01} precision={3} pips float last="label" />
<RangeSlider max={10} step={0.001} precision={3} pips float last="label" />