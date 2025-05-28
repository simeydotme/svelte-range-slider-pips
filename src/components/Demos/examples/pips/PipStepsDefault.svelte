<script hide>
  import RangeSlider from 'svelte-range-slider-pips';
</script>

<RangeSlider pips float last="label" />
    <!-- default max (100), will set pipstep to 5 (100/20) -->
<RangeSlider pips float last="label" max={10} />
    <!-- max = 10, will set pipstep to 1 -->
<RangeSlider pips float last="label" max={50} />
    <!-- max = 50, will set pipstep to 1 -->
<RangeSlider pips float last="label" max={200} />
    <!-- max = 200, will set pipstep to 10 (200/20) -->
<RangeSlider pips float last="label" max={20000} />
    <!-- max = 20000, will set pipstep to 1000 (20000/20) -->