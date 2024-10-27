<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [30,70];
</script>

<p>Normal</p>
<RangeSlider pips all="label" float range bind:values pipstep={20} />

<p>Reversed</p>
<RangeSlider reversed pips all="label" float range bind:values pipstep={20} />

<code data-values title="The output slider values">{values}</code>


<!-- hide -->
<style>
  p {
    margin-block-start: 2rem;
  }
  :global(.rangeSlider) {
    margin-block-start: 0.5rem!important;
  }
</style>
<!-- endhide -->