<script>
  import RangeSlider from 'svelte-range-slider-pips';
  import css from './Daisy.css?inline';
  /* hide */
  const renderCss = `<style>${css}</style>`;
  /* endhide */
  let minValues = [ 20 ];
  // use this class to change the position of the floats at certain values
  $: minFlip = minValues[0] <= 20;
  $: maxFlip = minValues[0] >= 80;

  let values = [ 20, 80 ];
  // use this class to change the position of the floats at certain values
  $: rangeFlip = values[1] - values[0] <= 20;
</script>

<div class="daisy-ui" class:minFlip class:maxFlip class:rangeFlip>
  <RangeSlider pips float pushy values={[20,80]} />
  <RangeSlider pips float pushy range bind:values />
  <RangeSlider pips float pushy range="min" bind:values={minValues} step={5} />
  <RangeSlider pips float pushy range="max" bind:values={minValues} step={5} />
</div>

<!-- hide -->
  {@html renderCss}
<!-- endhide -->