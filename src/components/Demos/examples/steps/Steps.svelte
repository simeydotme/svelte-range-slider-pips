<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let value = 2.5;
  let bigValue = 2000;
</script>

<p hide>0-20 slider with <code>step=2.5</code></p>

<RangeSlider step={2.5} pips max={20} all="label" bind:value />

<p hide>0-10,000 slider with <code>step=1000</code></p>

<RangeSlider step={1000} pips max={10000} all="label" bind:value={bigValue} />
<code data-values title="The output slider values">{value} | {bigValue}</code>

<style hide>

  p {
    margin-top: 1em;
  }
  :global(.slider-container .rangeSlider.pips) {
    margin-top: 0.5em!important;
    text-align: left!important;
  }
</style>