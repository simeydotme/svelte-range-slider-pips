<script>
  import RangeSlider from 'svelte-range-slider-pips';
  import css from './Daisy.css';

  let values = [ 20, 80 ];
  // use this class to change the position of the floats at certain values
  $: rangeFlip = values[1] - values[0] <= 20;

  let rangeValues = [ 20 ];
  // use this class to change the position of the floats at certain values
  $: minFlip = rangeValues[0] <= 20;
  $: maxFlip = rangeValues[0] >= 80;
</script>

<div class="daisy-ui" class:minFlip class:maxFlip class:rangeFlip>
  <RangeSlider pips float pushy bind:values  />
  <RangeSlider pips float pushy range bind:values />
  <RangeSlider pips float pushy range="min" bind:values={rangeValues} step={5} />
  <RangeSlider pips float pushy range="max" bind:values={rangeValues} step={5} />
</div>
