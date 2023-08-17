<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [ 20, 80 ];
  let minValues = [ 50 ];
  $: squished = minValues[0] <= 20;
</script>

<div class="daisy-ui" class:squished>
  <RangeSlider pips float range="min" bind:values={minValues} />
</div>
<div class="daisy-ui" class:squished>
  <RangeSlider pips float range bind:values />
</div>

<style lang="scss">
  .daisy-ui :global( .rangeSlider ) {
    font-size: 18px;
  }
  .daisy-ui :global( .rangeSlider .rangeBar ) {
    height: 1.4em;
    top: .25em;
    translate:  0 -50%;
  }
  .daisy-ui :global( .rangeSlider.range .rangeBar ) {
    border-radius: 0;
  }
  .daisy-ui :global( .rangeSlider.range.min .rangeBar ) {
    border-radius: 100px 0 0 100px;
  }
  .daisy-ui :global( .rangeSlider.range.max .rangeBar ) {
    border-radius: 0 100px 100px 0;
  }
  .daisy-ui :global( .rangeSlider .rangeNub ) {
    background: white;
    border: 3px solid var(--range-inactive);
  }
  .daisy-ui :global( .rangeSlider.focus .rangeNub ) {
    background: white;
    border: 3px solid var(--range);
  }
  .daisy-ui :global( .rangeSlider .rangeFloat ) {
    border-radius: 2em;
    min-width: 2em;
    left: 0!important;
    transform: translateX(100%)!important;
  }
  .daisy-ui:not(.squished) :global( .rangeSlider .rangeFloat ) {
    left: 0!important;
    transform: translateX(-100%)!important;
    background: transparent;
  }
</style>