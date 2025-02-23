<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [40,60];
</script>

<RangeSlider limits={[20,80]} id="sliderLimits" range pips bind:values />

<style hide>
  :global(#sliderLimits) {
    --range-slider: #d096a6;
    --range-range-limit: rgb(0, 30, 56);
    --handle: #2ad872df;
    --handle-focus: #2ad872df;
    --handle-inactive: #2ad872df;
    --range-range-inactive: #2ad872df;
  }
  :global(#sliderLimits .rangeBar) {
    border-radius: 0;
    height: 22px;
    top: -7px;
  }
</style>

<code data-values title="The output slider values">{values}</code>